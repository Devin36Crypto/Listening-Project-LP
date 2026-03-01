import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import DeviceCheck from "./components/DeviceCheck";
import { useState, lazy, Suspense } from "react";

// Lazy load heavy components and modals
const Testimonials = lazy(() => import("./components/Testimonials"));
const Pricing = lazy(() => import("./components/Pricing"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));
const TTSDemo = lazy(() => import("./components/TTSDemo"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const FeaturesModal = lazy(() => import("./components/FeaturesModal"));
const AboutModal = lazy(() => import("./components/AboutModal"));

export default function App() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
          <Testimonials />
          <TTSDemo />
          <Pricing />
          <ChatWidget />
        </Suspense>
        <DeviceCheck />
      </main>
      <Footer 
        onOpenPrivacy={() => setIsPrivacyOpen(true)} 
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenFeatures={() => setIsFeaturesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />
      
      <Suspense fallback={null}>
        {isPrivacyOpen && <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />}
        {isTermsOpen && <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
        {isFeaturesOpen && <FeaturesModal isOpen={isFeaturesOpen} onClose={() => setIsFeaturesOpen(false)} />}
        {isAboutOpen && <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />}
      </Suspense>
    </div>
  );
}
