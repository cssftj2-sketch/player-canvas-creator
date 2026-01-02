import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerName } = await req.json();
    
    if (!playerName || typeof playerName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Player name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for player: ${playerName}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a football/soccer statistics expert. When given a player name, provide their current statistics in a structured JSON format. Use your knowledge to provide realistic statistics for real players. If the player is not well-known, generate realistic placeholder statistics.

Always respond with ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "name": "Player Full Name",
  "position": "Position (e.g., Forward, Midfielder, Defender, Goalkeeper)",
  "club": "Current Club Name",
  "nationality": "Country",
  "age": 25,
  "stats": {
    "goals": 15,
    "assists": 8,
    "appearances": 28,
    "rating": 7.8,
    "passAccuracy": 85,
    "tacklesWon": 42
  }
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Find statistics for football player: ${playerName}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response:', content);

    // Parse the JSON response from the AI
    let playerData;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      playerData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a fallback response
      playerData = {
        name: playerName,
        position: 'Forward',
        club: 'Unknown Club',
        nationality: 'Unknown',
        age: 25,
        stats: {
          goals: Math.floor(Math.random() * 20) + 5,
          assists: Math.floor(Math.random() * 15) + 3,
          appearances: Math.floor(Math.random() * 30) + 10,
          rating: parseFloat((Math.random() * 2 + 6.5).toFixed(1)),
          passAccuracy: Math.floor(Math.random() * 20) + 75,
          tacklesWon: Math.floor(Math.random() * 50) + 20,
        }
      };
    }

    console.log('Returning player data:', playerData);

    return new Response(
      JSON.stringify({ player: playerData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-player function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});