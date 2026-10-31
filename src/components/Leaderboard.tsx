import React from 'react';
import { Trophy, Flame, ArrowRight } from 'lucide-react';
import { PlayerScore } from '../types/quiz';

interface LeaderboardProps {
  players: PlayerScore[];
  currentUserId: string;
  onNext: () => void;
  isLastQuestion: boolean;
  questionIndex: number;
  totalQuestions: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  currentUserId,
  onNext,
  isLastQuestion,
  questionIndex,
  totalQuestions,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const userRank = sortedPlayers.findIndex(p => p.id === currentUserId) + 1;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 animate-fadeIn">
      {/* Tournament Stage Header */}
      <div className="p-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl shadow-2xl text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Papan Peringkat Sementara</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
          Klasemen Siswa
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/80">
          Setelah Soal {questionIndex + 1} dari {totalQuestions}
        </p>
      </div>

      {/* Players List */}
      <div className="space-y-3">
        {sortedPlayers.map((player, idx) => {
          const rank = idx + 1;
          const isUser = player.id === currentUserId;

          const rankGradients: Record<number, string> = {
            1: 'bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-transparent border-amber-400/50',
            2: 'bg-gradient-to-r from-slate-300/25 via-slate-400/15 to-transparent border-slate-300/40',
            3: 'bg-gradient-to-r from-amber-700/30 via-amber-800/15 to-transparent border-amber-600/40',
          };

          const rankStyle = rankGradients[rank] || 'bg-white/[0.04] border-white/10';

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 transform ${rankStyle} ${
                isUser ? 'ring-2 ring-purple-400 scale-[1.02] shadow-2xl shadow-purple-950/60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Number */}
                <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center font-display font-black text-base text-white border border-white/15">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                </div>

                {/* Avatar */}
                <div className="text-3xl">{player.avatar}</div>

                {/* Name */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-white text-base sm:text-lg">
                      {player.name}
                    </span>
                    {isUser && (
                      <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black uppercase rounded-full">
                        Anda
                      </span>
                    )}
                  </div>
                  {player.streak > 1 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      <span>{player.streak} Streak!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="font-mono font-black text-xl sm:text-2xl text-amber-300 drop-shadow">
                  {player.score.toLocaleString()}
                </span>
                <span className="block text-[10px] uppercase font-bold text-purple-200/70">
                  poin
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Standing & Continue Button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-purple-200/70 block">Posisi Anda Saat Ini</span>
          <span className="font-display font-black text-lg text-white">
            Peringkat #{userRank} dari {players.length} Siswa
          </span>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-sm rounded-xl border-b-4 border-purple-900 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
        >
          <span>{isLastQuestion ? 'Lihat Pemenang Akhir' : 'Lanjut ke Soal Berikutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
