import { Smartphone, Monitor, Download, Tablet, Loader2, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getDownloadStats } from "../services/supabase";

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);

      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

const LAUNCH_DATE = new Date('2026-01-01');

export default function Hero({ onOpenDownload }: { onOpenDownload: (variant: "auto" | "mobile" | "desktop" | "tablet") => void }) {
  const [downloadCount, setDownloadCount] = useState(0);
  const [isTotalMode, setIsTotalMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { weekly, total } = await getDownloadStats();
        const now = new Date();
        const oneYearAfterLaunch = new Date(LAUNCH_DATE);
        oneYearAfterLaunch.setFullYear(oneYearAfterLaunch.getFullYear() + 1);

        if (now > oneYearAfterLaunch) {
          setIsTotalMode(true);
          setDownloadCount(total);
        } else {
          setIsTotalMode(false);
          setDownloadCount(weekly);
        }
      } catch (e) {
        console.error("Failed to fetch download stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section id="download" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="noise-overlay" />
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/prism-logo.png" 
          className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] opacity-[0.05] blur-[80px] animate-float mix-blend-screen" 
        />
        <img 
          src="/prism-logo.png" 
          className="absolute bottom-[10%] right-[10%] w-[50rem] h-[50rem] opacity-[0.03] blur-[100px] animate-float mix-blend-screen [animation-delay:-5s]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/[0.03] border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-8 backdrop-blur-md">
            The Future of Active Listening
          </span>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 font-display leading-[1.05]">
            <span className="inline-flex items-center gap-4 sm:gap-6">
              <Headphones className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-brand-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
              <span className="text-white">Hear More.</span>
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-400 to-brand-500 animate-gradient-x p-2">
              Understand Better.
            </span>
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Listening Project leverages state-of-the-art AI to capture, transcribe, and analyze the emotional intelligence of every conversation.
          </p>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3 glass-panel rounded-full px-6 py-2.5 backdrop-blur-xl transition-all hover:scale-[1.02]">
              <div className={`w-2.5 h-2.5 ${downloadCount > 0 ? 'bg-brand-400 animate-pulse' : 'bg-gray-600'} rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]`} />
              <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Download className="w-4 h-4 text-brand-400" />
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <span className="text-white font-black tabular-nums tracking-wider text-base">
                    <AnimatedCounter value={downloadCount} />
                  </span>
                )}
                <span className="opacity-60">{isTotalMode ? " total downloads" : " downloads this week"}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 w-full">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenDownload("mobile")}
                className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-md text-brand-400 border border-brand-500/20 px-10 py-5 rounded-full font-bold hover:bg-brand-500/10 transition-all w-full sm:w-auto justify-center shadow-2xl"
              >
                <Smartphone className="w-6 h-6" />
                <span>Download for Mobile</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(0,229,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenDownload("desktop")}
                className="flex items-center gap-3 bg-gradient-to-br from-brand-400 to-brand-600 text-black px-10 py-5 rounded-full font-bold transition-all w-full sm:w-auto justify-center shadow-2xl shadow-brand-500/30 group"
              >
                <Monitor className="w-6 h-6 transition-transform group-hover:rotate-12" />
                <span>Download for Desktop</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, color: "#fff" }}
              onClick={() => onOpenDownload("tablet")}
              className="flex items-center gap-3 text-gray-500 px-8 py-3 rounded-full font-bold transition-all w-full sm:w-auto justify-center group"
            >
              <Tablet className="w-5 h-5 group-hover:text-brand-400 transition-colors" />
              <span>Download for Tablet</span>
            </motion.button>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-gray-600">
            iOS version in development
          </p>
        </motion.div>
      </div>
    </section>
  );
}
