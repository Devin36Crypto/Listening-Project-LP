import { motion } from "motion/react";
import { Brain, Mic, MessageSquare, Zap, Shield, Globe, Users, Cloud } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Universal Translator",
    description: "Instantly translate spoken audio into your target language with near-zero latency using Gemini Flash."
  },
  {
    icon: Shield,
    title: "Private Vault Keys",
    description: "Secure your session history with a local Vault Key. Only you hold the key to decrypt your personal data."
  },
  {
    icon: Zap,
    title: "Offline Intelligence",
    description: "Continue recording and transcribing even without a connection using optimized on-device neural models."
  },
  {
    icon: Brain,
    title: "AI Audio Insights",
    description: "Ask questions about any conversation or extract action items with context-aware AI analysis."
  },
  {
    icon: Users,
    title: "Spatial Peer Sync",
    description: "Discover nearby users for synchronized group translation sessions and shared session contexts."
  },
  {
    icon: Cloud,
    title: "Encrypted Cloud Sync",
    description: "Securely backup your encrypted sessions to the cloud and sync across all your devices seamlessly."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 font-display tracking-tight leading-[1.1]">
            Experience Pure <span className="text-brand-400">Clarity</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Every feature is meticulously crafted to bridge the gap between spoken words and true emotional understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-panel p-10 rounded-[2.5rem] group hover:border-brand-500/30 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="w-16 h-16 bg-brand-500/10 rounded-3xl flex items-center justify-center mb-8 text-brand-400 relative overflow-hidden group-hover:bg-brand-500/20 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <feature.icon className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
