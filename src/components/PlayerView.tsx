import React, { useState, useEffect } from 'react';
import { Smartphone, Clock, Flame, BookOpen, AlertCircle } from 'lucide-react';
import { QuizQuestion, PlayerScore, GamePhase } from '../types/quiz';
import { soundService } from '../services/soundEffects';

interface PlayerViewProps {
  currentQuestion?: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  totalTime: number;
  phase: GamePhase;
  hostPin: string;
  onPlayerAnswer: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  onJoinRoom: (nickname: string, avatar: string, pin: string) => void;
  playerScore?: PlayerScore;
  players: PlayerScore[];
  onOpenMistakes: () => void;
  defaultNickname?: string;
  defaultAvatar?: string;
}

const AVATARS = ['🎓', '🚀', '🦊', '🦁', '⚡', '🌟', '🦉', '👑', '🎯', '🦄'];

export const PlayerView: React.FC<PlayerViewProps> = ({
  currentQuestion,
  questionIndex,
  totalQuestions,
  timeLeft,
  totalTime,
  phase,
  hostPin,
  onPlayerAnswer,
  onJoinRoom,
  playerScore,
  players,
  onOpenMistakes,
  defaultNickname = 'Ahmad Rizky Pratama',
  defaultAvatar = '🎓',
}) => {
  const [pinInput, setPinInput] = useState(hostPin);
  const [nickname, setNickname] = useState(defaultNickname);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultNickname) setNickname(defaultNickname);
    if (defaultAvatar) setSelectedAvatar(defaultAvatar);
  }, [defaultNickname, defaultAvatar]);

  // Auto-detect PIN from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin');
      if (urlPin) {
        setPinInput(urlPin);
      }
    }
  }, []);

  // Reset answer when new question begins
  useEffect(() => {
    setSelectedOption(null);
    setIsLocked(false);
  }, [currentQuestion?.id]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError('Harap masukkan 6 digit Game PIN.');
      return;
    }
    if (!nickname.trim()) {
      setPinError('Harap masukkan nama siswa Anda.');
      return;
    }

    setPinError(null);
    setHasJoined(true);
    onJoinRoom(nickname.trim(), selectedAvatar, pinInput.trim());
  };

  const handleSelect = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (isLocked || phase !== 'question') return;
    setSelectedOption(optId);
    setIsLocked(true);
    onPlayerAnswer(optId);
  };

  // Sorted leaderboard standing for this player
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const playerRank = playerScore ? sorted.findIndex(p => p.id === playerScore.id) + 1 : 1;
  const isCorrect = selectedOption && currentQuestion && selectedOption === currentQuestion.correctOptionId;

  // 1. SCREEN: JOIN MENU
  if (!hasJoined) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 animate-fadeIn py-6 px-4">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Mode Siswa (Mobile Controller)</span>
          </div>
          <h2 className="font-display text-3xl font-black text-white tracking-tight">
            Join Kuis Kelas
          </h2>
          <p className="text-xs text-purple-200/80">
            Masukkan Game PIN dari layar proyektor guru atau klik tautan kelas
          </p>
        </div>

        {/* Join Card */}
        <form
          onSubmit={handleJoin}
          className="p-6 sm:p-8 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-5"
        >
          {pinError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
              Game PIN (6 Digit):
            </label>
            <input
              type="text"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Contoh: 849201"
              className="w-full px-5 py-3.5 bg-black/50 border border-white/20 rounded-2xl text-center font-mono font-black text-2xl text-white tracking-widest placeholder-white/30 focus:outline-none focus:border-emerald-400 shadow-inner"
            />
          </div>

          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
              Nama Siswa:
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ketik nama lengkap atau panggilan..."
              className="w-full px-5 py-3.5 bg-black/50 border border-white/20 rounded-2xl text-white font-bold text-base placeholder-white/30 focus:outline-none focus:border-emerald-400 shadow-inner"
            />
          </div>

          {/* Avatar Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
              Pilih Avatar:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-emerald-600 ring-2 ring-white scale-110 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Enter Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-display font-black text-lg rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            Masuk ke Arena Kuis!
          </button>
        </form>
      </div>
    );
  }

  // 2. SCREEN: WAITING FOR HOST IN LOBBY
  if (phase === 'lobby' || phase === 'countdown') {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-6 animate-fadeIn py-12 px-4 text-center">
        <div className="w-24 h-24 rounded-3xl bg-white/10 border-2 border-emerald-400 flex items-center justify-center text-6xl shadow-2xl animate-bounce">
          {selectedAvatar}
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl font-black text-white">
            Halo, {nickname}!
          </h2>
          <p className="text-sm text-emerald-300 font-semibold">
            ✓ Anda telah terhubung ke Game PIN <span className="font-mono font-bold text-white">[{pinInput}]</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 w-full">
          <div className="flex items-center justify-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>Menunggu Guru / Host</span>
          </div>
          <p className="text-xs text-purple-200/80 leading-relaxed">
            Kuis akan segera dimulai di layar proyektor kelas. Siapkan jari Anda untuk memilih jawaban tercepat!
          </p>
        </div>
      </div>
    );
  }

  // 3. SCREEN: IN-GAME CONTROLLER OR ANSWERED
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 animate-fadeIn pb-12 px-2">
      {/* Top Controller Status Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{selectedAvatar}</span>
          <div>
            <span className="font-display font-black text-white text-sm">{nickname}</span>
            <span className="text-[10px] text-purple-300/80 block">
              Peringkat #{playerRank} ({playerScore?.score || 0} pts)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {playerScore && playerScore.streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full font-bold text-xs">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>x{playerScore.streak}</span>
            </div>
          )}

          <div className={`px-3 py-1 rounded-xl font-mono font-black text-sm flex items-center gap-1 ${
            timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-black/40 text-purple-200 border border-white/10'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Controller Notice */}
      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center text-xs text-purple-200">
        <span>👀 Lihat soal di layar proyektor kelas, lalu tekan tombol jawaban di bawah:</span>
      </div>

      {/* The 4 Big Touch Buttons */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4.5">
        {/* Triangle - Red */}
        <button
          type="button"
          disabled={isLocked || phase !== 'question'}
          onClick={() => {
            soundService.playShapeClick('triangle');
            handleSelect('A');
          }}
          className={`kahoot-card-btn btn-kahoot-red h-32 sm:h-40 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xl active:scale-95 transition-all ${
            selectedOption === 'A'
              ? 'ring-4 ring-white ring-offset-2 ring-offset-[#0d011c] scale-[1.02]'
              : ''
          } ${isLocked && selectedOption !== 'A' ? 'opacity-25 grayscale-[70%]' : ''}`}
        >
          <svg className="w-10 h-10 sm:w-14 sm:h-14 fill-white drop-shadow-lg" viewBox="0 0 24 24">
            <polygon points="12,3 22,21 2,21" />
          </svg>
          <span className="text-white font-display font-black text-lg sm:text-xl drop-shadow-md">A</span>
        </button>

        {/* Diamond - Blue */}
        <button
          type="button"
          disabled={isLocked || phase !== 'question'}
          onClick={() => {
            soundService.playShapeClick('diamond');
            handleSelect('B');
          }}
          className={`kahoot-card-btn btn-kahoot-blue h-32 sm:h-40 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xl active:scale-95 transition-all ${
            selectedOption === 'B'
              ? 'ring-4 ring-white ring-offset-2 ring-offset-[#0d011c] scale-[1.02]'
              : ''
          } ${isLocked && selectedOption !== 'B' ? 'opacity-25 grayscale-[70%]' : ''}`}
        >
          <svg className="w-10 h-10 sm:w-14 sm:h-14 fill-white drop-shadow-lg" viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" />
          </svg>
          <span className="text-white font-display font-black text-lg sm:text-xl drop-shadow-md">B</span>
        </button>

        {/* Circle - Yellow */}
        <button
          type="button"
          disabled={isLocked || phase !== 'question'}
          onClick={() => {
            soundService.playShapeClick('circle');
            handleSelect('C');
          }}
          className={`kahoot-card-btn btn-kahoot-yellow h-32 sm:h-40 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xl active:scale-95 transition-all ${
            selectedOption === 'C'
              ? 'ring-4 ring-white ring-offset-2 ring-offset-[#0d011c] scale-[1.02]'
              : ''
          } ${isLocked && selectedOption !== 'C' ? 'opacity-25 grayscale-[70%]' : ''}`}
        >
          <svg className="w-10 h-10 sm:w-14 sm:h-14 fill-white drop-shadow-lg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span className="text-white font-display font-black text-lg sm:text-xl drop-shadow-md">C</span>
        </button>

        {/* Square - Green */}
        <button
          type="button"
          disabled={isLocked || phase !== 'question'}
          onClick={() => {
            soundService.playShapeClick('square');
            handleSelect('D');
          }}
          className={`kahoot-card-btn btn-kahoot-green h-32 sm:h-40 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xl active:scale-95 transition-all ${
            selectedOption === 'D'
              ? 'ring-4 ring-white ring-offset-2 ring-offset-[#0d011c] scale-[1.02]'
              : ''
          } ${isLocked && selectedOption !== 'D' ? 'opacity-25 grayscale-[70%]' : ''}`}
        >
          <svg className="w-10 h-10 sm:w-14 sm:h-14 fill-white drop-shadow-lg" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" />
          </svg>
          <span className="text-white font-display font-black text-lg sm:text-xl drop-shadow-md">D</span>
        </button>
      </div>

      {/* Answer Status Feedback */}
      {isLocked && phase === 'question' && (
        <div className="p-4 rounded-2xl bg-black/60 border border-white/20 text-center space-y-1 animate-fadeIn">
          <p className="font-display font-black text-white text-base">
            ✓ Jawaban Terkunci!
          </p>
          <p className="text-xs text-purple-200/80">
            Menunggu waktu habis untuk melihat hasil di proyektor...
          </p>
        </div>
      )}

      {/* Answer Result Banner when Answered */}
      {phase === 'answered' && (
        <div className={`p-5 rounded-2xl border text-center space-y-2 animate-fadeIn shadow-2xl ${
          isCorrect
            ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/80 border-emerald-500/50 text-emerald-100'
            : 'bg-gradient-to-r from-rose-950/90 to-red-950/80 border-rose-500/50 text-rose-100'
        }`}>
          <p className="font-display font-black text-2xl">
            {isCorrect ? 'Jawaban Benar! 🎉' : 'Kurang Tepat! 💡'}
          </p>
          <p className="text-xs opacity-90">
            {isCorrect
              ? `Poin kecepatan telah ditambahkan ke skormu!`
              : `Pelajari alasan mengapa pilihanmu keliru di Buku Catatan Kesalahan.`}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenMistakes}
              className="px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-700" />
              <span>Buka Catatan Kesalahan Saya</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
