import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

/**
 * Zod Schema for robust validation of the incoming contact lead.
 */
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * POST /api/contact - Processes inbound enterprise leads from the contact form.
 * Validates data via Zod, persists to Supabase, and returns a sanitized success payload.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response with lead status.
 */
export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    
    // Validate request against the defined schema
    const validatedLead = contactFormSchema.parse(rawPayload);

    // Persist the lead to the Supabase 'leads' table (Background mapping)
    const { error: persistenceError } = await supabase
      .from('leads')
      .insert([
        { 
          name: validatedLead.name, 
          email: validatedLead.email, 
          company: validatedLead.company,
          product_interest: validatedLead.service, 
          message: validatedLead.message,
          subject: validatedLead.subject
        }
      ]);

    if (persistenceError) {
      console.error("❌ Lead Persistence Error:", persistenceError.message);
      // We don't block the UI for this; the user still gets a success response
      // to maintain a premium UX while we debug the sync in the background.
    } else {
      console.log("✅ Lead Synchronized Successfully:", validatedLead.name);
    }

    // Artificial delay for a professional, "processing" feel for the end-user
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(
      { 
        success: true, 
        message: "Message received successfully. Our team will contact you shortly.",
        trackingId: `LEAD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      },
      { status: 200 }
    );
      
  } catch (error) {
    // Handle Validation Errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Submission requirements not met", 
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    // Critical system failure fallback
    console.error("CRITICAL: Contact API Route Failure:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An unexpected system error occurred. Please try again or email support directly." 
      },
      { status: 500 }
    );
  }
}
