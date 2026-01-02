import React, { useState } from 'react';
import { Search, Loader2, User, Calendar, MapPin, TrendingUp, Zap, Trophy, Target, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerData {
  name: string;
  position: string;
  club: string;
  nationality: string;
  age: number;
  stats: {
    goals: number;
    assists: number;
    appearances: number;
    rating: number;
    passAccuracy: number;
    tacklesWon: number;
  };
}

interface AIPlayerSearchProps {
  onPlayerSelect: (player: PlayerData) => void;
}

export const AIPlayerSearch: React.FC<AIPlayerSearchProps> = ({ onPlayerSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchPlayer = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      // Call the edge function for AI-powered search
      const response = await fetch(`${supabaseUrl}/functions/v1/search-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ playerName: searchQuery.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please check API configuration.');
        }
        
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.player) {
        throw new Error('Invalid response from server');
      }

      setPlayerData(data.player);
      toast.success(`Found player: ${data.player.name}`, {
        description: `${data.player.position} • ${data.player.club}`,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to search player';
      setSearchError(errorMessage);
      
      // Show error toast
      toast.error('Search failed', {
        description: errorMessage,
      });
      
      // Create fallback mock data with position-appropriate stats
      const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      
      const statsByPosition = {
        'Forward': { goals: [10, 25], assists: [5, 15], tackles: [10, 30], pass: [75, 85] },
        'Midfielder': { goals: [3, 12], assists: [5, 18], tackles: [30, 60], pass: [80, 92] },
        'Defender': { goals: [0, 5], assists: [0, 5], tackles: [50, 90], pass: [80, 90] },
        'Goalkeeper': { goals: [0, 0], assists: [0, 1], tackles: [0, 5], pass: [60, 75] },
      };
      
      const statRange = statsByPosition[randomPosition];
      
      const mockPlayer: PlayerData = {
        name: searchQuery.trim(),
        position: randomPosition,
        club: 'Unknown Club',
        nationality: 'Unknown',
        age: Math.floor(Math.random() * 10) + 20,
        stats: {
          goals: Math.floor(Math.random() * (statRange.goals[1] - statRange.goals[0])) + statRange.goals[0],
          assists: Math.floor(Math.random() * (statRange.assists[1] - statRange.assists[0])) + statRange.assists[0],
          appearances: Math.floor(Math.random() * 20) + 15,
          rating: parseFloat((Math.random() * 1.5 + 6.5).toFixed(1)),
          passAccuracy: Math.floor(Math.random() * (statRange.pass[1] - statRange.pass[0])) + statRange.pass[0],
          tacklesWon: Math.floor(Math.random() * (statRange.tackles[1] - statRange.tackles[0])) + statRange.tackles[0],
        }
      };
      
      setPlayerData(mockPlayer);
      toast.info('Using sample data', {
        description: 'Real data unavailable - showing estimated stats',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      searchPlayer();
    }
  };

  const applyPlayerData = () => {
    if (playerData) {
      onPlayerSelect(playerData);
      toast.success('Player data applied!', {
        description: 'Canvas updated with player statistics',
      });
      setPlayerData(null);
      setSearchQuery('');
      setSearchError(null);
    }
  };

  const clearResults = () => {
    setPlayerData(null);
    setSearchError(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-medium text-foreground">AI Player Search</h3>
        </div>
        {playerData && (
          <button
            onClick={clearResults}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Messi, Haaland, Mbappe..."
          className="flex-1 px-2.5 py-1.5 bg-muted border border-border rounded-md text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          disabled={isSearching}
        />
        <button
          onClick={searchPlayer}
          disabled={isSearching || !searchQuery.trim()}
          className="px-2.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Error Display */}
      {searchError && !playerData && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-destructive">
            <p className="font-medium">Search Failed</p>
            <p className="text-destructive/80 mt-0.5">{searchError}</p>
          </div>
        </div>
      )}

      {/* Player Results */}
      {playerData && (
        <div className="bg-muted/50 rounded-md p-2.5 space-y-2 border border-border animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Player Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground leading-tight">{playerData.name}</h4>
                <p className="text-[10px] text-muted-foreground">{playerData.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 rounded text-[10px] text-primary font-medium">
              <Trophy className="w-2.5 h-2.5" />
              {playerData.stats.rating}
            </div>
          </div>

          {/* Player Info */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              <span className="truncate">{playerData.club}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-2.5 h-2.5" />
              <span>{playerData.age} years</span>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-border">
            <div className="text-center bg-card/50 rounded p-1.5">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-2.5 h-2.5 text-primary" />
                <div className="text-sm font-bold text-foreground">{playerData.stats.goals}</div>
              </div>
              <div className="text-[8px] text-muted-foreground uppercase mt-0.5">Goals</div>
            </div>
            <div className="text-center bg-card/50 rounded p-1.5">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-secondary" />
                <div className="text-sm font-bold text-foreground">{playerData.stats.assists}</div>
              </div>
              <div className="text-[8px] text-muted-foreground uppercase mt-0.5">Assists</div>
            </div>
            <div className="text-center bg-card/50 rounded p-1.5">
              <div className="text-sm font-bold text-foreground">{playerData.stats.appearances}</div>
              <div className="text-[8px] text-muted-foreground uppercase mt-0.5">Apps</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-card/50 rounded p-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground">{playerData.stats.passAccuracy}%</div>
                <div className="text-[8px] text-muted-foreground truncate">Pass Accuracy</div>
              </div>
            </div>
            <div className="bg-card/50 rounded p-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-secondary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground">{playerData.stats.tacklesWon}</div>
                <div className="text-[8px] text-muted-foreground truncate">Tackles Won</div>
              </div>
            </div>
          </div>

          {/* Nationality Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="px-2 py-0.5 bg-muted rounded-full font-medium">
              {playerData.nationality}
            </span>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyPlayerData}
            className="w-full px-3 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md transition-colors font-medium text-xs shadow-sm hover:shadow"
          >
            Apply to Canvas
          </button>
        </div>
      )}

      {/* Help Text */}
      {!playerData && !isSearching && (
        <p className="text-[10px] text-muted-foreground text-center">
          Search for any professional football player
        </p>
      )}
    </div>
  );
};

export default AIPlayerSearch;