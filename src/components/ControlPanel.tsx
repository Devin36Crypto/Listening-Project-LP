import React from 'react';
import { Mic, MicOff, Settings, History, X } from 'lucide-react';

interface ControlPanelProps {
  isConnected: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onCloseApp: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isConnected,
  isRecording,
  onToggleRecording,
  onOpenSettings,
  onOpenHistory,
  onCloseApp
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 pb-8 safe-area-bottom">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Controls */}
        <div className="flex gap-2">
            <button 
                onClick={onOpenHistory}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                title="History"
            >
                <History size={20} />
            </button>
            <button 
                onClick={onOpenSettings}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                title="Settings"
            >
                <Settings size={20} />
            </button>
        </div>

        {/* Main Action */}
        <button
            onClick={onToggleRecording}
            className={`
                relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                ${isRecording 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 scale-110' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                }
            `}
        >
            {isRecording ? (
                <>
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 opacity-30 animate-ping"></span>
                    <MicOff size={28} className="text-white relative z-10" />
                </>
            ) : (
                <Mic size={28} className="text-white" />
            )}
        </button>

        {/* Right Controls (Exit) */}
        <div className="flex gap-2">
            <button 
                onClick={onCloseApp}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-all"
                title="Exit App"
            >
                <X size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
