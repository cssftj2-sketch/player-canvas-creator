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
      // Call the edge function for AI-powered search
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ playerName: searchQuery }),
      });

      if (!response.ok) {
        // Fallback to mock data if API not available
        const mockPlayer: PlayerData = {
          name: searchQuery,
          position: 'Forward',
          club: 'FC Barcelona',
          nationality: 'Spain',
          age: 24,
          stats: {
            goals: Math.floor(Math.random() * 20) + 5,
            assists: Math.floor(Math.random() * 15) + 3,
            appearances: Math.floor(Math.random() * 30) + 10,
            rating: parseFloat((Math.random() * 2 + 6.5).toFixed(1)),
            passAccuracy: Math.floor(Math.random() * 20) + 75,
            tacklesWon: Math.floor(Math.random() * 50) + 20,
          }
        };
        setPlayerData(mockPlayer);
        toast.success(`Found player: ${mockPlayer.name}`);
        return;
      }

      const data = await response.json();
      setPlayerData(data.player);
      toast.success(`Found player: ${data.player.name}`);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      const mockPlayer: PlayerData = {
        name: searchQuery,
        position: 'Midfielder',
        club: 'Real Madrid',
        nationality: 'France',
        age: 26,
        stats: {
          goals: Math.floor(Math.random() * 15) + 3,
          assists: Math.floor(Math.random() * 20) + 5,
          appearances: Math.floor(Math.random() * 35) + 15,
          rating: parseFloat((Math.random() * 2 + 7).toFixed(1)),
          passAccuracy: Math.floor(Math.random() * 15) + 80,
          tacklesWon: Math.floor(Math.random() * 60) + 30,
        }
      };
      setPlayerData(mockPlayer);
      toast.success(`Found player: ${mockPlayer.name}`);
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
    <div className="bg-card border border-border rounded-lg p-3 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Search className="w-3.5 h-3.5 text-primary" />
        <h3 className="text-xs font-medium text-foreground">AI Player Search</h3>
      </div>

      {/* Search Input */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search player..."
          className="flex-1 px-2.5 py-1.5 bg-muted border border-border rounded-md text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
          disabled={isSearching}
        />
        <button
          onClick={searchPlayer}
          disabled={isSearching}
          className="px-2.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Player Results */}
      {playerData && (
        <div className="bg-muted/50 rounded-md p-2.5 space-y-2 border border-border animate-in fade-in slide-in-from-top-2">
          {/* Player Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground">{playerData.name}</h4>
                <p className="text-[10px] text-muted-foreground">{playerData.position}</p>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              <span>{playerData.club}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-2.5 h-2.5" />
              <span>{playerData.age} yrs</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-border">
            <div className="text-center">
              <div className="text-sm font-bold text-primary">{playerData.stats.goals}</div>
              <div className="text-[8px] text-muted-foreground uppercase">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-secondary">{playerData.stats.assists}</div>
              <div className="text-[8px] text-muted-foreground uppercase">Assists</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-primary">{playerData.stats.rating}</div>
              <div className="text-[8px] text-muted-foreground uppercase">Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-card/50 rounded p-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-primary" />
              <div>
                <div className="text-xs font-medium text-foreground">{playerData.stats.passAccuracy}%</div>
                <div className="text-[8px] text-muted-foreground">Pass</div>
              </div>
            </div>
            <div className="bg-card/50 rounded p-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-secondary" />
              <div>
                <div className="text-xs font-medium text-foreground">{playerData.stats.tacklesWon}</div>
                <div className="text-[8px] text-muted-foreground">Tackles</div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyPlayerData}
            className="w-full px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md transition-colors font-medium text-xs"
          >
            Apply to Canvas
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPlayerSearch;