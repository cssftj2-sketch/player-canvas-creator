// Updated AIPlayerSearch.tsx with enhanced Playing Style display
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
  Shirt,
  Activity,
  Award,
  Flag,
  Ruler,
  Weight,
  Star,
  BarChart3,
  Footprints,
  Shield,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

/* =====================================================
   TYPES — ENHANCED DATA STRUCTURE
===================================================== */

interface PhysicalAttributes {
  height: string;
  weight: string;
  preferredFoot: string;
  pace: number;
  strength: number;
  stamina: number;
}

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

export interface PlayerData {
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
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'career' | 'style'>('overview');

  /* =====================================================
     SEARCH HANDLER
  ===================================================== */

  const searchPlayer = async () => {
    if (!searchQuery.trim()) {
      toast.error("Enter a player name");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/search-player`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: searchQuery.trim(),
            includeImage: true,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Search failed");
      }

      const player: PlayerData = await response.json();
      setPlayerData(player);
      setActiveTab('overview');

      toast.success(`Found ${player.name}`, {
        description: `${player.detailedPosition} • ${player.club}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSearchError(msg);
      toast.error("Search failed", { description: msg });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSearching) {
      searchPlayer();
    }
  };

  const applyPlayerData = () => {
    if (!playerData) return;
    onPlayerSelect(playerData);
    toast.success("Player data applied to canvas!", {
      description: "All stats including playing style have been placed",
    });
    setPlayerData(null);
    setSearchQuery("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 space-y-3">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-neutral-200">
          AI Player Search
        </h3>
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Messi, Salah, Mbappé..."
          className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-600 rounded-md text-neutral-200 placeholder:text-neutral-500"
          disabled={isSearching}
        />
        <button
          onClick={searchPlayer}
          disabled={isSearching}
          className="px-3 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
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
        <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-md p-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* PLAYER CARD */}
      {playerData && (
        <div className="bg-neutral-900 rounded-md overflow-hidden animate-in fade-in">
          {/* PLAYER HEADER WITH IMAGE */}
          <div className="relative p-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20">
            <div className="flex gap-3">
              {/* Player Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                {playerData.imageUrl ? (
                  <img
                    src={playerData.imageUrl}
                    alt={playerData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-neutral-500" />
                  </div>
                )}
              </div>
              
              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-neutral-200 truncate">
                      {playerData.name}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {playerData.detailedPosition}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-sm font-bold text-amber-400">
                      {playerData.currentSeasonStats.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Shirt className="w-3 h-3" />
                    #{playerData.shirtNumber}
                  </span>
                  <span>•</span>
                  <span>{playerData.club}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-neutral-700">
            {(['overview', 'stats', 'career', 'style'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                {tab === 'style' ? (
                  <span className="flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3" />
                    Style
                  </span>
                ) : (
                  tab.charAt(0).toUpperCase() + tab.slice(1)
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto">
            {activeTab === 'overview' && (
              <>
                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Flag className="w-3 h-3" />
                    {playerData.nationality}
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {playerData.age} years
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Ruler className="w-3 h-3" />
                    {playerData.physical.height}
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Weight className="w-3 h-3" />
                    {playerData.physical.weight}
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Footprints className="w-3 h-3" />
                    {playerData.physical.preferredFoot}
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <TrendingUp className="w-3 h-3" />
                    {playerData.marketValue}
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-neutral-300">Physical</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Pace', value: playerData.physical.pace },
                      { label: 'Strength', value: playerData.physical.strength },
                      { label: 'Stamina', value: playerData.physical.stamina },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-neutral-800 rounded p-1.5 text-center">
                        <div className="text-lg font-bold text-amber-400">{stat.value}</div>
                        <div className="text-[10px] text-neutral-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-emerald-400">Strengths</div>
                    <div className="flex flex-wrap gap-1">
                      {playerData.strengths.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-red-400">Weaknesses</div>
                    <div className="flex flex-wrap gap-1">
                      {playerData.weaknesses.map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px]">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'stats' && (
              <>
                {/* Season Stats */}
                <div className="text-xs font-medium text-neutral-300 mb-2">
                  2024/25 Season Stats
                </div>
                
                {/* Key Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { value: playerData.currentSeasonStats.goals, label: 'Goals', icon: Target },
                    { value: playerData.currentSeasonStats.assists, label: 'Assists', icon: Trophy },
                    { value: playerData.currentSeasonStats.appearances, label: 'Apps', icon: Activity },
                    { value: playerData.currentSeasonStats.minutesPlayed, label: 'Mins', icon: Calendar },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-neutral-800 rounded p-2">
                      <stat.icon className="w-3 h-3 mx-auto text-amber-400 mb-1" />
                      <div className="font-bold text-neutral-200">{stat.value}</div>
                      <div className="text-[10px] text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Advanced Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Pass Accuracy</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.passAccuracy}%</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">xG</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.xG.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">xA</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.xA.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Shots/Target</span>
                    <span className="text-neutral-200 font-medium">
                      {playerData.currentSeasonStats.shotsOnTarget}/{playerData.currentSeasonStats.shotsTotal}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Key Passes</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.keyPasses}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Dribbles</span>
                    <span className="text-neutral-200 font-medium">
                      {playerData.currentSeasonStats.dribblesCompleted}/{playerData.currentSeasonStats.dribblesAttempted}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Tackles Won</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.tacklesWon}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Interceptions</span>
                    <span className="text-neutral-200 font-medium">{playerData.currentSeasonStats.interceptions}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Yellow Cards</span>
                    <span className="text-yellow-400 font-medium">{playerData.currentSeasonStats.yellowCards}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-neutral-800 rounded">
                    <span className="text-neutral-400">Red Cards</span>
                    <span className="text-red-400 font-medium">{playerData.currentSeasonStats.redCards}</span>
                  </div>
                </div>

                {/* AFCON Match */}
                {playerData.afconMatch && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2">
                    <div className="flex items-center gap-1 font-semibold text-emerald-400 text-xs mb-2">
                      <Shield className="w-3 h-3" />
                      AFCON — {playerData.afconMatch.match}
                    </div>
                    <div className="text-[10px] text-emerald-300 mb-1">
                      Result: {playerData.afconMatch.result}
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                      <div>
                        <div className="font-bold text-emerald-400">{playerData.afconMatch.goals}</div>
                        <div className="text-neutral-500">Goals</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-400">{playerData.afconMatch.assists}</div>
                        <div className="text-neutral-500">Assists</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-400">{playerData.afconMatch.xG.toFixed(1)}</div>
                        <div className="text-neutral-500">xG</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-400">{playerData.afconMatch.manOfTheMatch ? '✓' : '-'}</div>
                        <div className="text-neutral-500">MOTM</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'career' && (
              <>
                {/* Career Totals */}
                <div className="text-xs font-medium text-neutral-300 mb-2">Career Statistics</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: playerData.careerStats.totalAppearances, label: 'Total Apps' },
                    { value: playerData.careerStats.totalGoals, label: 'Total Goals' },
                    { value: playerData.careerStats.totalAssists, label: 'Total Assists' },
                    { value: playerData.careerStats.trophiesWon, label: 'Trophies' },
                    { value: playerData.careerStats.internationalCaps, label: 'Intl Caps' },
                    { value: playerData.careerStats.internationalGoals, label: 'Intl Goals' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-neutral-800 rounded p-2 text-center">
                      <div className="font-bold text-amber-400">{stat.value}</div>
                      <div className="text-[10px] text-neutral-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Seasons */}
                {playerData.recentSeasons.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-neutral-300">Recent Seasons</div>
                    <div className="space-y-1">
                      {playerData.recentSeasons.map((season, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-neutral-800 rounded text-[11px]">
                          <div>
                            <span className="text-neutral-200 font-medium">{season.season}</span>
                            <span className="text-neutral-500 ml-1">({season.competition})</span>
                          </div>
                          <div className="flex gap-2 text-neutral-400">
                            <span>{season.appearances} apps</span>
                            <span className="text-amber-400">{season.goals}G</span>
                            <span className="text-emerald-400">{season.assists}A</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-neutral-800 rounded">
                    <div className="text-neutral-500">Contract Until</div>
                    <div className="text-neutral-200 font-medium">{playerData.contractUntil}</div>
                  </div>
                  <div className="p-2 bg-neutral-800 rounded">
                    <div className="text-neutral-500">Market Value</div>
                    <div className="text-neutral-200 font-medium">{playerData.marketValue}</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'style' && (
              <>
                {/* Playing Style Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                    <FileText className="w-4 h-4" />
                    <span>Playing Style Analysis</span>
                  </div>
                  
                  {playerData.playingStyle ? (
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-3">
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {playerData.playingStyle}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-3 text-center">
                      <p className="text-xs text-neutral-500 italic">
                        No playing style information available
                      </p>
                    </div>
                  )}

                  {/* Style Highlights */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2">
                      <div className="text-xs font-medium text-emerald-400 mb-1">Key Attributes</div>
                      <div className="flex flex-wrap gap-1">
                        {playerData.strengths.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
                      <div className="text-xs font-medium text-amber-400 mb-1">Position</div>
                      <div className="text-xs text-amber-300 font-semibold">
                        {playerData.detailedPosition}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Primary: {playerData.position}
                      </div>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-2 mt-2">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-300">
                        This playing style description will be automatically placed in the text description box on your canvas when you apply player data.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* APPLY BUTTON */}
          <div className="p-3 border-t border-neutral-700">
            <button
              onClick={applyPlayerData}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-md text-xs font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Apply All Data to Canvas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlayerSearch;
