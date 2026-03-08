import { useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import Visualizer from "./Visualizer";
import ChatList from "./ChatList";
import ControlPanel from "./ControlPanel";
import SettingsModal from "./SettingsModal";
import HistoryModal from "./HistoryModal";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import HelpCenterModal from "./HelpCenterModal";
import ContactModal from "./ContactModal";
import { useAudioSession } from "../hooks/useAudioSession";
import { Settings, Session } from "../types";
import { getSessions, importSessions, clearAllSessions, getStorageUsage } from "../services/db";

interface ListeningAppProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstall: () => void;
}

export default function ListeningApp({ onClose, deferredPrompt, onInstall }: ListeningAppProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [storageUsage, setStorageUsage] = useState(0);

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      targetLanguage: 'English',
      voice: 'Puck',
      autoSpeak: true,
      noiseCancellationLevel: 'high',
      pushToTalk: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const { isConnected, isRecording, logs, volume, error, isOffline, toggleRecording } = useAudioSession({ settings });

  useEffect(() => {
    if (isSettingsOpen) {
      updateStorageUsage();
    }
  }, [isSettingsOpen]);

  // Onboarding check
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setIsHelpOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const updateStorageUsage = async () => {
    const usage = await getStorageUsage();
    setStorageUsage(usage);
  };

  const handleExport = async () => {
    try {
      const sessions = await getSessions(null);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "listening_history_" + new Date().toISOString() + ".json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
    }
  };

  const handleImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const sessions = JSON.parse(text, (key, value) => {
            if (key === 'startTime' || key === 'endTime' || key === 'timestamp') {
                return new Date(value);
            }
            return value;
        }) as Session[];
        
        await importSessions(sessions, null);
        alert("Import successful!");
        updateStorageUsage();
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import data. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to delete all local history? This cannot be undone.")) {
      await clearAllSessions();
      updateStorageUsage();
      alert("All data cleared.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex flex-col overflow-hidden">
      <AppHeader />
      
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium z-50 animate-in fade-in slide-in-from-top-2">
          You are currently offline. Recording is disabled, but you can view your history.
        </div>
      )}
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Visualizer Area */}
        <div className="flex-none p-4 z-10">
          <Visualizer isActive={isRecording} volume={volume} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 relative z-0 overflow-hidden">
           <ChatList logs={logs} />
        </div>

        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
            {error}
          </div>
        )}
      </main>

      <ControlPanel 
        isConnected={isConnected}
        isRecording={isRecording}
        isOffline={isOffline}
        onToggleRecording={toggleRecording}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onCloseApp={onClose}
      />

      {/* Modals available in App Mode */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdate={setSettings}
        onExport={handleExport}
        onImport={handleImport}
        onClearData={handleClearData}
        storageUsage={storageUsage}
        canInstall={!!deferredPrompt}
        onInstall={onInstall}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        vaultKey={null}
        onSelectSession={() => {}}
      />
      
      {/* Support Modals for App View */}
      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <HelpCenterModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        onContactSupport={() => {
          setIsHelpOpen(false);
          setIsContactOpen(true);
        }}
      />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
