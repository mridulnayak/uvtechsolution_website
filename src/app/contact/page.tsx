"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// ─── Computational Schemas ───────────────────────────────────────────────────

/**
 * Zod validation primitive for initial user identification and reachability.
 */
const identitySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
});

/**
 * Zod validation primitive for technical project requirements and messaging.
 */
const requirementSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

/**
 * Merged schema representing the full validation lifecycle of a contact inquiry.
 */
const contactInquirySchema = identitySchema.merge(requirementSchema);

/**
 * Technical type representation inferred from the inquiry schema.
 */
type ContactInquiryPayload = z.infer<typeof contactInquirySchema>;

/**
 * Global enterprise service modules available for consultation inquiries.
 */
const CONSULTATION_SERVICES = [
  "Hoteleo - Hotel Management Setup",
  "Restpro - Restaurant Billing Setup",
  "Managed Deployment & Installation",
  "Priority Technical Support (AMC)",
  "Custom Module Development",
  "New Collaboration / Business Idea",
  "Other Inquiry",
];

/**
 * Human-readable titles for the multi-stage implementation pipeline.
 */
const INQUIRY_PIPELINE_STAGES = ["Identity Verification", "Project Architecture", "Successfully Deployed"];

// ─── Pipeline Progress Component ─────────────────────────────────────────────

/**
 * Multi-stage progress visualizer for the inquiry pipeline.
 * Synchronizes the visual state with the active implementation stage.
 * 
 * @param activeStageIndex - The zero-based index of the current stage.
 * @param stageCount - The total number of stages in the pipeline.
 */
