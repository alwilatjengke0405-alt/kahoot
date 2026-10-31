import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, BookOpen, Share2 } from 'lucide-react';
import { PlayerScore, QuizQuestion } from '../types/quiz';
import { soundService } from '../services/soundEffects';

interface PodiumScreenProps {
  players: PlayerScore[];
  currentUserId: string;
  questions: QuizQuestion[];
  onPlayAgain: () => void;
  onOpenMistakes: () => void;
  onOpenSheetsModal: () => void;
  isSheetsConnected: boolean;
}

export const PodiumScreen: React.FC<PodiumScreenProps> = ({
  players,
  currentUserId,
  questions,
  onPlayAgain,
  onOpenMistakes,
  onOpenSheetsModal,
  isSheetsConnected,
}) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const user = players.find(p => p.id === currentUserId);
  const userRank = sorted.findIndex(p => p.id === currentUserId) + 1;

  useEffect(() => {
    soundService.playPodiumVictory();

    const end = Date.now() + 3500;
    const colors = ['#e21b3c', '#1368ce', '#ffa602', '#26890c', '#a855f7', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const correctCount = user ? user.correctCount : 0;
  const accuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 animate-fadeIn pb-14">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Panggung Juara Kuis (Champions)</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
          Selamat Kepada Para Pemenang!
        </h1>
        <p className="text-sm text-purple-200/80">
          Seluruh siswa telah menyelesaikan kuis interaktif bahasa Inggris dengan luar biasa.
        </p>
      </div>

      {/* 3D-Styled Olympic Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-5 pt-4 px-2">
        {/* 2nd Place */}
        {second && (
          <div className="flex-1 flex flex-col items-center max-w-[190px]">
            <div className="text-4xl sm:text-5xl mb-2">{second.avatar}</div>
            <div className="font-display text-xs sm:text-sm font-black text-slate-200 truncate max-w-full">
              {second.name}
            </div>
            <div className="text-xs font-mono font-bold text-slate-300 mb-2">
              {second.score.toLocaleString()} pts
            </div>
            <div className="w-full h-36 sm:h-44 bg-gradient-to-t from-slate-700 via-slate-600 to-slate-400 rounded-t-3xl border-t-4 border-slate-200 flex flex-col items-center justify-start p-4 shadow-2xl">
              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900">2</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900/80">Perak</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {first && (
          <div className="flex-1 flex flex-col items-center max-w-[210px] -mt-8">
            <div className="relative">
              <div className="text-5xl sm:text-6xl mb-2 animate-bounce">{first.avatar}</div>
              <span className="absolute -top-4 -right-2 text-2xl">👑</span>
            </div>
            <div className="font-display text-sm sm:text-base font-black text-amber-300 truncate max-w-full">
              {first.name}
            </div>
            <div className="text-xs font-mono font-black text-amber-400 mb-2">
              {first.score.toLocaleString()} pts
            </div>
            <div className="w-full h-48 sm:h-60 bg-gradient-to-t from-amber-600 via-yellow-500 to-amber-300 rounded-t-3xl border-t-4 border-amber-100 flex flex-col items-center justify-start p-4 shadow-2xl ring-4 ring-amber-400/40">
              <span className="font-display text-4xl sm:text-5xl font-black text-amber-950">1</span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-950/80">Juara 1</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="flex-1 flex flex-col items-center max-w-[190px]">
            <div className="text-4xl sm:text-5xl mb-2">{third.avatar}</div>
            <div className="font-display text-xs sm:text-sm font-black text-amber-200 truncate max-w-full">
              {third.name}
            </div>
            <div className="text-xs font-mono font-bold text-amber-300 mb-2">
              {third.score.toLocaleString()} pts
            </div>
            <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-600 rounded-t-3xl border-t-4 border-amber-400 flex flex-col items-center justify-start p-4 shadow-2xl">
              <span className="font-display text-3xl sm:text-4xl font-black text-amber-100">3</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200/80">Perunggu</span>
            </div>
          </div>
        )}
      </div>

      {/* User Performance Card */}
      {user && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="text-4xl">{user.avatar}</div>
              <div>
                <h3 className="font-display text-xl font-black text-white">{user.name}</h3>
                <p className="text-xs text-purple-200/80 font-medium">
                  Peringkat #{userRank} dari {players.length} Peserta Kuis
                </p>
              </div>
            </div>

            <div className="px-4 py-1.5 bg-purple-500/30 border border-purple-400/40 rounded-full font-mono font-black text-purple-200 text-sm">
              Skor Total: {user.score.toLocaleString()} Poin
            </div>
          </div>

          {/* Stats Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200/70 block uppercase font-bold tracking-wider">Benar / Total</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                {correctCount} / {questions.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200/70 block uppercase font-bold tracking-wider">Akurasi</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-indigo-400">
                {accuracy}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200/70 block uppercase font-bold tracking-wider">Max Streak</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-orange-400">
                🔥 {user.highestStreak || user.streak}x
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-purple-200/70 block uppercase font-bold tracking-wider">Predikat</span>
              <span className="font-display text-sm sm:text-base font-black text-amber-300">
                {accuracy >= 80 ? '🌟 Master' : accuracy >= 60 ? '⚡ Scholar' : '🌱 Explorer'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={onOpenMistakes}
          className="flex items-center justify-center gap-2.5 px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-display font-black text-sm rounded-2xl border-b-4 border-amber-800 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>Buku Catatan Kesalahan</span>
        </button>

        <button
          type="button"
          onClick={onOpenSheetsModal}
          className="flex items-center justify-center gap-2.5 px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-black text-sm rounded-2xl border-b-4 border-emerald-900 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>{isSheetsConnected ? 'Sinkron ke Spreadsheet' : 'Atur Google Sheets'}</span>
        </button>

        <button
          type="button"
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-2.5 px-5 py-4 bg-purple-950/60 hover:bg-purple-900/60 text-white font-display font-black text-sm rounded-2xl border border-purple-400/30 border-b-4 border-b-purple-950 shadow-xl active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-purple-300" />
          <span>Main Kuis Baru</span>
        </button>
      </div>
    </div>
  );
};
