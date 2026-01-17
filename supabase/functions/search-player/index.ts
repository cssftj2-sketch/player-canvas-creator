// =====================================================
// AI PLAYER SEARCH — ENHANCED EDGE FUNCTION
// Using Lovable AI Gateway with Image Generation
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

interface SeasonStats {
  season: string;
  competition: string;
  appearances: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  rating: number;
}

interface CareerStats {
  totalAppearances: number;
  totalGoals: number;
  totalAssists: number;
  trophiesWon: number;
  internationalCaps: number;
  internationalGoals: number;
}

interface PhysicalAttributes {
  height: string;
  weight: string;
  preferredFoot: string;
  pace: number;
  strength: number;
  stamina: number;
}

interface PlayerStats {
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shotsOnTarget: number;
  shotsTotal: number;
  keyPasses: number;
  dribblesCompleted: number;
  dribblesAttempted: number;
  tacklesWon: number;
  interceptions: number;
  duelsWon: number;
  duelsTotal: number;
  foulsWon: number;
  foulsConceded: number;
  xG: number;
  xA: number;
  passAccuracy: number;
  passesCompleted: number;
  passesAttempted: number;
  rating: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  aerialDuelsWon: number;
  crossesCompleted: number;
  longBallsCompleted: number;
  groundDuelsWon: number;
  blockedShots: number;
  clearances: number;
  recoveries: number;
  goalsPerGame: number;
  assistsPerGame: number;
  minutesPerGoal: number;
}

interface AfconMatchStats {
  competition: "AFCON";
  match: string;
  result: string;
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
  fullName: string;
  position: string;
  detailedPosition: string;
  club: string;
  clubCountry: string;
  nationality: string;
  secondNationality: string | null;
  dateOfBirth: string;
  age: number;
  birthplace: string;
  shirtNumber: number;
  marketValue: string;
  contractUntil: string;
  agent: string;
  imageQuery: string;
  imageUrl: string | null;
  physical: PhysicalAttributes;
  currentSeasonStats: PlayerStats;
  recentSeasons: SeasonStats[];
  careerStats: CareerStats;
  afconMatch?: AfconMatchStats | null;
  strengths: string[];
  weaknesses: string[];
  playingStyle: string;
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

function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}

// =====================================================
// PROMPT
// =====================================================

const systemPrompt = `
You are a professional football analytics engine with comprehensive knowledge of players worldwide.

CRITICAL RULES:
- RETURN ONLY VALID JSON
- NO MARKDOWN (Do not include \`\`\`json blocks)
- NO COMMENTS
- NO EXPLANATIONS
- DATA MUST BE REALISTIC AND ACCURATE
- NEVER HALLUCINATE IMPOSSIBLE STATS
- INCLUDE CURRENT SEASON 2024/25 STATS
- IF AFCON MATCH IS RELEVANT (African player), INCLUDE IT

JSON FORMAT:
{
  "name": "Short Name",
  "fullName": "Full Legal Name",
  "position": "Forward/Midfielder/Defender/Goalkeeper",
  "detailedPosition": "Right Winger/Central Midfielder/etc",
  "club": "Current Club",
  "clubCountry": "Country of club",
  "nationality": "Primary Nationality",
  "secondNationality": null,
  "dateOfBirth": "DD/MM/YYYY",
  "age": 0,
  "birthplace": "City, Country",
  "shirtNumber": 10,
  "marketValue": "€50M",
  "contractUntil": "2027",
  "agent": "Agent Name",
  "imageQuery": "Player Name football player portrait",
  "physical": {
    "height": "180cm",
    "weight": "75kg",
    "preferredFoot": "Right/Left/Both",
    "pace": 85,
    "strength": 70,
    "stamina": 80
  },
  "currentSeasonStats": {
    "appearances": 0,
    "minutesPlayed": 0,
    "goals": 0,
    "assists": 0,
    "shotsOnTarget": 0,
    "shotsTotal": 0,
    "keyPasses": 0,
    "dribblesCompleted": 0,
    "dribblesAttempted": 0,
    "tacklesWon": 0,
    "interceptions": 0,
    "duelsWon": 0,
    "duelsTotal": 0,
    "foulsWon": 0,
    "foulsConceded": 0,
    "xG": 0.0,
    "xA": 0.0,
    "passAccuracy": 85,
    "passesCompleted": 0,
    "passesAttempted": 0,
    "rating": 7.0,
    "yellowCards": 0,
    "redCards": 0,
    "cleanSheets": 0,
    "aerialDuelsWon": 0,
    "crossesCompleted": 0,
    "longBallsCompleted": 0,
    "groundDuelsWon": 0,
    "blockedShots": 0,
    "clearances": 0,
    "recoveries": 0,
    "goalsPerGame": 0.0,
    "assistsPerGame": 0.0,
    "minutesPerGoal": 0
  },
  "recentSeasons": [
    {
      "season": "2023/24",
      "competition": "League Name",
      "appearances": 0,
      "goals": 0,
      "assists": 0,
      "minutesPlayed": 0,
      "rating": 7.0
    }
  ],
  "careerStats": {
    "totalAppearances": 0,
    "totalGoals": 0,
    "totalAssists": 0,
    "trophiesWon": 0,
    "internationalCaps": 0,
    "internationalGoals": 0
  },
  "afconMatch": null,
  "strengths": ["Dribbling", "Vision", "Finishing"],
  "weaknesses": ["Aerial Duels", "Defensive Work"],
  "playingStyle": "A creative attacking player known for..."
}

For African players, include AFCON match data if they participated:
{
  "afconMatch": {
    "competition": "AFCON",
    "match": "Team A vs Team B",
    "result": "2-1",
    "minutesPlayed": 90,
    "goals": 1,
    "assists": 0,
    "shots": 3,
    "shotsOnTarget": 2,
    "keyPasses": 2,
    "chancesCreated": 1,
    "dribblesCompleted": 4,
    "duelsWon": 8,
    "tackles": 1,
    "interceptions": 0,
    "foulsWon": 2,
    "passes": 45,
    "passAccuracy": 87,
    "xG": 0.8,
    "xA": 0.2,
    "manOfTheMatch": false
  }
}
`;

