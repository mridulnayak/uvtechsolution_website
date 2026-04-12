"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Properties for the BlogAiSummary component.
 */
interface BlogAiSummaryProps {
  /** The full unstructured Markdown or HTML content of the blog post. */
  content: string;
  /** The title of the blog post, used to provide context to the AI generation prompt. */
  title: string;
}

/**
 * A highly engaging, auto-generating summary component for technical articles.
 * Uses Gemini AI via a streaming API to deliver a 30-second executive summary 
 * directly at the top of long-form reading material over a glassmorphic banner.
 */
export function BlogAiSummary({ content, title }: BlogAiSummaryProps) {
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState("");
  const [isNetworkProcessing, setIsNetworkProcessing] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  /**
   * Dispatches the summarization prompt to the backend AI proxy and reads 
   * the response as a continuous stream to provide immediate visual feedback.
   */
  const executeSummaryStream = useCallback(async () => {
    setIsNetworkProcessing(true);
    setHasNetworkError(false);
    setAiGeneratedSummary("");

    const strictPrompt = `Summarize this blog post titled "${title}" in 2-3 concise sentences for a busy technical reader. Focus on the key insight or actionable takeaway.\n\n${content.slice(0, 3000)}`;

    try {
      const summaryNetworkResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", parts: [{ text: strictPrompt }] }],
          mode: "summarize",
        }),
      });

      if (!summaryNetworkResponse.ok || !summaryNetworkResponse.body) throw new Error("STREAM_INITIALIZATION_FAILED");

      const streamReader = summaryNetworkResponse.body.getReader();
      const textDecoder = new TextDecoder();
      let streamedAccumulator = "";

      // Continuous loop to consume the streamed chunks from the AI proxy
      while (true) {
        const { done: streamComplete, value: streamChunk } = await streamReader.read();
        if (streamComplete) break;
        
        streamedAccumulator += textDecoder.decode(streamChunk, { stream: true });
        setAiGeneratedSummary(streamedAccumulator);
      }
      setIsNetworkProcessing(false);
    } catch {
      setHasNetworkError(true);
      setIsNetworkProcessing(false);
    }
  }, [content, title]);

  useEffect(() => {
    executeSummaryStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (isBannerDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="blog-ai-summary-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative rounded-2xl overflow-hidden border border-brand-green/20 bg-gradient-to-r from-brand-green/5 to-lime-400/5 from-brand-green/10 to-lime-400/10 p-5 mb-8"
      >
        {/* Accent structural border line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-green to-lime-400 rounded-l-2xl shadow-[1px_0_10px_rgba(130,217,30,0.5)]" />

        <div className="pl-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-brand-green">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                ⚡ AI 30-Second Summary
              </span>
              <span className="text-xs text-gray-400 font-normal normal-case tracking-normal hidden sm:inline">
                · Gemini 3.1 Pro (High)
              </span>
            </div>
            <div className="flex items-center gap-1">
              {hasNetworkError && (
                <button
                  onClick={executeSummaryStream}
                  className="p-1.5 rounded-lg hover:bg-brand-green/10 text-gray-400 hover:text-brand-green transition-colors outline-none focus:ring-2 focus:ring-brand-green/50"
                  title="Retry network stream"
                  aria-label="Retry AI summary generation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsBannerDismissed(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 hover:bg-gray-800 text-gray-400 transition-colors outline-none focus:ring-2 focus:ring-gray-400/50"
                aria-label="Dismiss AI summary widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Conditional rendering based on network state */}
          {isNetworkProcessing ? (
            <div className="space-y-2 mt-1 px-1">
              <div className="h-3.5 w-full rounded shimmer" />
              <div className="h-3.5 w-4/5 rounded shimmer" />
              <div className="h-3.5 w-3/5 rounded shimmer" />
            </div>
          ) : hasNetworkError ? (
            <p className="text-sm text-gray-500 text-gray-400 px-1">
              Could not generate summary at this time. Click retry or proceed to read the full technical post below.
            </p>
          ) : (
            <p className="text-sm text-gray-700 text-gray-300 leading-relaxed px-1">
              {aiGeneratedSummary}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

