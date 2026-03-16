import { motion } from "motion/react";
import { Check, Smartphone, Calendar } from "lucide-react";

const plans = [
  {
    name: "Monthly",
    price: "$4",
    period: "/month",
    description: "Flexible billing. Cancel anytime.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Unlimited transcription",
      "Deep emotional analysis",
      "Real-time coaching",
      "Secure local storage",
      "High-fidelity audio"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "mobile",
    planId: "mobile-monthly"
  },
  {
    name: "Tablet",
    price: "$6",
    period: "/month",
    description: "Optimized for larger screens. Connect multiple devices.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Optimized for tablets",
      "Add devices for $5/mo each",
      "Split-screen multitasking",
      "Handwriting recognition",
      "Everything in Monthly"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "tablet",
    planId: "tablet-monthly"
  },
  {
    name: "Desktop",
    price: "$8",
    period: "/month",
    description: "Power user suite. Full desktop integration.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Optimized for desktop",
      "Add devices for $6/mo each",
      "Advanced export tools",
      "Unlimited local storage",
      "Everything in Tablet"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "desktop",
    planId: "desktop-monthly"
  },
  {
    name: "Annual",
    price: "$40",
    period: "/year",
    description: "Mobile: $40/yr. Tablet: $60/yr. Desktop: $80/yr.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Save ~17% on any plan",
      "Priority support",
      "Early access to new features",
      "2 months free"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: true,
    variant: "mobile",
    planId: "mobile-annual"
  }
];

interface PricingProps {
  onPlanSelect?: (variant: "auto" | "mobile" | "desktop" | "tablet", planId: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements with Prism branding */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[120px]" />
        <img 
          src="/prism-master-verified.webp" 
          alt="" 
          className="absolute top-[10%] left-[5%] w-48 h-48 opacity-10 blur-[2px] animate-float" 
        />
        <img 
          src="/prism-official-brand-mark.png" 
          alt="" 
          className="absolute bottom-[10%] right-[5%] w-40 h-40 opacity-5 blur-[1px] animate-float" 
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Download for free. Try everything for 3 days. Then choose the plan that works for you.
          </p>

          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 text-brand-400 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>One active device per subscription</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative p-10 rounded-[2.5rem] border flex flex-col transition-all duration-500 hover:scale-[1.03] ${plan.popular
                ? "glass-panel !bg-brand-500/[0.05] border-brand-500/50 shadow-2xl shadow-brand-500/10"
                : "glass-panel border-white/10"
                }`}
            >
              <div className="noise-overlay" />

              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-400 to-brand-600 text-black px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/30">
                  Best Value
                </div>
              )}

              <div className="mb-10 text-center">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-[0.2em] text-gray-400">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-6xl font-black font-display tracking-tight">{plan.price}</span>
                  <span className="text-gray-500 text-xl font-light">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-5 mb-10">
                <div className="bg-brand-500/5 rounded-2xl p-5 mb-8 border border-brand-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4 text-brand-400 font-bold text-sm">
                    <Calendar className="w-5 h-5" />
                    <span>3-Day Free Trial</span>
                  </div>
                  <p className="text-[11px] text-brand-400/60 mt-1.5 ml-9 leading-tight">
                    Full access. No charges until day 4.
                  </p>
                </div>

                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 text-sm text-gray-300 font-light">
                    <Check className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onPlanSelect?.(plan.variant as any, plan.planId)}
                className={`w-full py-5 rounded-2xl font-black transition-all text-sm uppercase tracking-widest shadow-2xl ${plan.popular
                    ? "bg-gradient-to-br from-brand-400 to-brand-600 text-black hover:scale-[1.02] shadow-brand-500/25"
                    : "bg-white/[0.05] text-white hover:bg-white/10 border border-white/10"
                  }`}
              >
                {plan.cta}
              </button>

              <p className="text-center text-[10px] uppercase font-bold tracking-widest text-gray-600 mt-6">
                Cancel Anytime
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
