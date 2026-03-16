import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "./services/supabase";
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
import NeuralGlow from "./components/NeuralGlow";

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
    if (!supabase) return;

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

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-500/30 overflow-x-hidden relative">
      <NeuralGlow />

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
