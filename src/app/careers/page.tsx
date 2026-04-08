"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, Upload, CheckCircle2, Loader2, Sparkles, FileText, User, Phone, Mail, AlertCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Interface representing the validated structure of an elite engineering candidate's profile.
 */
interface CandidateProfileData {
  /** Candidate's legal name for enterprise records. */
  candidateFullName: string;
  /** Primary communication node for follow-up diagnostics. */
  candidateEmail: string;
  /** Direct mobile line for urgent technical syncing. */
  candidatePhone: string;
}

/**
 * Enumeration of possible states for the career application synchronization lifecycle.
 */
type SynchronizationState = "idle" | "synchronizing" | "success" | "failure";

/**
 * Governance constants for secure document uploads.
 */
const GOVERNANCE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB High-Res Allowed
const GOVERNANCE_ALLOWED_MIME_TYPE = "application/pdf";

/**
 * CareerPage - Engineered to identify and acquire elite engineering talent 
 * for the UV Tech Solutions global software ecosystem.
 * Features a mission-critical, secure file upload and database synchronization pipeline.
 * 
 * @returns {JSX.Element} The rendered enterprise career gateway.
 */
export default function CareerPage() {
  
  // Tactical state management for profile acquisition
  const [activeProfilePayload, setActiveProfilePayload] = useState<CandidateProfileData>({
    candidateFullName: "",
    candidateEmail: "",
    candidatePhone: "",
  });
  
  const [activeResumeFile, setActiveResumeFile] = useState<File | null>(null);
  const [activeSyncState, setActiveSyncState] = useState<SynchronizationState>("idle");
  const [diagnosticFailureMessage, setDiagnosticFailureMessage] = useState<string>("");

  /**
   * Synchronizes manual input fields with the internal profile payload state.
   */
  const handleProfileFieldSync = useCallback((syncEvent: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = syncEvent.target;
    setActiveProfilePayload((previousPayload) => ({ ...previousPayload, [name]: value }));
  }, []);

  /**
   * Governance layer for validating and securing uploaded technical documents.
   */
  const handleSecureFileValidation = useCallback((validationEvent: ChangeEvent<HTMLInputElement>) => {
    const selectedNodes = validationEvent.target.files;
    
    if (selectedNodes && selectedNodes[0]) {
      const candidateFile = selectedNodes[0];
      const isFormatCompliant = candidateFile.type === GOVERNANCE_ALLOWED_MIME_TYPE;
      const isUnderSecurityLimit = candidateFile.size <= GOVERNANCE_MAX_FILE_SIZE_BYTES;

      if (isFormatCompliant && isUnderSecurityLimit) {
        setActiveResumeFile(candidateFile);
        setActiveSyncState("idle");
        setDiagnosticFailureMessage("");
      } else {
        setActiveResumeFile(null);
        setActiveSyncState("failure");
        setDiagnosticFailureMessage("Secure validation failed. Please provide a compliant PDF document under 10MB.");
        validationEvent.target.value = "";
      }
    }
  }, []);

  /**
   * Orchestrates the multi-stage deployment of a candidate's profile to 
   * the primary database cluster and storage infrastructure.
   */
  const executeDeploymentProtocol = useCallback(async (deploymentEvent: FormEvent) => {
    deploymentEvent.preventDefault();
    
    if (!activeResumeFile) {
      setDiagnosticFailureMessage("Deployment halted: Technical resume module missing.");
      return;
    }

    setActiveSyncState("synchronizing");
    setDiagnosticFailureMessage("");

    try {
      // Phase 1: Storage Node Deployment
      const uniqueNodeIdentifier = `${Date.now()}-${activeResumeFile.name.replace(/\s+/g, "_")}`;
      
      const { error: storageError } = await supabase.storage
        .from("resume")
        .upload(uniqueNodeIdentifier, activeResumeFile, {
          upsert: false,
          contentType: GOVERNANCE_ALLOWED_MIME_TYPE,
        });

      if (storageError) throw new Error(`Infrastructure Failure: ${storageError.message}`);

      // Phase 2: Knowledge Graph Integration
      const { data: routeData } = supabase.storage
        .from("resume")
        .getPublicUrl(uniqueNodeIdentifier);

      const secureAccessUrl = routeData.publicUrl;

      // Phase 3: Record Persistance
      const { error: dataSyncError } = await supabase.from("applications").insert([
        {
          full_name: activeProfilePayload.candidateFullName,
          email: activeProfilePayload.candidateEmail,
          phone: activeProfilePayload.candidatePhone,
          resume_url: secureAccessUrl,
          applied_at: new Date().toISOString(),
        },
      ]);

      if (dataSyncError) throw new Error(`Data Synchronization Failure: ${dataSyncError.message}`);

      // Finalization: Protocol Success
      setActiveProfilePayload({ candidateFullName: "", candidateEmail: "", candidatePhone: "" });
      setActiveResumeFile(null);
      setActiveSyncState("success");
    } catch (criticalError: unknown) {
      const readableFailure = criticalError instanceof Error ? criticalError.message : "Standard system exception during sync.";
      setActiveSyncState("failure");
      setDiagnosticFailureMessage(readableFailure);
    }
  }, [activeProfilePayload, activeResumeFile]);

  /**
   * Re-initializes the deployment logic for subsequent talent acquisition cycles.
   */
  const resetSynchronizationPipeline = useCallback(() => {
    setActiveSyncState("idle");
    setDiagnosticFailureMessage("");
  }, []);

  return (
    <div className="min-h-screen bg-deep-charcoal text-slate-white pt-32 pb-20 selection:bg-brand-green/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <header className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1 mb-4 text-[10px] font-black tracking-widest uppercase bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20">
              Elite Talent Acquisition
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-[0.95]">
              Deploy your <span className="text-brand-green">Engineering Logic</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed italic border-l-2 border-brand-green/20 pl-6">
              Scaling the UV Tech enterprise ecosystem requires elite technical minds. If you excel in high-reliability systems architecture, initiate your deployment protocol.
            </p>
          </header>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {activeSyncState === "success" ? (
            <motion.div
              key="pipeline-success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 border border-brand-green/20 p-12 md:p-20 rounded-[3rem] text-center shadow-2xl shadow-brand-green/5"
            >
              <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-green/20">
                <CheckCircle2 className="w-10 h-10 text-brand-green" />
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Transmission Confirmed</h2>
              <p className="text-gray-500 text-lg font-medium italic">Our technical lead personnel will initiate follow-up diagnostics shortly.</p>
              <button 
                onClick={resetSynchronizationPipeline}
                className="mt-12 group flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors"
              >
                <span>Initialize new deployment</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="acquisition-pipeline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white/5 border border-white/5 p-8 md:p-16 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 opacity-5">
                <Sparkles className="w-48 h-48 text-brand-green" />
              </div>

              <form onSubmit={executeDeploymentProtocol} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label htmlFor="candidateFullName" className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <User className="w-3 h-3 text-brand-green" /> Full Identity
                    </label>
                    <input
                      required
                      type="text"
                      id="candidateFullName"
                      name="candidateFullName"
                      value={activeProfilePayload.candidateFullName}
                      onChange={handleProfileFieldSync}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 outline-none transition-all placeholder:text-white/10 italic text-lg"
                      placeholder="Jane Enterprise Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="candidatePhone" className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <Phone className="w-3 h-3 text-brand-green" /> Comms Line
                    </label>
                    <input
                      required
                      type="tel"
                      id="candidatePhone"
                      name="candidatePhone"
                      value={activeProfilePayload.candidatePhone}
                      onChange={handleProfileFieldSync}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 outline-none transition-all placeholder:text-white/10 italic text-lg"
                      placeholder="+91-XXXXX-XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="candidateEmail" className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                     <Mail className="w-3 h-3 text-brand-green" /> Communication Node
                  </label>
                  <input
                    required
                    type="email"
                    id="candidateEmail"
                    name="candidateEmail"
                    value={activeProfilePayload.candidateEmail}
                    onChange={handleProfileFieldSync}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 outline-none transition-all placeholder:text-white/10 italic text-lg"
                    placeholder="node@enterprise.systems"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="resume" className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                     <FileText className="w-3 h-3 text-brand-green" /> Technical Resume Payload (PDF)
                  </label>
                  <div className="relative group">
                    <input
                      required
                      type="file"
                      id="resume"
                      accept=".pdf"
                      onChange={handleSecureFileValidation}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 hover:border-brand-green/50 rounded-[2rem] p-10 cursor-pointer transition-all bg-white/[0.02] group-hover:bg-brand-green/5"
                    >
                      <Upload className="w-10 h-10 text-brand-green mb-4 group-hover:-translate-y-1 transition-transform duration-500" />
                      <span className="text-sm font-black uppercase tracking-widest text-gray-500 group-hover:text-brand-green transition-colors">
                        {activeResumeFile ? activeResumeFile.name : "Select Technical Document"}
                      </span>
                    </label>
                  </div>
                </div>

                {activeSyncState === "failure" && (
                  <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-2xl text-center font-black uppercase tracking-widest italic">
                    <AlertCircle className="w-4 h-4 inline mr-2 align-middle" />
                    {diagnosticFailureMessage}
                  </div>
                )}

                <button
                  disabled={activeSyncState === "synchronizing" || !activeResumeFile}
                  type="submit"
                  className="w-full bg-brand-green hover:bg-lime-500 disabled:bg-white/5 disabled:grayscale disabled:cursor-wait text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-brand-green/10 uppercase tracking-[0.2em] text-xs"
                >
                  {activeSyncState === "synchronizing" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Synchronizing Pipeline...
                    </>
                  ) : (
                    <>
                      Transmit Application Data <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

