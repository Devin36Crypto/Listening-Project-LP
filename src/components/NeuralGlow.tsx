import { motion, useScroll, useTransform } from "motion/react";

export default function NeuralGlow() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, 500]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -300]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Primary Neural Pulse */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-500/5 rounded-full blur-[120px] animate-neural-glow mix-blend-screen" 
      />
      
      {/* Secondary Atmosphere */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-900/5 rounded-full blur-[100px] animate-float mix-blend-screen" 
      />

      {/* Floating Branded Prism Marks */}
      <img 
        src="/prism-logo.png" 
        className="absolute top-[20%] left-[5%] w-32 h-32 opacity-[0.03] blur-[2px] animate-float pointer-events-none" 
      />
      <img 
        src="/prism-logo.png" 
        className="absolute bottom-[20%] right-[5%] w-48 h-48 opacity-[0.02] blur-[4px] animate-float [animation-delay:-8s]" 
      />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ 
        backgroundImage: `radial-gradient(circle at 1px 1px, #33e8ff 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
    </div>
  );
}
