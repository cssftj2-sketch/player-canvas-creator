import React, { useState } from "react";
import {
  Search,
  Loader2,
  User,
  Calendar,
  MapPin,
  TrendingUp,
  Zap,
  Trophy,
  Target,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

/* =====================================================
   TYPES — MATCH EDGE FUNCTION EXACTLY
===================================================== */

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

export interface PlayerData {
  name: string;
  position: string;
  club: string;
  nationality: string;
  age: number;
  imageQuery: string;
  stats: PlayerStats;
  afconMatch?: AfconMatchStats | null;
}

interface AIPlayerSearchProps {
  onPlayerSelect: (player: PlayerData) => void;
}

/* =====================================================
   COMPONENT
===================================================== */

const AIPlayerSearch: React.FC<AIPlayerSearchProps> = ({
  onPlayerSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(
    null
  );
  const [searchError, setSearchError] = useState<string | null>(
    null
  );

  /* =====================================================
     SEARCH HANDLER — ALIGNED WITH EDGE FUNCTION
  ===================================================== */

  const searchPlayer = async () => {
    if (!searchQuery.trim()) {
      toast.error("Enter a player name");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const supabaseUrl = import.meta.env
        .VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env
        .VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/search-player`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: searchQuery.trim(), // ✅ CORRECT
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          err.message || "Search failed"
        );
      }

      const player: PlayerData =
        await response.json();

      setPlayerData(player);

      toast.success(`Found ${player.name}`, {
        description: `${player.position} • ${player.club}`,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unknown error";
      setSearchError(msg);
      toast.error("Search failed", {
        description: msg,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter" && !isSearching) {
      searchPlayer();
    }
  };

  const applyPlayerData = () => {
    if (!playerData) return;
    onPlayerSelect(playerData);
    toast.success("Player applied to canvas");
    setPlayerData(null);
    setSearchQuery("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-3">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">
          AI Player Search
        </h3>
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          onKeyDown={handleKeyPress}
          placeholder="Messi, Mahrez, Salah..."
          className="flex-1 px-3 py-2 text-xs bg-muted border border-border rounded-md"
          disabled={isSearching}
        />
        <button
          onClick={searchPlayer}
          disabled={isSearching}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ERROR */}
      {searchError && (
        <div className="flex gap-2 bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span>{searchError}</span>
        </div>
      )}

      {/* PLAYER CARD */}
      {playerData && (
        <div className="bg-muted rounded-md p-3 space-y-3 animate-in fade-in">
          {/* HEADER */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold">
                  {playerData.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {playerData.position}
                </div>
              </div>
            </div>
            <div className="text-sm font-bold flex items-center gap-1">
              <Trophy className="w-4 h-4 text-primary" />
              {playerData.stats.rating}
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <MapPin className="w-3 h-3" />
              {playerData.club}
            </div>
            <div className="flex gap-1">
              <Calendar className="w-3 h-3" />
              {playerData.age} yrs
            </div>
          </div>

          {/* CORE STATS */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <Target className="mx-auto w-3 h-3" />
              <div className="font-bold">
                {playerData.stats.goals}
              </div>
              <div className="text-[10px]">
                Goals
              </div>
            </div>
            <div>
              <Trophy className="mx-auto w-3 h-3" />
              <div className="font-bold">
                {playerData.stats.assists}
              </div>
              <div className="text-[10px]">
                Assists
              </div>
            </div>
            <div>
              <div className="font-bold">
                {playerData.stats.appearances}
              </div>
              <div className="text-[10px]">
                Apps
              </div>
            </div>
          </div>

          {/* ADVANCED */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex gap-1">
              <TrendingUp className="w-3 h-3" />
              xG {playerData.stats.xG}
            </div>
            <div className="flex gap-1">
              <Zap className="w-3 h-3" />
              xA {playerData.stats.xA}
            </div>
          </div>

          {/* AFCON MATCH */}
          {playerData.afconMatch && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2 text-xs">
              <div className="font-semibold text-emerald-600">
                AFCON — {playerData.afconMatch.match}
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <div>
                  Goals:{" "}
                  {playerData.afconMatch.goals}
                </div>
                <div>
                  xG: {playerData.afconMatch.xG}
                </div>
                <div>
                  MOTM:{" "}
                  {playerData.afconMatch
                    .manOfTheMatch
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            </div>
          )}

          {/* APPLY */}
          <button
            onClick={applyPlayerData}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold"
          >
            Apply to Canvas
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPlayerSearch;
