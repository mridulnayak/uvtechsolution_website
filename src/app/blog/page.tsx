'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

/**
 * Interface representing a technical diagnostic article or enterprise insight 
 * within the UV Tech Solutions knowledge ecosystem.
 */
interface DiagnosticInsight {
  /** The human-readable title of the insight. */
  title: string;
  /** The unique URL-friendly technical identifier. */
  slug: string;
  /** The functional category of the intelligence module. */
  category: string;
  /** A concise summary or pitch for the diagnostic content. */
  excerpt: string;
  /** ISO timestamp of when the intelligence was deployed/published. */
  published_at: string;
}

/**
 * BlogFeed - A high-performance aggregation layer that presents technical 
 * insights and enterprise architecture diagnostics in a standardized reactive feed.
 * 
 * @returns {JSX.Element} The rendered enterprise intelligence feed.
 */
export default function BlogFeed() {
  
  // Enterprise-grade state management for intelligence assets
  const [activeDiagnosticFeed, setActiveDiagnosticFeed] = useState<DiagnosticInsight[]>([]);
  const [isDataSynchronizing, setIsDataSynchronizing] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Orchestrates the secure synchronization of intelligence assets 
     * from the primary database infrastructure.
     */
    async function synchronizeEnterpriseIntelligence() {
      try {
        setIsDataSynchronizing(true);
        
        const { data: fetchedIntelligence, error: syncError } = await supabase
          .from('blogs')
          .select('*')
          .order('published_at', { ascending: false });

        if (syncError) {
          console.error("Critical Intelligence Sync Failure:", syncError.message);
          setActiveDiagnosticFeed([]);
          return;
        }

        setActiveDiagnosticFeed(fetchedIntelligence || []);

      } catch (connectivityError) {
        console.error('External Node Connection Failure:', connectivityError);
        setActiveDiagnosticFeed([]);
      } finally {
        setIsDataSynchronizing(false);
      }
    }

    synchronizeEnterpriseIntelligence();
  }, []);

  return (
    <div className="min-h-screen bg-deep-charcoal text-slate-white font-sans py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* ─── Page Identity Header ────────────────────────────────────────── */}
        <header className="mb-16 border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
             Technical Intelligence
          </h1>
          <p className="text-xl text-gray-500 font-medium italic">
             Engineering diagnostics and mission-critical enterprise architecture.
          </p>
        </header>

        {/* ─── Diagnostic Feed Logic ────────────────────────────────────────── */}
        {isDataSynchronizing ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Syncing Knowledge Nodes...</p>
          </div>
        ) : activeDiagnosticFeed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {activeDiagnosticFeed.map((activeInsight) => (
              <article key={activeInsight.slug} className="flex flex-col group h-full">
                <Link href={`/blog/${activeInsight.slug}`} className="block flex-grow mb-6">
                  {/* Insight Metadata Overlay */}
                  <div className="flex items-center gap-3 mb-6 text-[10px] font-black uppercase tracking-widest text-brand-green">
                    <span className="px-2 py-0.5 border border-brand-green/20 rounded bg-brand-green/5">{activeInsight.category}</span>
                    <span className="text-gray-800">•</span>
                    <span className="text-gray-500">
                      {new Date(activeInsight.published_at).toLocaleDateString(undefined, { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>

                  {/* Operational Title */}
                  <h2 className="text-2xl font-black mb-4 uppercase tracking-tight group-hover:text-brand-green transition-colors leading-snug duration-300">
                    {activeInsight.title}
                  </h2>

                  {/* Summary Segment */}
                  <p className="text-gray-500 leading-relaxed text-sm font-medium italic line-clamp-3">
                    {activeInsight.excerpt}
                  </p>
                </Link>

                {/* Secure Access Trigger */}
                <Link 
                  href={`/blog/${activeInsight.slug}`} 
                  className="inline-flex items-center gap-2 text-brand-green font-black uppercase text-[10px] tracking-[0.2em] mt-auto hover:text-white transition-colors group/link"
                >
                  <span className="underline underline-offset-8 decoration-2 decoration-brand-green/30 group-hover/link:decoration-brand-green">Access Intelligence</span>
                  <span className="transition-transform group-hover/link:translate-x-1">&rarr;</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
             <h2 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em]">
               New technical diagnostic modules to be deployed.
             </h2>
          </div>
        )}

      </div>
    </div>
  );
}

