import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import LegalBanner from "./components/LegalBanner";
import DownloadModal from "./components/DownloadModal";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import FeaturesModal from "./components/FeaturesModal";
import AboutModal from "./components/AboutModal";
import ChangelogModal from "./components/ChangelogModal";
import HelpCenterModal from "./components/HelpCenterModal";
import ContactModal from "./components/ContactModal";
import LegalDisclaimerModal from "./components/LegalDisclaimerModal";
import SystemStatusModal from "./components/SystemStatusModal";
import ListeningApp from "./components/ListeningApp";
import { supabase } from "./services/supabase";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadVariant, setDownloadVariant] = useState<"auto" | "mobile" | "desktop" | "tablet">("auto");
  const [initialPlanId, setInitialPlanId] = useState<string | undefined>(undefined);
  
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleOpenDownload = (variant: "auto" | "mobile" | "desktop" | "tablet" = "auto", planId?: string) => {
    setDownloadVariant(variant);
    setInitialPlanId(planId);
    setIsDownloadOpen(true);
  };

  if (session) {
    return (
      <ListeningApp 
        onClose={() => supabase.auth.signOut()} 
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallApp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <Navbar onOpenDownload={() => handleOpenDownload("auto")} />
      
      <main>
        <Hero onOpenDownload={handleOpenDownload} />
        <Features />
        <Testimonials />
        <Pricing onPlanSelect={(variant, planId) => handleOpenDownload(variant, planId)} />
      </main>

      <Footer 
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenFeatures={() => setIsFeaturesModalOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDownload={() => handleOpenDownload("auto")}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenStatus={() => setIsStatusOpen(true)}
      />

      <LegalBanner />

      {/* Modals */}
      <DownloadModal 
        isOpen={isDownloadOpen} 
        onClose={() => setIsDownloadOpen(false)} 
        deferredPrompt={deferredPrompt}
        handleInstallApp={handleInstallApp}
        variant={downloadVariant}
        initialPlanId={initialPlanId}
      />

      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <FeaturesModal isOpen={isFeaturesModalOpen} onClose={() => setIsFeaturesModalOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
      <HelpCenterModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        onContactSupport={() => {
          setIsHelpOpen(false);
          setIsContactOpen(true);
        }}
      />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <LegalDisclaimerModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
      <SystemStatusModal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
    </div>
  );
}
