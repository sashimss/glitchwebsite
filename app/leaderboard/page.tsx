"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Medal, Zap, Users, Crown } from 'lucide-react';

// Type definitions
interface HostelScore {
  rank: number;
  hostel_id: number;
  hostel_name: string;
  total_score: number;
  score_percentage?: number;
  participant_count?: number;
  game_scores?: {
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
  };
}

interface Player {
  rank: number;
  name: string;
  hostel_name: string;
  score: number;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<'overall' | 'games' | 'players'>('overall');
  const [selectedGame, setSelectedGame] = useState(1);
  const [overallData, setOverallData] = useState<HostelScore[]>([]);
  const [gameData, setGameData] = useState<HostelScore[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  // Fetch overall hostel leaderboard
  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard/hostels');
      const data = await res.json();
      setOverallData(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching overall leaderboard:', error);
    }
    setLoading(false);
  };

  // Fetch game-specific hostel leaderboard
  const fetchGameLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/hostels/${gameId}`);
      const data = await res.json();
      setGameData(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching game leaderboard:', error);
    }
    setLoading(false);
  };

  // Fetch player leaderboard
  const fetchPlayerLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/players/${gameId}`);
      const data = await res.json();
      setPlayerData(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching player leaderboard:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'overall') {
      fetchOverallLeaderboard();
    } else if (activeTab === 'games') {
      fetchGameLeaderboard(selectedGame);
    } else if (activeTab === 'players') {
      fetchPlayerLeaderboard(selectedGame);
    }
  }, [activeTab, selectedGame]);

  // Animate bars on mount
  useEffect(() => {
    if (barsRef.current && overallData.length > 0 && activeTab === 'overall') {
      const bars = barsRef.current.querySelectorAll('.bar-fill');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          (bar as HTMLElement).style.width = (bar as HTMLElement).dataset.width || '0%';
        }, index * 50);
      });
    }
  }, [overallData, activeTab]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-cyan-400 to-blue-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Trophy className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text">
            🎮 LEADERBOARD 🎮
          </h1>
          <p className="text-xl text-cyan-300">Inter-Hostel Gaming Championship</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overall')}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'overall'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50 scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Users className="inline w-5 h-5 mr-2" />
            Overall Hostels
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'games'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Zap className="inline w-5 h-5 mr-2" />
            Game Hostels
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50 scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Trophy className="inline w-5 h-5 mr-2" />
            Top Players
          </button>
        </div>

        {/* Game Selector for Games and Players tabs */}
        {(activeTab === 'games' || activeTab === 'players') && (
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((gameNum) => (
              <button
                key={gameNum}
                onClick={() => setSelectedGame(gameNum)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedGame === gameNum
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/50'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Game {gameNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-cyan-300">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Overall Hostel Leaderboard */}
            {activeTab === 'overall' && (
              <div ref={barsRef} className="space-y-4">
                {overallData.map((hostel, index) => (
                  <div
                    key={hostel.hostel_id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r bg-gray-700">
                          {getRankIcon(hostel.rank)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{hostel.hostel_name}</h3>
                          <p className="text-sm text-gray-400">{hostel.participant_count} participants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-cyan-400">{hostel.total_score.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Total Score</p>
                      </div>
                    </div>
                    <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`bar-fill absolute h-full bg-gradient-to-r ${getRankColor(hostel.rank)} transition-all duration-1000 ease-out shadow-lg`}
                        data-width={`${hostel.score_percentage}%`}
                        style={{ width: '0%' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                        {hostel.score_percentage?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Game-Specific Hostel Leaderboard */}
            {activeTab === 'games' && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {gameData.map((hostel) => (
                  <div
                    key={hostel.hostel_id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(hostel.rank)} flex items-center justify-center font-bold text-lg`}>
                        {hostel.rank}
                      </div>
                      <h3 className="text-lg font-bold">{hostel.hostel_name}</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{hostel.total_score.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Player Leaderboard */}
            {activeTab === 'players' && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {playerData.map((player) => (
                  <div
                    key={player.rank}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(player.rank)} flex items-center justify-center font-bold`}>
                          {player.rank}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{player.name}</h3>
                          <p className="text-sm text-gray-400">{player.hostel_name}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-400">{player.score.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #06b6d4, #3b82f6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0891b2, #2563eb);
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;