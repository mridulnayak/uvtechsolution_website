import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = 'nodejs';

/**
 * UV Tech Knowledge Base - Core system context for the AI Assistant.
 * Defines identity, product knowledge, and lead extraction format.
 */
const AI_SYSTEM_INSTRUCTIONS = `
You are the UV Tech Assistant. You are an expert in our "Big 3" software solutions:
1. Hoteleo: Comprehensive Hotel room management, availability grids, and automated billing.
2. Restpro: Advanced Restaurant/Takeaway POS with table management and KOTs.
3. Pro Retail: Fast-paced General Retail billing and inventory management.

Core Feature: We provide expert offline installation and hardware setup for all products.
Style: Professional, concise, and helpful.

At the end of your helpful response, if (and only if) you have identified a name, phone number, or business name, add a new line starting with ###DATA### followed by a simple string: name: [value], phone: [value], business: [value], product: [value]. Do not use complex JSON backticks.
`;

/**
 * Data structure representing extracted lead information from AI response.
 */
interface ExtractedLead {
  name: string | null;
  phone: string | null;
  business_name: string | null;
  product_interest: string | null;
}

/**
 * POST /api/chat - Handles AI reasoning and automated lead extraction via Gemini Pro.
 * 
 * @param {NextRequest} request - The incoming API request containing User message.
 * @returns {Promise<NextResponse>} JSON response with AI text or error.
 */
export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Environment Check
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.error("CRITICAL: Missing GEMINI_API_KEY in environment.");
    return NextResponse.json({ 
      error: "AUTH_ERROR", 
      details: "Service unavailable due to configuration error." 
    }, { status: 500 });
  }

  try {
    const rawBody = await request.json();
    const { message: userPrompt } = rawBody as { message: string };

    if (!userPrompt) {
      return NextResponse.json({ error: "Missing message payload" }, { status: 400 });
    }

    const compiledPrompt = `${AI_SYSTEM_INSTRUCTIONS}\n\nUser Question: ${userPrompt}`;

    // Direct fetch to Gemini API v1beta Flash endpoint
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compiledPrompt }] }],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorPayload = await aiResponse.json().catch(() => ({}));
      console.error("----- AI API FETCH FAILED -----", aiResponse.status, errorPayload);
      
      return NextResponse.json({ 
        error: "AI_SERVICE_UNAVAILABLE", 
        details: "Failed to communicate with the intelligence engine." 
      }, { status: aiResponse.status });
    }

    const geminiData = await aiResponse.json();
    let finalAiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!finalAiText) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    // Process Lead Extraction (Parsing hidden ###DATA### string)
    if (finalAiText.includes('###DATA###')) {
      const responseSegments = finalAiText.split('###DATA###');
      finalAiText = responseSegments[0].trim(); // Extract clean response for the user
      
      const rawDataString = responseSegments[1] || '';
      const leadInfo: ExtractedLead = parseLeadFromText(rawDataString);
      
      // Save leads asynchronously (Non-blocking)
      if (leadInfo.name || leadInfo.phone || leadInfo.business_name) {
        saveLeadToDatabase(leadInfo);
      }
    }

    return NextResponse.json({ text: finalAiText });

  } catch (error: any) {
    console.error("----- CHAT ROUTE CRITICAL ERROR -----", error.message);
    return NextResponse.json({ 
      error: "INTERNAL_ERROR",
      details: "Communication failure." 
    }, { status: 500 });
  }
}

/**
 * Extracts structured lead data from the AI's data signature using regex.
 * @param {string} rawData - The raw data string from the AI.
 * @returns {ExtractedLead} Parsed lead object.
 */
function parseLeadFromText(rawData: string): ExtractedLead {
  return {
    name: rawData.match(/name:\s*([^,]+)/i)?.[1]?.trim() ?? null,
    phone: rawData.match(/phone:\s*([^,]+)/i)?.[1]?.trim() ?? null,
    business_name: rawData.match(/business:\s*([^,\n]+)/i)?.[1]?.trim() ?? null,
    product_interest: rawData.match(/product:\s*([^,\n]+)/i)?.[1]?.trim() ?? null,
  };
}

/**
 * Non-blocking utility to persist leads into Supabase.
 * @param {ExtractedLead} leadData - Cleaned lead information.
 */
async function saveLeadToDatabase(leadData: ExtractedLead) {
  try {
    const { error: dbError } = await supabase
      .from('leads')
      .insert([{
        name: leadData.name,
        phone: leadData.phone,
        business_name: leadData.business_name,
        product_interest: leadData.product_interest
      }]);
      
    if (dbError) console.error("Database Save Error:", dbError.message);
  } catch (err) {
    console.error("Database Pipeline Failure:", err);
  }
}
