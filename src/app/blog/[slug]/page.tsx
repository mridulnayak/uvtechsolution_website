'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

/**
 * Interface representing the technical structure of an Enterprise Intelligence node.
 */
interface EnterpriseIntelligencePayload {
  /** Technical GUID identifier. */
  id: string;
  /** Human-readable operational title. */
  title: string;
  /** URL-friendly diagnostic identifier. */
  slug: string;
  /** The functional category of the intelligence. */
  category: string;
  /** Raw Markdown content for the technical diagnostic. */
  content: string;
  /** ISO timestamp for deployment status. */
  published_at: string;
}

/**
 * BlogReader - A high-performance diagnostic reader engineered to present 
 * localized technical insights with mission-critical clarity.
 * 
 * @returns {JSX.Element} The rendered enterprise intelligence post.
 */
export default function BlogReader() {
  const routingParameters = useParams();
  const activePostSlug = routingParameters?.slug as string;

  // Enterprise state management for node synchronization
  const [activeIntelligenceNode, setActiveIntelligenceNode] = useState<EnterpriseIntelligencePayload | null>(null);
  const [isDataSynchronizing, setIsDataSynchronizing] = useState<boolean>(true);

  useEffect(() => {
    if (!activePostSlug) return;

    /**
     * Internal orchestration for retrieving secure diagnostic data 
     * from the primary database cluster.
     */
    async function synchronizeNodeData() {
      try {
        setIsDataSynchronizing(true);
        
        const { data: nodeData, error: fetchError } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', activePostSlug)
          .single();

        if (fetchError) throw fetchError;
        if (nodeData) setActiveIntelligenceNode(nodeData);

      } catch (synchronizationFailure: any) {
        console.error('Critical Node Synchronization Failure:', synchronizationFailure.message);
      } finally {
        setIsDataSynchronizing(false);
      }
    }

    synchronizeNodeData();
  }, [activePostSlug]);

  // Loading Invariant: Synchronizing with remote knowledge base
  if (isDataSynchronizing) {
    return (
      <div className="min-h-screen bg-deep-charcoal text-gray-500 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-2 border-brand-green border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Calibrating Diagnostic Node...</p>
      </div>
    );
  }

  // Error Invariant: Requested knowledge node not found
  if (!activeIntelligenceNode) {
    return (
      <div className="min-h-screen bg-deep-charcoal text-slate-white flex flex-col items-center justify-center p-6 font-sans">
         <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter">Knowledge Node Not Found</h1>
         <Link href="/blog" className="text-brand-green font-bold uppercase text-xs tracking-[0.2em] hover:opacity-80 transition-opacity border-b-2 border-brand-green/20 pb-1">
           &larr; Return to Intelligence Library
         </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-charcoal text-slate-white font-sans py-24 px-4 sm:px-6">
      
      <article className="max-w-[800px] mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/blog" 
          className="inline-block text-gray-500 hover:text-brand-green text-[10px] uppercase font-black tracking-[0.3em] mb-16 transition-all group"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1 mr-2">&larr;</span> 
          Return to Knowledge Base
        </Link>

        {/* Intelligence Meta Header */}
        <header className="mb-20">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase mb-8 tracking-widest text-brand-green">
            <span className="px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full">{activeIntelligenceNode.category}</span>
            <span className="text-gray-800">•</span>
            <span className="text-gray-500">
              {new Date(activeIntelligenceNode.published_at).toLocaleDateString(undefined, { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] mb-10 tracking-tighter uppercase">
            {activeIntelligenceNode.title}
          </h1>
          <div className="w-20 h-1 bg-brand-green rounded-full" />
        </header>

        {/* Markdown Transformation Engine */}
        <div className="prose prose-invert max-w-none prose-p:text-gray-400 prose-headings:uppercase prose-headings:tracking-tighter">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm as any]}
            components={{
              h1: ({children}) => <h1 className="text-3xl md:text-4xl font-black text-white mt-16 mb-8 border-b border-white/5 pb-4">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl md:text-3xl font-black text-white mt-12 mb-6">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-bold text-white mt-10 mb-4">{children}</h3>,
              p: ({children}) => <p className="text-lg md:text-xl leading-relaxed mb-8 font-medium italic opacity-90">{children}</p>,
              ul: ({children}) => <ul className="list-disc pl-6 mb-10 text-lg md:text-xl font-medium space-y-4 marker:text-brand-green">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-6 mb-10 text-lg md:text-xl font-medium space-y-4 marker:text-brand-green">{children}</ol>,
              li: ({children}) => <li className="mb-2 leading-relaxed">{children}</li>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-brand-green pl-8 italic my-12 text-gray-400 text-xl md:text-3xl font-medium leading-relaxed bg-brand-green/5 py-8 rounded-r-2xl shadow-inner">
                  {children}
                </blockquote>
              ),
              code: ({children}) => <code className="bg-gray-800/80 border border-white/10 px-2 py-1 rounded text-sm text-brand-green font-mono">{children}</code>,
              a: ({children, href}) => (
                <a href={href} className="text-brand-green hover:text-white underline underline-offset-8 decoration-2 decoration-brand-green/30 hover:decoration-brand-green transition-all" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            }}
          >
            {activeIntelligenceNode.content || "Deciphering Intelligence Stream..."}
          </ReactMarkdown>
        </div>

      </article>
    </div>
  );
}
