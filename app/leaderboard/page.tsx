"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Zap, Users, Crown } from "lucide-react";

interface HostelScore {
  rank: number;
  hostel_id: number;
  hostel_name: string;
  total_score: number;
  score_percentage?: number;
  participant_count?: number;
}

interface Player {
  rank: number;
  name: string;
  hostel_name: string;
  score: number;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<"overall" | "games" | "players">("overall");
  const [selectedGame, setSelectedGame] = useState(1);
  const [overallData, setOverallData] = useState<HostelScore[]>([]);
  const [gameData, setGameData] = useState<HostelScore[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard/hostels");
      const data = await res.json();
      setOverallData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
    setLoading(false);
  };

  const fetchGameLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/hostels/${gameId}`);
      const data = await res.json();
      setGameData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching game leaderboard:", error);
    }
    setLoading(false);
  };

  const fetchPlayerLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/players/${gameId}`);
      const data = await res.json();
      setPlayerData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching player leaderboard:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "overall") fetchOverallLeaderboard();
    else if (activeTab === "games") fetchGameLeaderboard(selectedGame);
    else if (activeTab === "players") fetchPlayerLeaderboard(selectedGame);
  }, [activeTab, selectedGame]);

  useEffect(() => {
    if (barsRef.current && overallData.length > 0 && activeTab === "overall") {
      const bars = barsRef.current.querySelectorAll(".bar-fill");
      bars.forEach((bar, index) => {
        setTimeout(() => {
          (bar as HTMLElement).style.width =
            (bar as HTMLElement).dataset.width || "0%";
        }, index * 50);
      });
    }
  }, [overallData, activeTab]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600"; // 🥇 gold
    if (rank === 2) return "from-gray-300 to-gray-500"; // 🥈 silver
    if (rank === 3) return "from-orange-400 to-orange-600"; // 🥉 bronze
    // 🌿 all others use same green tone
    return "from-green-800 to-green-700";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Trophy className="w-5 h-5 text-[var(--primary)]" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050A0A] to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text">
            🎮 LEADERBOARD 🎮
          </h1>
          <p className="text-xl text-[var(--primary)]">
            Inter-Hostel Gaming Championship
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            {
              tab: "overall",
              icon: <Users className="inline w-5 h-5 mr-2" />,
              label: "Overall Hostels",
            },
            {
              tab: "games",
              icon: <Zap className="inline w-5 h-5 mr-2" />,
              label: "Game Hostels",
            },
            {
              tab: "players",
              icon: <Trophy className="inline w-5 h-5 mr-2" />,
              label: "Top Players",
            },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${activeTab === tab
                  ? "bg-gradient-to-r from-green-900 to-green-800 shadow-lg shadow-[var(--primary)]/70 scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Game Selector */}
        {(activeTab === "games" || activeTab === "players") && (
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((gameNum) => (
              <button
                key={gameNum}
                onClick={() => setSelectedGame(gameNum)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedGame === gameNum
                    ? "bg-gradient-to-r from-green-900 to-green-800 shadow-md shadow-[var(--primary)]/60"
                    : "bg-gray-700 hover:bg-gray-600"
                  }`}
              >
                Game {gameNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--primary)]">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {activeTab === "overall" && (
              <div ref={barsRef} className="space-y-4">
                {overallData.map((hostel) => (
                  <div
                    key={hostel.hostel_id}
                    className="bg-gray-900/60 rounded-lg p-4 border border-gray-800 hover:border-[var(--primary)] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getRankColor(
                            hostel.rank
                          )}`}
                        >
                          {getRankIcon(hostel.rank)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {hostel.hostel_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {hostel.participant_count} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--primary)]">
                          {hostel.total_score.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">Total Score</p>
                      </div>
                    </div>
                    <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`bar-fill absolute h-full bg-gradient-to-r ${getRankColor(
                          hostel.rank
                        )} transition-all duration-1000 ease-out shadow-[0_0_10px_var(--primary)]`}
                        data-width={`${hostel.score_percentage}%`}
                        style={{ width: "0%" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
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
        :root {
          --primary: oklch(0.85 0.35 135);
        }

        .neon-text {
          text-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary),
            0 0 30px var(--primary), 0 0 45px var(--primary);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            text-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary),
              0 0 30px var(--primary);
          }
          50% {
            opacity: 0.9;
            text-shadow: 0 0 12px var(--primary), 0 0 24px var(--primary),
              0 0 36px var(--primary);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