// =====================================================
// IMAGE SEARCH FUNCTION
// =====================================================

async function searchPlayerImage(playerName: string, club: string): Promise<string | null> {
  try {
    console.log("Searching for real player image:", playerName);
    
    // Use AI to find the real player image URL from trusted sources
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a football image URL finder. Return ONLY a direct image URL to a real photo of the requested football player. 
            
RULES:
- Return ONLY the URL, nothing else
- Use Wikipedia/Wikimedia Commons URLs when possible (format: https://upload.wikimedia.org/...)
- Alternatively use official club/league photos
- The URL must end in .jpg, .jpeg, .png, or .webp
- Must be a REAL photo of the actual player
- If you cannot find a verified URL, return "null"
- NO explanations, NO markdown, just the URL or "null"`
          },
          {
            role: "user",
            content: `Find a real photo URL for football player: ${playerName}${club ? ` who plays for ${club}` : ''}`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("Image search failed:", response.status);
      return null;
    }

    const data = await response.json();
    const urlResponse = data.choices?.[0]?.message?.content?.trim();
    
    if (urlResponse && urlResponse !== "null" && urlResponse.startsWith("http")) {
      // Validate it looks like an image URL
      const isImageUrl = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(urlResponse) || 
                         urlResponse.includes("upload.wikimedia.org") ||
                         urlResponse.includes("tmssl.akamaized.net") ||
                         urlResponse.includes("img.a.transfermarkt");
      
      if (isImageUrl) {
        console.log("Found real player image:", urlResponse.substring(0, 80));
        return urlResponse;
      }
    }
    
    console.log("No valid image URL found for:", playerName);
    return null;
  } catch (error) {
    console.error("Image search error:", error);
    return null;
  }
}

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
    const includeImage = body.includeImage !== false; // Default to true

    if (query.length < 2) {
      return new Response(
        JSON.stringify({ error: "Query too short" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // -------------------------------
    // LOVABLE AI GATEWAY CALL - Player Data
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
          { role: "user", content: `Provide comprehensive professional football data for: ${query}. Include current 2024/25 season stats, career totals, and recent seasons.` }
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

    console.log("AI Response received:", raw.substring(0, 300));

    // -------------------------------
    // JSON PARSE
    // -------------------------------
    let parsed: any;

    try {
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
    // IMAGE SEARCH (parallel with data processing)
    // -------------------------------
    let playerImageUrl: string | null = null;
    if (includeImage) {
      playerImageUrl = await searchPlayerImage(parsed.name || query, parsed.club || "");
    }

    // -------------------------------
    // SANITIZATION — FULL PLAYER DATA
    // -------------------------------
    const stats = parsed.currentSeasonStats || parsed.stats || {};
    
    const player: PlayerResponse = {
      name: safeString(parsed.name),
      fullName: safeString(parsed.fullName, parsed.name),
      position: safeString(parsed.position),
      detailedPosition: safeString(parsed.detailedPosition, parsed.position),
      club: safeString(parsed.club),
      clubCountry: safeString(parsed.clubCountry),
      nationality: safeString(parsed.nationality),
      secondNationality: parsed.secondNationality || null,
      dateOfBirth: safeString(parsed.dateOfBirth),
      age: clamp(safeNumber(parsed.age), 15, 45),
      birthplace: safeString(parsed.birthplace),
      shirtNumber: safeNumber(parsed.shirtNumber, 10),
      marketValue: safeString(parsed.marketValue, "€10M"),
      contractUntil: safeString(parsed.contractUntil, "2026"),
      agent: safeString(parsed.agent, "Unknown"),
      imageQuery: safeString(parsed.imageQuery),
      imageUrl: playerImageUrl,
      physical: {
        height: safeString(parsed.physical?.height, "180cm"),
        weight: safeString(parsed.physical?.weight, "75kg"),
        preferredFoot: safeString(parsed.physical?.preferredFoot, "Right"),
        pace: clamp(safeNumber(parsed.physical?.pace, 70), 1, 99),
        strength: clamp(safeNumber(parsed.physical?.strength, 70), 1, 99),
        stamina: clamp(safeNumber(parsed.physical?.stamina, 70), 1, 99),
      },
      currentSeasonStats: {
        appearances: safeNumber(stats.appearances),
        minutesPlayed: safeNumber(stats.minutesPlayed),
        goals: safeNumber(stats.goals),
        assists: safeNumber(stats.assists),
        shotsOnTarget: safeNumber(stats.shotsOnTarget),
        shotsTotal: safeNumber(stats.shotsTotal),
        keyPasses: safeNumber(stats.keyPasses),
        dribblesCompleted: safeNumber(stats.dribblesCompleted),
        dribblesAttempted: safeNumber(stats.dribblesAttempted),
        tacklesWon: safeNumber(stats.tacklesWon),
        interceptions: safeNumber(stats.interceptions),
        duelsWon: safeNumber(stats.duelsWon),
        duelsTotal: safeNumber(stats.duelsTotal),
        foulsWon: safeNumber(stats.foulsWon),
        foulsConceded: safeNumber(stats.foulsConceded),
        xG: safeNumber(stats.xG),
        xA: safeNumber(stats.xA),
        passAccuracy: clamp(safeNumber(stats.passAccuracy, 80), 50, 100),
        passesCompleted: safeNumber(stats.passesCompleted),
        passesAttempted: safeNumber(stats.passesAttempted),
        rating: clamp(safeNumber(stats.rating, 7), 0, 10),
        yellowCards: safeNumber(stats.yellowCards),
        redCards: safeNumber(stats.redCards),
        cleanSheets: safeNumber(stats.cleanSheets),
        aerialDuelsWon: safeNumber(stats.aerialDuelsWon),
        crossesCompleted: safeNumber(stats.crossesCompleted),
        longBallsCompleted: safeNumber(stats.longBallsCompleted),
        groundDuelsWon: safeNumber(stats.groundDuelsWon),
        blockedShots: safeNumber(stats.blockedShots),
        clearances: safeNumber(stats.clearances),
        recoveries: safeNumber(stats.recoveries),
        goalsPerGame: safeNumber(stats.goalsPerGame),
        assistsPerGame: safeNumber(stats.assistsPerGame),
        minutesPerGoal: safeNumber(stats.minutesPerGoal),
      },
      recentSeasons: safeArray(parsed.recentSeasons).slice(0, 5).map((s: any) => ({
        season: safeString(s.season),
        competition: safeString(s.competition),
        appearances: safeNumber(s.appearances),
        goals: safeNumber(s.goals),
        assists: safeNumber(s.assists),
        minutesPlayed: safeNumber(s.minutesPlayed),
        rating: clamp(safeNumber(s.rating, 7), 0, 10),
      })),
      careerStats: {
        totalAppearances: safeNumber(parsed.careerStats?.totalAppearances),
        totalGoals: safeNumber(parsed.careerStats?.totalGoals),
        totalAssists: safeNumber(parsed.careerStats?.totalAssists),
        trophiesWon: safeNumber(parsed.careerStats?.trophiesWon),
        internationalCaps: safeNumber(parsed.careerStats?.internationalCaps),
        internationalGoals: safeNumber(parsed.careerStats?.internationalGoals),
      },
      afconMatch: null,
      strengths: safeArray(parsed.strengths).slice(0, 5).map(s => safeString(s)),
      weaknesses: safeArray(parsed.weaknesses).slice(0, 3).map(s => safeString(s)),
      playingStyle: safeString(parsed.playingStyle),
    };

    // -------------------------------
    // SANITIZATION — AFCON MATCH
    // -------------------------------
    if (parsed.afconMatch) {
      const m = parsed.afconMatch;

      player.afconMatch = {
        competition: "AFCON",
        match: safeString(m.match, "Match"),
        result: safeString(m.result, "0-0"),
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
    }

    console.log("Returning enhanced player data:", player.name, "with image:", !!playerImageUrl);

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
