import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Settings, Log, Session, AppMode } from '../types';
import { saveSession } from '../services/db';

interface UseAudioSessionProps {
  settings: Settings;
}

export function useAudioSession({ settings }: UseAudioSessionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null); // GoogleGenAI Session
  const currentSessionIdRef = useRef<string | null>(null);

  // Initialize Audio Context
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: settings.noiseCancellationLevel !== 'off',
          autoGainControl: true
        } 
      });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet.addModule(new URL('../workers/audio.processor.ts', import.meta.url));

      const source = audioContext.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioContext, 'audio-processor');

      worklet.port.onmessage = (event) => {
        const float32Data = event.data;
        // Convert Float32 to Int16 for Gemini
        const int16Data = new Int16Array(float32Data.length);
        for (let i = 0; i < float32Data.length; i++) {
          const s = Math.max(-1, Math.min(1, float32Data[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Calculate volume for visualizer
        let sum = 0;
        for (let i = 0; i < float32Data.length; i++) {
            sum += float32Data[i] * float32Data[i];
        }
        const rms = Math.sqrt(sum / float32Data.length);
        setVolume(Math.min(1, rms * 5)); // Boost a bit for visualizer

        // Send to Gemini if connected
        if (sessionRef.current && isRecording) {
            // Convert to base64
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
            sessionRef.current.sendRealtimeInput([{
                mimeType: "audio/pcm;rate=16000",
                data: base64Data
            }]);
        }
      };

      source.connect(worklet);
      // worklet.connect(audioContext.destination); // Don't connect to destination to avoid feedback loop

      audioContextRef.current = audioContext;
      workletNodeRef.current = worklet;
      sourceNodeRef.current = source;
      
      return true;
    } catch (err) {
      console.error("Audio init error:", err);
      setError("Failed to access microphone. Please check permissions.");
      return false;
    }
  };

  const connect = useCallback(async () => {
    try {
      setError(null);
      const apiKey = process.env.GEMINI_API_KEY; // This should be available in the env
      if (!apiKey) {
        throw new Error("Gemini API Key not found");
      }

      const client = new GoogleGenAI({ apiKey });
      
      // Start a new session log
      const newSessionId = crypto.randomUUID();
      currentSessionIdRef.current = newSessionId;
      setLogs([]);

      const session = await client.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
            onopen: () => {
                console.log("Connected to Gemini Live");
                setIsConnected(true);
                setIsRecording(true);
            },
            onmessage: (message: LiveServerMessage) => {
                // Handle audio output
                const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    playAudio(audioData);
                }

                // Handle text transcription (if available in future or via tool)
                // For now, we simulate logs or if the model sends text parts
                const textPart = message.serverContent?.modelTurn?.parts?.find(p => p.text);
                if (textPart && textPart.text) {
                     const newLog: Log = {
                        id: crypto.randomUUID(),
                        role: 'model',
                        text: textPart.text,
                        timestamp: new Date()
                    };
                    setLogs(prev => [...prev, newLog]);
                }
            },
            onclose: () => {
                console.log("Disconnected from Gemini Live");
                setIsConnected(false);
                setIsRecording(false);
            },
            onerror: (err: any) => {
                console.error("Gemini Live Error:", err);
                setError("Connection error: " + (err.message || String(err)));
                disconnect();
            }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voice || "Puck" } }
            },
            systemInstruction: {
                parts: [{ text: `You are a helpful translator and assistant. Your target language is ${settings.targetLanguage}. Translate what you hear or answer questions.` }]
            }
        }
      });

      sessionRef.current = session;

      // Initialize audio if not already
      if (!audioContextRef.current) {
        await initAudio();
      } else {
        audioContextRef.current.resume();
      }

    } catch (err: any) {
      console.error("Connection failed:", err);
      setError(err.message || "Failed to connect");
      setIsConnected(false);
    }
  }, [settings]);

  const disconnect = useCallback(async () => {
    // Close session (no close method on the session object directly in some versions, but let's try)
    // Actually the SDK might manage it.
    // We can just stop sending data.
    sessionRef.current = null;
    
    if (audioContextRef.current) {
        audioContextRef.current.suspend();
    }

    setIsConnected(false);
    setIsRecording(false);

    // Save session to DB
    if (currentSessionIdRef.current && logs.length > 0) {
        const sessionToSave: Session = {
            id: currentSessionIdRef.current,
            startTime: logs[0].timestamp,
            endTime: new Date(),
            logs: logs,
            mode: AppMode.VOICE_CONVERSATION,
            targetLanguage: settings.targetLanguage,
            speakerRegistry: {}
        };
        await saveSession(sessionToSave, null);
    }
  }, [logs, settings.targetLanguage]);

  const playAudio = async (base64Data: string) => {
    if (!settings.autoSpeak) return;
    
    try {
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // PCM data from Gemini is usually 24kHz.
        // We need to decode or play raw PCM.
        // The SDK might return PCM. Let's assume PCM 24kHz 1 channel.
        
        // Simple PCM player
        const audioCtx = new AudioContext({ sampleRate: 24000 });
        const buffer = audioCtx.createBuffer(1, bytes.length / 2, 24000);
        const channelData = buffer.getChannelData(0);
        const int16 = new Int16Array(bytes.buffer);
        
        for (let i = 0; i < int16.length; i++) {
            channelData[i] = int16[i] / 32768.0;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
        
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  const toggleRecording = useCallback(() => {
    if (isConnected) {
        disconnect();
    } else {
        connect();
    }
  }, [isConnected, connect, disconnect]);

  return {
    isConnected,
    isRecording,
    logs,
    volume,
    error,
    toggleRecording
  };
}
