import React, { useState } from 'react';
import { Search, Loader2, User, Calendar, MapPin, TrendingUp, Zap } from 'lucide-react';
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

  const searchPlayer = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulated AI search - In production, this would call Claude API
      // to search for real player data from sports databases
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock player data - this would be real data from Claude's search
      const mockPlayer: PlayerData = {
        name: searchQuery,
        position: 'Forward',
        club: 'FC Barcelona',
        nationality: 'Spain',
        age: 24,
        stats: {
          goals: 15,
          assists: 8,
          appearances: 28,
          rating: 7.8,
          passAccuracy: 85,
          tacklesWon: 42,
        }
      };

      setPlayerData(mockPlayer);
      toast.success(`Found player: ${mockPlayer.name}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search for player');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlayer();
    }
  };

  const applyPlayerData = () => {
    if (playerData) {
      onPlayerSelect(playerData);
      toast.success('Player data applied to canvas');
      setPlayerData(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-heading text-foreground">AI Player Search</h3>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search player name..."
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isSearching}
          />
        </div>
        <button
          onClick={searchPlayer}
          disabled={isSearching}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </>
          )}
        </button>
      </div>

      {/* Player Results */}
      {playerData && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border animate-in fade-in slide-in-from-top-2">
          {/* Player Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg text-foreground">{playerData.name}</h4>
                <p className="text-xs text-muted-foreground">{playerData.position}</p>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{playerData.club}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{playerData.age} years</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-display text-primary">{playerData.stats.goals}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-display text-secondary">{playerData.stats.assists}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Assists</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-display text-primary">{playerData.stats.rating}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card/50 rounded p-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-heading text-foreground">{playerData.stats.passAccuracy}%</div>
                <div className="text-[10px] text-muted-foreground">Pass Acc.</div>
              </div>
            </div>
            <div className="bg-card/50 rounded p-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <div>
                <div className="text-sm font-heading text-foreground">{playerData.stats.tacklesWon}</div>
                <div className="text-[10px] text-muted-foreground">Tackles</div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyPlayerData}
            className="w-full px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-colors font-heading text-sm"
          >
            Apply to Canvas
          </button>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Search for any player to automatically populate stats and information
      </div>
    </div>
  );
};

export default AIPlayerSearch;
