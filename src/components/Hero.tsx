import { motion } from "motion/react";
import { ArrowRight, PlayCircle, Smartphone, Monitor } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-6 backdrop-blur-sm">
            The Future of Active Listening
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
            Hear More. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Understand Better.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The Listening Project uses advanced AI to help you capture, analyze, and truly understand every conversation. Available now on Android and Desktop.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center">
              <Smartphone className="w-5 h-5" />
              Download for Android
            </button>
            <button className="flex items-center gap-2 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center">
              <Monitor className="w-5 h-5" />
              Download for Desktop
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            iOS version coming soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
