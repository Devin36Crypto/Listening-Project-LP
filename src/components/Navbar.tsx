import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar({ onOpenDownload }: { onOpenDownload?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 glass-panel !border-t-0 !border-x-0 rounded-none z-[-1]" />
      <div className="noise-overlay" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.location.reload()}>
            <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold tracking-[-0.03em] font-display">
              Listening <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-400 to-brand-500">Project</span>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-10">
              <a href="#features" className="text-gray-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">Features</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">Stories</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">Pricing</a>
              
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                {(import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' && window.location.port !== '3001')) && (
                  <a 
                    href={import.meta.env.VITE_APP_URL || "http://localhost:3001"} 
                    className="bg-white/[0.03] hover:bg-white/[0.08] transition-all text-white px-6 py-2.5 rounded-full text-sm font-bold border border-white/10 hover:border-brand-500/30"
                  >
                    Launch App
                  </a>
                )}
                <a
                  href="https://play.google.com/store/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-brand-400 to-brand-600 hover:scale-105 active:scale-95 transition-all text-black px-6 py-2.5 rounded-full text-sm font-black flex items-center gap-2 shadow-[0_10px_20px_rgba(0,229,255,0.25)]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <span>Google Play</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-400 hover:text-white transition-all"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel !border-x-0 !border-b-0 rounded-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-lg font-bold hover:text-brand-400 transition-colors">Features</a>
            <a href="#testimonials" className="block text-lg font-bold hover:text-brand-400 transition-colors">Stories</a>
            <a href="#pricing" className="block text-lg font-bold hover:text-brand-400 transition-colors">Pricing</a>
            <div className="pt-4 flex flex-col gap-4">
               <a 
                href={import.meta.env.VITE_APP_URL || "http://localhost:3001"} 
                className="w-full text-center bg-white/[0.05] text-white py-4 rounded-2xl font-bold border border-white/10"
              >
                Launch App
              </a>
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-br from-brand-400 to-brand-600 text-black py-4 rounded-2xl font-black text-center shadow-xl shadow-brand-500/20"
              >
                Get on Google Play
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
