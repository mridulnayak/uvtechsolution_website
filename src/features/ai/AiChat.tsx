"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";

/**
 * Defines the structure of a chat message within the AI interface.
 */
type ChatMessageRole = "user" | "model";

interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

/**
 * An enterprise-grade floating AI chat interface.
 * Connects users to the UV Tech Assistant (powered by Gemini) for real-time 
 * automated consulting regarding products, pricing, and infrastructure setup.
 */
export function AiChat() {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      content:
        "Hello! I am your **UV Tech Assistant**. How can I help you today with our hotel, restaurant, or retail solutions?",
    },
  ]);
  const [chatInputValue, setChatInputValue] = useState("");
  const [isNetworkProcessing, setIsNetworkProcessing] = useState(false);
  
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Synchronize scroll and focus when chat panel visibility changes
  useEffect(() => {
    if (isChatPanelOpen) {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
      textInputRef.current?.focus();
    }
  }, [conversationHistory, isChatPanelOpen]);

  /**
   * Orchestrates the communication workflow with the backend AI service.
   * Enforces message trimming, UI loading states, and robust error fallback mechanisms.
   */
  const handleDispatchMessage = useCallback(async (overrideTextRequest?: string) => {
    const sanitizedText = (overrideTextRequest || chatInputValue).trim();
    if (!sanitizedText || isNetworkProcessing) return;

    const newSystemUserMessage: ChatMessage = { role: "user", content: sanitizedText };
    setConversationHistory((previousHistory) => [...previousHistory, newSystemUserMessage]);
    setChatInputValue("");
    setIsNetworkProcessing(true);

    try {
      const chatNetworkResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sanitizedText }),
      });

      if (!chatNetworkResponse.ok) {
        const errorDataPayload = await chatNetworkResponse.json().catch(() => ({}));
        console.error("----- UV TECH AI SERVER ERROR -----", errorDataPayload);
        throw new Error(errorDataPayload.error || "CONNECTION_FAILED");
      }

      const verifiedResponseData = await chatNetworkResponse.json();
      const generatedAiText = verifiedResponseData.text;
      
      if (!generatedAiText) throw new Error("EMPTY_TEXT_RESPONSE");

      const newSystemModelMessage: ChatMessage = { role: "model", content: generatedAiText };
      setConversationHistory((previousHistory) => [...previousHistory, newSystemModelMessage]);
      setIsNetworkProcessing(false);
      
      setTimeout(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (networkException: any) {
      console.error("Frontend Chat Error:", networkException);
      setIsNetworkProcessing(false);
      
      let humanReadableErrorMsg = "UV Tech Assistant is currently offline. Please try again later.";
      
      // Advanced standard error classification pipeline
      if (networkException.message === "MODEL_MISMATCH") {
        humanReadableErrorMsg = "System updating... please try again in a moment.";
      } else if (networkException.message === "AUTH_ERROR") {
        humanReadableErrorMsg = "The UV Tech AI service is misconfigured. Please check the server's .env.local file.";
      } else if (networkException.message === "API_CONNECTION_FAILED") {
        humanReadableErrorMsg = "Unable to reach UV Tech AI. Please check your internet or API key.";
      }

      setConversationHistory((previousHistory) => [
        ...previousHistory,
        {
          role: "model",
          content: `${humanReadableErrorMsg} (Ref: ${networkException.message || "Unknown Error"})`,
        },
      ]);
    }
  }, [chatInputValue, isNetworkProcessing]);

  /**
   * Captures the Enter key to dispatch the current chat input payload.
   */
  const handleKeyboardInputEvent = useCallback((keyboardEvent: React.KeyboardEvent) => {
    if (keyboardEvent.key === "Enter" && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      handleDispatchMessage();
    }
  }, [handleDispatchMessage]);

  const predefinedConsultingPrompts = [
    "Tell me about Hoteleo",
    "Do you provide offline setup?",
    "Pricing Inquiry",
  ];

  /**
   * Processes the raw markdown content to inject rich UI elements (like image thumbnails)
   * specifically tailored for the UV Tech platform's screenshot strategy.
   */
  const renderRichMessageContent = (rawContentString: string) => {
    // Regex mapping for known UI screenshots in the /public/images/screenshots directory
    const recognizedScreenshotPattern = /(hoteleo_\d+\.png|restpro_\d+\.jpeg|retail_\d+\.png)/gi;
    const contentSegments = rawContentString.split(recognizedScreenshotPattern);

    if (contentSegments.length === 1) return <p className="whitespace-pre-wrap">{rawContentString}</p>;

    return (
      <div className="space-y-2">
        {contentSegments.map((segment, index) => {
          if (segment.match(recognizedScreenshotPattern)) {
            const rawFileName = segment.toLowerCase();
            const absoluteAssetUri = `/images/screenshots/${rawFileName}`;
            return (
              <div key={index} className="my-2 rounded-lg overflow-hidden border border-white/20 shadow-md bg-black/20">
                <img
                  src={absoluteAssetUri}
                  alt={`Showcase UI Asset: ${segment}`}
                  className="w-full h-auto cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(absoluteAssetUri, '_blank')}
                />
                <div className="p-1 px-2 flex items-center justify-between bg-black/40">
                  <span className="text-[10px] text-white/60 italic lowercase">{segment}</span>
                  <ImageIcon className="w-3 h-3 text-white/40" />
                </div>
              </div>
            );
          }
          return segment ? <p key={index} className="whitespace-pre-wrap inline">{segment}</p> : null;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2 md:gap-3">
      {/* Primary Interaction Interface */}
      <AnimatePresence>
        {isChatPanelOpen && (
          <motion.div
            id="ai-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[calc(100vw-32px)] sm:w-[420px] rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 dark:bg-black/40 dark:border-white/10 ring-1 ring-black/5"
            style={{ height: "min(600px, 80vh)" }}
          >
            {/* Header Identity Bar */}
            <div className="px-5 py-4 bg-gradient-to-r from-brand-green/90 to-brand-green/70 backdrop-blur-md flex items-center justify-between flex-shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-inner ring-1 ring-black/5">
                  <img src="/images/logos/logo.png" alt="UV Tech System Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-tight tracking-tight">UV Tech Assistant</p>
                  <p className="text-white/80 text-[10px] flex items-center gap-1.5 uppercase tracking-widest font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    Expert Consultant
                  </p>
                </div>
              </div>
              <button
                id="ai-chat-close-btn"
                onClick={() => setIsChatPanelOpen(false)}
                className="w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close active chat session"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Conversation Log Viewport */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar custom-scrollbar">
              {conversationHistory.map((conversationMessage, historyIndex) => (
                <div
                  key={historyIndex}
                  className={`flex ${conversationMessage.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {conversationMessage.role === "model" && (
                    <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                      <Sparkles className="w-4 h-4 text-brand-green" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      conversationMessage.role === "user"
                        ? "bg-brand-green text-white rounded-br-sm font-medium"
                        : "bg-white/90 dark:bg-white/10 dark:text-white dark:backdrop-blur-sm text-gray-800 rounded-bl-sm border border-gray-100 dark:border-white/5"
                    }`}
                  >
                    {conversationMessage.role === "model" 
                      ? renderRichMessageContent(conversationMessage.content) 
                      : conversationMessage.content}
                      
                    {!conversationMessage.content && conversationMessage.role === "model" && (
                      <span className="flex gap-1.5 items-center h-5">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Active Network Polling Indicator */}
              {isNetworkProcessing && (
                <div className="flex items-center gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-green" />
                  </div>
                  <div className="bg-white/80 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex flex-col gap-1 border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-[10px] text-brand-green font-medium animate-pulse">Gemini 3.1 Pro is thinking...</p>
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-brand-green/40 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-brand-green/40 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-brand-green/40 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={conversationEndRef} />
            </div>

            {/* Strategy Prompt Macros */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/10 bg-white/5">
              {predefinedConsultingPrompts.map((macroPrompt) => (
                <button
                  key={macroPrompt}
                  onClick={() => handleDispatchMessage(macroPrompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 text-[11px] text-brand-green font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  {macroPrompt}
                </button>
              ))}
            </div>

            {/* User Command Input Box */}
            <div className="p-4 bg-white/5 dark:bg-black/20 backdrop-blur-xl border-t border-white/10 flex gap-3 flex-shrink-0 items-center">
              <input
                ref={textInputRef}
                id="ai-chat-input"
                type="text"
                value={chatInputValue}
                onChange={(keyboardEvent) => setChatInputValue(keyboardEvent.target.value)}
                onKeyDown={handleKeyboardInputEvent}
                placeholder="Submit your query..."
                className="flex-1 bg-white/90 dark:bg-white/5 dark:text-white text-sm px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 shadow-inner"
                disabled={isNetworkProcessing}
                aria-label="Input chat message payload"
              />
              <button
                id="ai-chat-send-btn"
                onClick={() => handleDispatchMessage()}
                disabled={isNetworkProcessing || !chatInputValue.trim()}
                className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-white hover:bg-brand-green/90 hover:shadow-lg hover:shadow-brand-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 active:scale-90"
                aria-label="Dispatch message payload"
              >
                {isNetworkProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Suggestion Beacon */}
      {!isChatPanelOpen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          onClick={() => {
            setIsChatPanelOpen(true);
            setTimeout(() => {
              handleDispatchMessage("Tell me about offline setup");
            }, 500);
          }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-brand-green border border-brand-green/30 px-5 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 mb-3 whitespace-nowrap ring-1 ring-black/5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise Reliability AI
        </motion.button>
      )}

      {/* High-Contrast Floating Action Trigger */}
      <motion.button
        id="ai-chat-trigger-btn"
        onClick={() => setIsChatPanelOpen((previousOpenState) => !previousOpenState)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-brand-green text-white shadow-2xl shadow-brand-green/40 flex items-center justify-center relative border border-white/20 focus:outline-none focus:ring-4 focus:ring-brand-green/30"
        aria-label={isChatPanelOpen ? "Minimize AI interface" : "Activate AI interface"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isChatPanelOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 md:w-7 md:h-7" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Unobtrusive Attention Beacon */}
        {!isChatPanelOpen && (
          <span className="absolute inset-0 rounded-3xl bg-brand-green animate-ping opacity-25 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}

