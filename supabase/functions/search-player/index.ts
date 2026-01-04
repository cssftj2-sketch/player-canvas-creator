// =====================================================
// AI PLAYER SEARCH — PRODUCTION EDGE FUNCTION
// Using Lovable AI Gateway
// =====================================================

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// =====================================================
// ENV VALIDATION
// =====================================================

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

if (!LOVABLE_API_KEY) {
  throw new Error("Missing LOVABLE_API_KEY environment variable");
}

// =====================================================
// TYPES
// =====================================================

interface PlayerStats {
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shotsOnTarget: number;
  keyPasses: number;
  dribblesCompleted: number;
  tacklesWon: number;
  interceptions: number;
  duelsWon: number;
  foulsWon: number;
  xG: number;
  xA: number;
  passAccuracy: number;
  rating: number;
}

interface AfconMatchStats {
  competition: "AFCON";
  match: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  keyPasses: number;
  chancesCreated: number;
  dribblesCompleted: number;
  duelsWon: number;
  tackles: number;
  interceptions: number;
  foulsWon: number;
  passes: number;
  passAccuracy: number;
  xG: number;
  xA: number;
  manOfTheMatch: boolean;
}

interface PlayerResponse {
  name: string;
  position: string;
  club: string;
  nationality: string;
  age: number;
  imageQuery: string;
  stats: PlayerStats;
  afconMatch?: AfconMatchStats | null;
}

// =====================================================
// HELPERS
// =====================================================

function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// =====================================================
// PROMPT
// =====================================================

const systemPrompt = `
You are a professional football analytics engine.

CRITICAL RULES:
- RETURN ONLY VALID JSON
- NO MARKDOWN (Do not include \`\`\`json blocks)
- NO COMMENTS
- NO EXPLANATIONS
- DATA MUST BE REALISTIC
- NEVER HALLUCINATE IMPOSSIBLE STATS
- IF AFCON MATCH IS RELEVANT, INCLUDE IT

JSON FORMAT:
{
  "name": "",
  "position": "",
  "club": "",
  "nationality": "",
  "age": 0,
  "imageQuery": "",
  "stats": {
    "appearances": 0,
    "minutesPlayed": 0,
    "goals": 0,
    "assists": 0,
    "shotsOnTarget": 0,
    "keyPasses": 0,
    "dribblesCompleted": 0,
    "tacklesWon": 0,
    "interceptions": 0,
    "duelsWon": 0,
    "foulsWon": 0,
    "xG": 0,
    "xA": 0,
    "passAccuracy": 0,
    "rating": 7.0
  },
  "afconMatch": {
    "competition": "AFCON",
    "match": "Algeria vs Guinea",
    "minutesPlayed": 0,
    "goals": 0,
    "assists": 0,
    "shots": 0,
    "shotsOnTarget": 0,
    "keyPasses": 0,
    "chancesCreated": 0,
    "dribblesCompleted": 0,
    "duelsWon": 0,
    "tackles": 0,
    "interceptions": 0,
    "foulsWon": 0,
    "passes": 0,
    "passAccuracy": 0,
    "xG": 0,
    "xA": 0,
    "manOfTheMatch": false
  }
}
`;

// =====================================================
// MAIN HANDLER
// =====================================================

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body.query !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const query = body.query.trim();

    if (query.length < 2) {
      return new Response(
        JSON.stringify({ error: "Query too short" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // -------------------------------
    // LOVABLE AI GATEWAY CALL
    // -------------------------------
    console.log("Calling Lovable AI Gateway for player:", query);
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Provide professional football data for: ${query}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: corsHeaders }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: corsHeaders }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const raw = aiResponse.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("Empty AI response");
    }

    console.log("AI Response received:", raw.substring(0, 200));

    // -------------------------------
    // JSON PARSE
    // -------------------------------
    let parsed: PlayerResponse;

    try {
      // Clean up potential markdown formatting
      let cleanJson = raw.trim();
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.slice(7);
      }
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith("```")) {
        cleanJson = cleanJson.slice(0, -3);
      }
      parsed = JSON.parse(cleanJson.trim());
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", raw);
      throw new Error("Invalid JSON returned by AI");
    }

    // -------------------------------
    // SANITIZATION — CORE PLAYER
    // -------------------------------
    const player: PlayerResponse = {
      name: safeString(parsed.name),
      position: safeString(parsed.position),
      club: safeString(parsed.club),
      nationality: safeString(parsed.nationality),
      age: clamp(safeNumber(parsed.age), 15, 45),
      imageQuery: safeString(parsed.imageQuery),
      stats: {
        appearances: safeNumber(parsed.stats?.appearances),
        minutesPlayed: safeNumber(parsed.stats?.minutesPlayed),
        goals: safeNumber(parsed.stats?.goals),
        assists: safeNumber(parsed.stats?.assists),
        shotsOnTarget: safeNumber(parsed.stats?.shotsOnTarget),
        keyPasses: safeNumber(parsed.stats?.keyPasses),
        dribblesCompleted: safeNumber(parsed.stats?.dribblesCompleted),
        tacklesWon: safeNumber(parsed.stats?.tacklesWon),
        interceptions: safeNumber(parsed.stats?.interceptions),
        duelsWon: safeNumber(parsed.stats?.duelsWon),
        foulsWon: safeNumber(parsed.stats?.foulsWon),
        xG: safeNumber(parsed.stats?.xG),
        xA: safeNumber(parsed.stats?.xA),
        passAccuracy: clamp(safeNumber(parsed.stats?.passAccuracy, 80), 50, 100),
        rating: clamp(safeNumber(parsed.stats?.rating, 7), 0, 10),
      },
    };

    // -------------------------------
    // SANITIZATION — AFCON MATCH
    // -------------------------------
    if (parsed.afconMatch) {
      const m = parsed.afconMatch;

      player.afconMatch = {
        competition: "AFCON",
        match: safeString(m.match, "Algeria vs Guinea"),
        minutesPlayed: safeNumber(m.minutesPlayed),
        goals: safeNumber(m.goals),
        assists: safeNumber(m.assists),
        shots: safeNumber(m.shots),
        shotsOnTarget: safeNumber(m.shotsOnTarget),
        keyPasses: safeNumber(m.keyPasses),
        chancesCreated: safeNumber(m.chancesCreated),
        dribblesCompleted: safeNumber(m.dribblesCompleted),
        duelsWon: safeNumber(m.duelsWon),
        tackles: safeNumber(m.tackles),
        interceptions: safeNumber(m.interceptions),
        foulsWon: safeNumber(m.foulsWon),
        passes: safeNumber(m.passes),
        passAccuracy: clamp(safeNumber(m.passAccuracy, 80), 50, 100),
        xG: safeNumber(m.xG),
        xA: safeNumber(m.xA),
        manOfTheMatch: Boolean(m.manOfTheMatch),
      };
    } else {
      player.afconMatch = null;
    }

    console.log("Returning player data:", player.name);

    return new Response(JSON.stringify(player), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: "AI Player Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
