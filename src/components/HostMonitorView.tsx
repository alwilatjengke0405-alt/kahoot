import React, { useState, useEffect } from 'react';
import { Crown, Users, Play, Pause, Clock, Check, X, BookOpen, ArrowRight, BarChart3, Plus, FastForward, Search, Sparkles, Filter } from 'lucide-react';
import { QuizQuestion, PlayerScore } from '../types/quiz';
import { speechService } from '../services/speechService';

interface HostMonitorViewProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  totalTime: number;
  isAnswered: boolean;
  players: PlayerScore[];
  onNextQuestion: () => void;
  onOpenExplanation: () => void;
  isLastQuestion: boolean;
  gamePin: string;
  isTimerPaused?: boolean;
  onTogglePauseTimer?: () => void;
  onAddTime?: () => void;
  onForceEndQuestion?: () => void;
}

export const HostMonitorView: React.FC<HostMonitorViewProps> = ({
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  totalTime,
  isAnswered,
  players,
  onNextQuestion,
  onOpenExplanation,
  isLastQuestion,
  gamePin,
  isTimerPaused = false,
  onTogglePauseTimer,
  onAddTime,
  onForceEndQuestion,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<0.8 | 1.0>(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'thinking' | 'correct' | 'wrong'>('all');

  useEffect(() => {
    setIsPlayingAudio(false);
    return () => {
      speechService.stop();
    };
  }, [question.id]);

  const handlePlayAudio = (rate: number = audioSpeed, forceRestart: boolean = false) => {
    const textToSpeak = question.audioTranscript || question.targetSpeechPhrase || question.question;
    if (!textToSpeak) return;

    if (isPlayingAudio && !forceRestart) {
      speechService.stop();
      setIsPlayingAudio(false);
      return;
    }

    if (isPlayingAudio && forceRestart) {
      speechService.stop();
    }

    setIsPlayingAudio(true);
    speechService.speak(
      textToSpeak,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  // Compute answers distribution
  const tally: Record<'A' | 'B' | 'C' | 'D', number> = { A: 0, B: 0, C: 0, D: 0 };
  let answeredCount = 0;
  let correctCount = 0;

  players.forEach((p) => {
    const lastAns = p.answers.find(a => a.questionId === question.id);
    if (lastAns && lastAns.selectedOption) {
      tally[lastAns.selectedOption] = (tally[lastAns.selectedOption] || 0) + 1;
      answeredCount++;
      if (lastAns.isCorrect) correctCount++;
    }
  });

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const timePercentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  const filteredPlayers = sortedPlayers.filter((player) => {
    const matchName = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchName) return false;

    const lastAns = player.answers.find(a => a.questionId === question.id);
    const ansGiven = !!lastAns?.selectedOption;
    const ansCorrect = !!lastAns?.isCorrect;

    if (statusFilter === 'answered') return ansGiven;
    if (statusFilter === 'thinking') return !ansGiven;
    if (statusFilter === 'correct') return isAnswered && ansCorrect;
    if (statusFilter === 'wrong') return isAnswered && ansGiven && !ansCorrect;
    return true;
  });

  const shapeStyles: Record<string, { btnClass: string; icon: string; label: string; barBg: string }> = {
    A: { btnClass: 'btn-kahoot-red', icon: '▲', label: 'Merah', barBg: 'bg-rose-500' },
    B: { btnClass: 'btn-kahoot-blue', icon: '◆', label: 'Biru', barBg: 'bg-blue-500' },
    C: { btnClass: 'btn-kahoot-yellow', icon: '●', label: 'Kuning', barBg: 'bg-amber-400' },
    D: { btnClass: 'btn-kahoot-green', icon: '■', label: 'Hijau', barBg: 'bg-emerald-500' },
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 animate-fadeIn pb-12">
      {/* Host Monitor Top Header */}
      <div className="p-3.5 sm:p-5 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-200 flex items-center justify-center font-bold shadow-inner">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-white text-base sm:text-xl">
                  Layar Proyektor Host
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-mono font-black">
                  PIN: {gamePin}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-purple-200/80">
                Soal {questionIndex + 1} dari {totalQuestions} · {question.categoryLabel} ({question.difficulty})
              </p>
            </div>
          </div>

          {/* Quick mobile timer badge */}
          <div className={`md:hidden px-3 py-1 rounded-xl font-mono font-black text-sm flex items-center gap-1 ${
            timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-black/50 text-purple-200 border border-white/10'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Live Participants Answer Counter & Timer on Desktop */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-bold text-purple-200">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Respon Siswa: <strong className="text-white font-mono">{answeredCount}</strong> / {players.length}</span>
          </div>

          <div className={`hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-mono font-black text-base ${
            timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50' : 'bg-black/50 text-purple-200 border border-white/10'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          {/* Host Master Control Toolbar */}
          {!isAnswered && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/15">
              {onTogglePauseTimer && (
                <button
                  type="button"
                  onClick={onTogglePauseTimer}
                  title={isTimerPaused ? 'Lanjutkan Waktu' : 'Jeda Waktu Kuis'}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isTimerPaused
                      ? 'bg-amber-500 text-slate-900 shadow-md font-extrabold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isTimerPaused ? 'Lanjut' : 'Jeda'}</span>
                </button>
              )}

              {onAddTime && (
                <button
                  type="button"
                  onClick={onAddTime}
                  title="Tambah waktu 10 detik"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-300" />
                  <span>+10s</span>
                </button>
              )}

              {onForceEndQuestion && (
                <button
                  type="button"
                  onClick={onForceEndQuestion}
                  title="Langsung selesaikan dan buka jawaban"
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kunci</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isTimerPaused
              ? 'bg-amber-400 animate-pulse'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400'
          }`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Main Question Card for Projector */}
      <div className="p-4 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-black/40 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-4 sm:space-y-5 text-center">
        <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug tracking-tight">
          {question.question}
        </h2>

        {question.contextText && (
          <div className="p-3.5 sm:p-5 rounded-2xl bg-black/60 border border-white/10 text-left text-slate-200 text-xs sm:text-base font-normal leading-relaxed italic shadow-inner">
            "{question.contextText}"
          </div>
        )}

        {/* Audio Broadcast Controls for Teacher */}
        {question.audioTranscript && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 text-left">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handlePlayAudio(audioSpeed)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAudio ? 'Jeda Audio Kelas' : 'Putar Audio ke Speaker Kelas'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const newSpeed = audioSpeed === 1.0 ? 0.8 : 1.0;
                  setAudioSpeed(newSpeed);
                  if (isPlayingAudio) {
                    handlePlayAudio(newSpeed, true);
                  }
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  audioSpeed === 0.8 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/10 text-purple-200 border-white/10'
                }`}
              >
                Tempo: {audioSpeed}x {audioSpeed === 0.8 ? '(Lambat)' : '(Normal)'}
              </button>
            </div>

            <span className="text-[11px] sm:text-xs text-purple-200/80">
              🔊 Speaker Aktif · Dengarkan bersama siswa di kelas
            </span>
          </div>
        )}
      </div>

      {/* 4 Options Grid (Big Screen Visual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4.5">
        {question.options.map((opt) => {
          const isCorrect = isAnswered && opt.id === question.correctOptionId;
          const choiceCount = tally[opt.id] || 0;
          const style = shapeStyles[opt.id] || shapeStyles.A;
          const choicePercent = answeredCount > 0 ? Math.round((choiceCount / answeredCount) * 100) : 0;

          return (
            <div
              key={opt.id}
              className={`kahoot-card-btn ${style.btnClass} p-4 sm:p-6 rounded-2xl text-left font-bold text-white shadow-xl transition-all flex flex-col justify-between gap-3 ${
                isAnswered && !isCorrect ? 'opacity-25 grayscale-[70%]' : ''
              } ${isCorrect ? 'ring-4 ring-emerald-300 ring-offset-4 ring-offset-[#0d011c] scale-[1.02] shadow-[0_0_30px_rgba(52,211,153,0.6)]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-black/30 flex items-center justify-center font-display font-black text-lg sm:text-xl shadow-inner border border-white/20 flex-shrink-0">
                    {style.icon}
                  </span>
                  <span className="text-sm sm:text-lg leading-snug font-extrabold text-white">{opt.text}</span>
                </div>

                {/* Response Tally Counter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-black/40 rounded-xl font-mono font-black text-xs sm:text-sm text-white border border-white/20 shadow-inner">
                    {choiceCount} Siswa
                  </span>
                  {isCorrect && (
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Check className="w-4 h-4 sm:w-6 sm:h-6 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Response Distribution Percentage Bar */}
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${style.barBg}`}
                  style={{ width: `${choicePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Player Ranking Monitor Table & Host Inspection Deck */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-300" />
            <h3 className="font-display text-base sm:text-xl font-black text-white">
              Pemantau Respon & Klasemen Siswa (Live Host Monitor)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold">
              Total {players.length} Siswa Terdaftar
            </span>
            {isAnswered && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Akurasi Kelas: {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
              </span>
            )}
          </div>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-purple-300/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-xs placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              Semua ({players.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('answered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'answered'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              Sudah Menjawab ({answeredCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('thinking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'thinking'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              Sedang Berpikir ({players.length - answeredCount})
            </button>

            {isAnswered && (
              <>
                <button
                  type="button"
                  onClick={() => setStatusFilter('correct')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === 'correct'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 text-emerald-300 hover:bg-white/20'
                  }`}
                >
                  Benar ({correctCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('wrong')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === 'wrong'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white/10 text-rose-300 hover:bg-white/20'
                  }`}
                >
                  Salah ({answeredCount - correctCount})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Players List with Responsive Layout */}
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {filteredPlayers.length === 0 ? (
            <div className="p-8 text-center text-xs text-purple-300/70 bg-black/20 rounded-2xl">
              Tidak ada siswa yang cocok dengan filter.
            </div>
          ) : (
            filteredPlayers.map((player) => {
              const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
              const lastAns = player.answers.find(a => a.questionId === question.id);
              const ansGiven = !!lastAns?.selectedOption;
              const ansCorrect = !!lastAns?.isCorrect;

              return (
                <div
                  key={player.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 flex items-center justify-center font-display font-black text-xs sm:text-sm text-purple-200 flex-shrink-0">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </span>
                    <span className="text-xl sm:text-2xl flex-shrink-0">{player.avatar}</span>
                    <div>
                      <span className="font-display font-extrabold text-white text-sm sm:text-base">
                        {player.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-purple-300/70 block">
                        {player.correctCount} Benar · Streak {player.streak}x
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                    {/* Status Indicator */}
                    {isAnswered ? (
                      ansCorrect ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Benar (+{lastAns?.pointsEarned} pts)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1">
                          <X className="w-3.5 h-3.5 stroke-[3]" /> Salah (Opsi {lastAns?.selectedOption || '-'})
                        </span>
                      )
                    ) : ansGiven ? (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] sm:text-xs font-bold flex items-center gap-1">
                        <span>✓ Sudah Menjawab</span>
                        {lastAns?.timeTakenSeconds && (
                          <span className="opacity-70 font-mono">({Math.round(lastAns.timeTakenSeconds)}s)</span>
                        )}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-400 text-[11px] sm:text-xs font-medium">
                        Sedang Berpikir...
                      </span>
                    )}

                    {/* Total Score */}
                    <div className="text-right min-w-[65px]">
                      <span className="font-mono font-black text-sm sm:text-base text-amber-300">
                        {player.score.toLocaleString()}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] text-purple-200/60 font-semibold uppercase">poin</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Host Action Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenExplanation}
          className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-white/15 cursor-pointer flex items-center justify-center gap-2 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-purple-300" />
          <span>Buka Penjelasan & Contoh Kalimat (Proyektor)</span>
        </button>

        <button
          type="button"
          onClick={onNextQuestion}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <span>{isLastQuestion ? 'Tampilkan Panggung Juara Akhir' : 'Lanjut ke Soal Berikutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
