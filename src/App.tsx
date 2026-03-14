import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import LegalBanner from "./components/LegalBanner";

// Lazy load large components/modals
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const FeaturesModal = lazy(() => import("./components/FeaturesModal"));
const AboutModal = lazy(() => import("./components/AboutModal"));
const ChangelogModal = lazy(() => import("./components/ChangelogModal"));
const HelpCenterModal = lazy(() => import("./components/HelpCenterModal"));
const ContactModal = lazy(() => import("./components/ContactModal"));
const LegalDisclaimerModal = lazy(() => import("./components/LegalDisclaimerModal"));
const SystemStatusModal = lazy(() => import("./components/SystemStatusModal"));
const ListeningApp = lazy(() => import("./components/ListeningApp"));
const DownloadModal = lazy(() => import("./components/DownloadModal"));
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

  // Only redirect to the "App" view if logged in AND the download modal isn't active
  // This allows users to finish the Signup -> Payment -> Install flow without the modal disappearing
  if (session && !isDownloadOpen) {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center text-brand-500"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <ListeningApp
          onClose={() => supabase.auth.signOut()}
          deferredPrompt={deferredPrompt}
          onInstall={handleInstallApp}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans selection:bg-brand-500/30 overflow-x-hidden relative">
      {/* Dynamic Background Atmosphere with Prism Icons */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[180px] animate-neural-glow" />
        
        {/* Floating branded elements for premium feel */}
        <img 
          src="/prism-official-brand-mark.png" 
          alt="" 
          className="absolute top-[15%] right-[10%] w-40 h-40 opacity-15 blur-[1px] animate-float" 
          style={{ animationDelay: '-4s' }}
        />
        <img 
          src="/prism-master-verified.webp" 
          alt="" 
          className="absolute bottom-[20%] left-[5%] w-56 h-56 opacity-10 blur-[3px] animate-float" 
          style={{ animationDelay: '-12s' }}
        />
      </div>

      <div className="relative z-10 transition-opacity duration-500">
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
        <Suspense fallback={null}>
          <DownloadModal
            isOpen={isDownloadOpen}
            onClose={() => setIsDownloadOpen(false)}
            deferredPrompt={deferredPrompt}
            handleInstallApp={handleInstallApp}
            variant={downloadVariant}
            initialPlanId={initialPlanId}
          />
        </Suspense>

        <Suspense fallback={null}>
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
        </Suspense>
      </div>
    </div>
  );
}
