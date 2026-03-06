export type Log = LogMessage;

export enum AppMode {
    LIVE_TRANSLATOR = 'LIVE_TRANSLATOR',
    OFFLINE_MODE = 'OFFLINE_MODE',
    LOCKED = 'LOCKED',
    VOICE_CONVERSATION = 'VOICE_CONVERSATION'
}

export type NoiseLevel = 'off' | 'low' | 'high';

export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export interface Settings {
    targetLanguage: string;
    voice: VoiceName;
    autoSpeak: boolean;
    noiseCancellationLevel: NoiseLevel;
    pushToTalk: boolean;
}

export interface LogMessage {
    id: string;
    role: 'user' | 'model' | 'system' | 'date-marker';
    text: string;
    timestamp: Date;
    isError?: boolean;
    speakerId?: string;
}

export interface PeerNode {
    id: string;
    name: string;
    position: { x: number; y: number };
    status: 'active' | 'inactive';
}

export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface Session {
    id: string;
    startTime: Date;
    endTime?: Date;
    mode: AppMode;
    targetLanguage: string;
    logs: LogMessage[];
    speakerRegistry: Record<string, string>;
}