function PipelineProgressIndicator({ activeStageIndex, stageCount }: { activeStageIndex: number; stageCount: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {Array.from({ length: stageCount }).map((_, stageIndex) => (
        <div key={stageIndex} className="flex items-center gap-3 flex-1 last:flex-none">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 flex-shrink-0 ${
              stageIndex < activeStageIndex
                ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                : stageIndex === activeStageIndex
                ? "bg-brand-green text-white ring-4 ring-brand-green/10"
                : "bg-white/5 text-gray-400"
            }`}
          >
            {stageIndex < activeStageIndex ? <CheckCircle className="w-5 h-5 animate-pulse" /> : stageIndex + 1}
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest hidden lg:block ${
              stageIndex === activeStageIndex
                ? "text-brand-green"
                : stageIndex < activeStageIndex
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            {INQUIRY_PIPELINE_STAGES[stageIndex]}
          </span>
          {stageIndex < stageCount - 1 && (
            <div
              className={`flex-1 h-0.5 rounded-full transition-all duration-700 ${
                stageIndex < activeStageIndex ? "bg-brand-green" : "bg-gray-200 bg-white/5"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Principal Contact Page ──────────────────────────────────────────────────

/**
 * ContactPage - Engineered to handle global enterprise inquiries through a 
 * mission-critical, multi-step validation pipeline.
 * Features real-time validation, celebratory success states, and robust error handling.
 */
export default function ContactPage() {
  const [activePipelineStageIndex, setActivePipelineStageIndex] = useState(0);
  const [isNetworkRequestActive, setIsNetworkRequestActive] = useState(false);
  const [systemFailureMessage, setSystemFailureMessage] = useState("");

  const inquiryFormEngine = useForm<ContactInquiryPayload>({
    resolver: zodResolver(contactInquirySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      service: "",
      message: "",
    },
  });

  /**
   * Triggers high-fidelity celebratory animations upon successful inquiry deployment.
   */
  const orchestrateCelebrationConfetti = useCallback(() => {
    const animationEndTime = Date.now() + 2000;
    const enterpriseBrandColors = ["#8FCB27", "#a3e635", "#F8FAFC"];

    const executeConfettiCycle = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: enterpriseBrandColors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: enterpriseBrandColors,
      });
      if (Date.now() < animationEndTime) {
        requestAnimationFrame(executeConfettiCycle);
      }
    };
    executeConfettiCycle();
  }, []);

  /**
   * Transition logic for advancing the pipeline to the architecture phase.
   */
  const handleStageTransitionToArchitecture = useCallback(async () => {
    const isIdentityLayerValid = await inquiryFormEngine.trigger(["name", "email", "company"]);
    if (isIdentityLayerValid) {
      setActivePipelineStageIndex(1);
    }
  }, [inquiryFormEngine]);

  /**
   * Orchestrates the primary inquiry submission to the enterprise API endpoint.
   * 
   * @param payload - The validated technical inquiry data.
   */
  const handleSecureInquirySubmission: SubmitHandler<ContactInquiryPayload> = useCallback(async (payload) => {
    setIsNetworkRequestActive(true);
    setSystemFailureMessage("");

    try {
      const secureConnection = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseIntelligence = await secureConnection.json();

      if (!secureConnection.ok) {
        throw new Error(responseIntelligence.error || "Mission-critical submission failure. Please re-attempt.");
      }

      setActivePipelineStageIndex(2); // Execution Success State
      orchestrateCelebrationConfetti();
    } catch (inquirySyncError: unknown) {
      const readableFailure = inquirySyncError instanceof Error ? inquirySyncError.message : "An unhandled system exception occurred.";
      setSystemFailureMessage(readableFailure);
    } finally {
      setIsNetworkRequestActive(false);
    }
  }, [orchestrateCelebrationConfetti]);

  /**
   * Atomic utility for generating standardized form input styling states.
   */
  const generateInputStateClasses = useCallback((hasValidationAnomaly: boolean) => {
    return `w-full px-5 py-4 rounded-2xl border bg-gray-50 focus:bg-white/5 focus:bg-deep-charcoal focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-medium ${
      hasValidationAnomaly ? "border-rose-500 shadow-sm shadow-rose-500/10" : "border-white/5"
    }`;
  }, []);

  const semanticLabelClasses = "block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2";

  return (
    <div className="py-20 lg:py-32 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Identity Header ────────────────────────────────────────── */}
        <header id="contact-identity-header" className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest uppercase bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20">
            Global Consultation Center
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">
            Initiate <span className="text-brand-green">Contact.</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium italic">
            Architecting the future of your local enterprise infrastructure through precision technical engineering.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* ─── Technical Support Hub ─────────────────────────────────────── */}
          <aside id="contact-technical-hub" className="lg:col-span-1 space-y-10">
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/5">
              <h3 className="text-xl font-black mb-10 text-deep-charcoal text-slate-white uppercase tracking-tighter">
                Global Network Hub
              </h3>
              <div className="space-y-8">
                {[
                  {
                    icon: Mail,
                    label: "Intelligence Channel",
                    value: "support@uvtechsolutions.in",
                    href: "mailto:support@uvtechsolutions.in",
                    status: "Monitored 24/7",
                  },
                  {
                    icon: Phone,
                    label: "Global Comms Line",
                    value: "+91-771-2274930",
                    href: "tel:+917712274930",
                    status: "10AM - 7PM IST",
                  },
                  {
                    icon: Phone,
                    label: "Priority Direct",
                    value: "+91-9981679797\n+91-8839342391",
                    href: "tel:+919981679797",
                    status: "Enterprise Support Only",
                  },
                  {
                    icon: MapPin,
                    label: "Operations Control",
                    value: "Global Distributed Teams\nMission-Critical Node Support",
                    href: null,
                    status: "Active Infrastructure",
                  },
                ].map(({ icon: HubIcon, label, value, href, status }) => (
                  <div key={label} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/5 border border-brand-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                      <HubIcon className="w-6 h-6 text-brand-green group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-lg font-bold text-deep-charcoal text-slate-white hover:text-brand-green transition-colors whitespace-pre-line leading-snug"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-lg font-bold text-deep-charcoal text-slate-white whitespace-pre-line leading-snug">
                          {value}
                        </p>
                      )}
                      <p className="text-[10px] text-brand-green/70 mt-2 font-black uppercase tracking-widest">{status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex aspect-square rounded-[2.5rem] bg-gradient-to-br from-brand-green/10 to-transparent items-center justify-center border border-brand-green/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="text-center p-12 relative z-10">
                <Sparkles className="w-12 h-12 text-brand-green mx-auto mb-6 animate-pulse" />
                <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-lime-500 uppercase tracking-tighter leading-tight">
                  Deploying your <br /> Technical Edge.
                </p>
              </div>
            </div>
          </aside>

          {/* ─── Implementation Pipeline ─────────────────────────────────────── */}
          <main id="contact-pipeline-container" className="lg:col-span-2">
            <div className="bg-white/5 rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl shadow-black/5 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                
                {/* ── Phase 0: Identity Verification ─────────────────────────── */}
                {activePipelineStageIndex === 0 && (
                  <motion.div
                    key="stage-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PipelineProgressIndicator activeStageIndex={0} stageCount={3} />
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                        <User className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Identity Layer</h2>
                        <p className="text-sm text-gray-500 font-medium">Verify your profile credentials.</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="name" className={semanticLabelClasses}>
                            Lead Personnel *
                          </label>
                          <input
                            id="name"
                            {...inquiryFormEngine.register("name")}
                            className={generateInputStateClasses(!!inquiryFormEngine.formState.errors.name)}
                            placeholder="Engineering Representative"
                          />
                          {inquiryFormEngine.formState.errors.name && (
                            <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {inquiryFormEngine.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className={semanticLabelClasses}>
                            Communication Node *
                          </label>
                          <input
                            id="email"
                            type="email"
                            {...inquiryFormEngine.register("email")}
                            className={generateInputStateClasses(!!inquiryFormEngine.formState.errors.email)}
                            placeholder="node@enterprise.com"
                          />
                          {inquiryFormEngine.formState.errors.email && (
                            <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {inquiryFormEngine.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className={semanticLabelClasses}>
                          Organization Hub
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="company"
                            {...inquiryFormEngine.register("company")}
                            className={`${generateInputStateClasses(false)} pl-14`}
                            placeholder="Global Enterprise Systems"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStageTransitionToArchitecture}
                        id="contact-pipeline-advance-btn"
                        className="w-full lg:w-auto px-10 py-5 rounded-2xl bg-brand-green text-white font-black uppercase tracking-widest text-xs hover:bg-lime-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/20 flex items-center justify-center gap-3"
                      >
                        Architecture Phase <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Phase 1: Project Architecture ───────────────────────── */}
                {activePipelineStageIndex === 1 && (
                  <motion.div
                    key="stage-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PipelineProgressIndicator activeStageIndex={1} stageCount={3} />
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                        <MessageSquare className="w-6 h-6 text-brand-green" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Architecture Deep-Dive</h2>
                        <p className="text-sm text-gray-500 font-medium">Define mission-critical requirements.</p>
                      </div>
                    </div>

                    {systemFailureMessage && (
                      <div className="mb-8 p-6 rounded-2xl bg-rose-50 bg-rose-950/20 border border-rose-200 border-rose-900/30 flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-rose-600 text-rose-400 italic">
                          {systemFailureMessage}
                        </p>
                      </div>
                    )}

                    <form
                      onSubmit={inquiryFormEngine.handleSubmit(handleSecureInquirySubmission)}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="subject" className={semanticLabelClasses}>
                            Inquiry Vector *
                          </label>
                          <input
                            id="subject"
                            {...inquiryFormEngine.register("subject")}
                            className={generateInputStateClasses(!!inquiryFormEngine.formState.errors.subject)}
                            placeholder="System integration inquiry"
                          />
                          {inquiryFormEngine.formState.errors.subject && (
                            <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                              {inquiryFormEngine.formState.errors.subject.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="service" className={semanticLabelClasses}>
                            Strategic Pillar *
                          </label>
                          <select
                            id="service"
                            {...inquiryFormEngine.register("service")}
                            className={generateInputStateClasses(!!inquiryFormEngine.formState.errors.service)}
                          >
                            <option value="">Select a Module...</option>
                            {CONSULTATION_SERVICES.map((pillar) => (
                              <option key={pillar} value={pillar}>
                                {pillar}
                              </option>
                            ))}
                          </select>
                          {inquiryFormEngine.formState.errors.service && (
                            <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                              {inquiryFormEngine.formState.errors.service.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className={semanticLabelClasses}>
                          Architecture Payload *
                        </label>
                        <textarea
                          id="message"
                          {...inquiryFormEngine.register("message")}
                          rows={6}
                          className={`${generateInputStateClasses(!!inquiryFormEngine.formState.errors.message)} resize-none`}
                          placeholder="Describe the operational scope and technical requirements in detail..."
                        />
                        {inquiryFormEngine.formState.errors.message && (
                          <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                            {inquiryFormEngine.formState.errors.message.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-6 pt-4">
                        <button
                          type="button"
                          onClick={() => setActivePipelineStageIndex(0)}
                          id="contact-pipeline-revert-btn"
                          className="px-8 py-4 rounded-xl border border-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 hover:bg-white/5 transition-all flex items-center gap-3"
                        >
                          <ArrowLeft className="w-4 h-4" /> Identity Re-Sync
                        </button>
                        <button
                          type="submit"
                          id="contact-pipeline-deploy-btn"
                          disabled={isNetworkRequestActive}
                          className="flex-1 lg:flex-none lg:px-12 py-5 rounded-2xl bg-brand-green text-white font-black uppercase tracking-widest text-xs hover:bg-lime-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-wait"
                        >
                          {isNetworkRequestActive ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Deploy Inquiry <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── Phase 2: Deployment Success ───────────────────────────────── */}
                {activePipelineStageIndex === 2 && (
                  <motion.div
                    key="stage-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="flex flex-col items-center justify-center text-center space-y-10 py-10"
                  >
                    <motion.div
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 bg-brand-green/10 rounded-[2rem] flex items-center justify-center border border-brand-green/20 relative z-10">
                        <Sparkles className="w-16 h-16 text-brand-green animate-bounce" />
                      </div>
                      <div className="absolute inset-0 bg-brand-green/20 blur-[50px] -z-10 animate-pulse" />
                    </motion.div>

                    <div className="space-y-4">
                      <h3 className="text-4xl font-black uppercase tracking-tighter">Transmission Confirmed.</h3>
                      <p className="text-gray-400 font-medium italic max-w-sm">
                        Inquiry payload successfully decrypted at our HQ. A specialized diagnostic team will respond within 24 operational hours.
                      </p>
                    </div>

                    <button
                      id="contact-pipeline-restart-btn"
                      onClick={() => {
                        inquiryFormEngine.reset();
                        setActivePipelineStageIndex(0);
                      }}
                      className="px-10 py-4 rounded-full bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-brand-green hover:text-white transition-all duration-300 shadow-sm"
                    >
                      Initialize New Transmission
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


