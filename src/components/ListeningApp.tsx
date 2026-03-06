import { useState } from "react";
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
import { Settings } from "../types";

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

  const [settings, setSettings] = useState<Settings>({
    targetLanguage: 'English',
    voice: 'Puck',
    autoSpeak: true,
    noiseCancellationLevel: 'high',
    pushToTalk: false,
  });

  const { isConnected, isRecording, logs, volume, error, toggleRecording } = useAudioSession({ settings });

  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex flex-col overflow-hidden">
      <AppHeader />
      
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
        onExport={() => {}}
        onImport={() => {}}
        onClearData={() => {}}
        storageUsage={0}
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
