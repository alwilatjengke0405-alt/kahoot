import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Play, Pause, Sparkles, Check, X, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import { speechService, speechRecognitionService, RecognitionResult } from '../services/speechService';
import { soundService } from '../services/soundEffects';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  totalTime: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isAnswered: boolean;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  onHoverShape: (shape: 'triangle' | 'diamond' | 'circle' | 'square' | null) => void;
  onViewExplanation: () => void;
  streak: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  totalTime,
  selectedOption,
  isAnswered,
  onSelectOption,
  onHoverShape,
  onViewExplanation,
  streak,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<0.8 | 1.0>(1.0);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [speechResult, setSpeechResult] = useState<RecognitionResult | null>(null);
  const [interimText, setInterimText] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  useEffect(() => {
    setIsPlayingAudio(false);
    setIsListeningMic(false);
    setSpeechResult(null);
    setInterimText('');
    setMicError(null);

    if (question.audioTranscript) {
      const timer = setTimeout(() => {
        handlePlayAudio(1.0);
      }, 700);
      return () => {
        clearTimeout(timer);
        speechService.stop();
      };
    }

    return () => {
      speechService.stop();
      speechRecognitionService.stopListening();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handlePlayAudio = useCallback((rate: number = 1.0, forceRestart: boolean = false) => {
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
  }, [question.audioTranscript, question.targetSpeechPhrase, question.question, isPlayingAudio]);

  const handleStartSpeakingPractice = () => {
    if (isListeningMic) {
      speechRecognitionService.stopListening();
      setIsListeningMic(false);
      return;
    }

    const target = question.targetSpeechPhrase || question.question;
    setMicError(null);
    setIsListeningMic(true);
    setInterimText('Mendengarkan pengucapan Anda...');

    speechRecognitionService.startListening(
      target,
      (text) => setInterimText(text),
      (result) => {
        setIsListeningMic(false);
        setSpeechResult(result);
        if (result.accuracyPercent >= 75) {
          soundService.playCorrectChime();
        }
      },
      (err) => {
        setIsListeningMic(false);
        setMicError(err);
      }
    );
  };

  const timePercentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  const isTimeUrgent = timeLeft <= 5 && !isAnswered;

  const shapeSVGs = {
    triangle: (
      <svg className="w-8 h-8 fill-white drop-shadow-md" viewBox="0 0 24 24">
        <polygon points="12,3 22,21 2,21" />
      </svg>
    ),
    diamond: (
      <svg className="w-8 h-8 fill-white drop-shadow-md" viewBox="0 0 24 24">
        <polygon points="12,2 22,12 12,22 2,12" />
      </svg>
    ),
    circle: (
      <svg className="w-8 h-8 fill-white drop-shadow-md" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    square: (
      <svg className="w-8 h-8 fill-white drop-shadow-md" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Top Meta Bar: Question progress & Timer */}
      <div className="flex items-center justify-between px-2 text-sm">
        <div className="flex items-center gap-2 text-purple-200/90 font-medium">
          <span className="font-display font-extrabold text-white text-base">Soal {questionIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span>{totalQuestions}</span>
          <span className="opacity-40">·</span>
          <span>{question.categoryLabel}</span>
          <span className="opacity-40">·</span>
          <span className="text-xs uppercase font-bold text-amber-400">{question.difficulty}</span>
        </div>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/30 to-amber-500/20 text-orange-300 border border-orange-500/40 rounded-full font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Combo x{streak}!</span>
            </div>
          )}

          {/* Kahoot Circular Pulse Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-black text-sm transition-all ${
            isTimeUrgent
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
              : 'bg-white/10 text-white border border-white/15'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 backdrop-blur-sm border border-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isTimeUrgent
              ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400'
          }`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Main Question Display Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-center">
        <h2 className="font-display text-xl sm:text-3xl font-black text-white leading-snug tracking-tight">
          {question.question}
        </h2>

        {/* Context Text Box */}
        {question.contextText && (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 text-left text-slate-200 text-sm sm:text-base font-normal leading-relaxed italic shadow-inner">
            "{question.contextText}"
          </div>
        )}

        {/* Listening Audio Control Deck */}
        {question.audioTranscript && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handlePlayAudio(audioSpeed)}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAudio ? 'Jeda Audio' : 'Dengarkan Rekaman Suara'}</span>
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
                  audioSpeed === 0.8
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                }`}
              >
                Tempo: {audioSpeed}x {audioSpeed === 0.8 ? '(Pelan)' : '(Normal)'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-purple-200/80">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping inline-block" />
              <span>Dengarkan detail percakapan / monolog dengan teliti</span>
            </div>
          </div>
        )}

        {/* Speaking Practice Deck */}
        {question.targetSpeechPhrase && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Latihan Shadowing & Pelafalan
              </span>
              <button
                type="button"
                onClick={() => handlePlayAudio(0.9)}
                className="text-xs text-emerald-300 hover:text-emerald-200 cursor-pointer flex items-center gap-1 underline"
              >
                <Volume2 className="w-3.5 h-3.5" /> Contoh Native Speaker
              </button>
            </div>

            <p className="font-mono text-sm sm:text-base font-semibold text-emerald-100 bg-black/40 p-3 rounded-xl border border-emerald-900/50">
              "{question.targetSpeechPhrase}"
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartSpeakingPractice}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                  isListeningMic
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListeningMic ? 'Merekam... Klik jika selesai' : 'Tekan & Ucapkan di Mic'}</span>
              </button>

              {speechResult && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-xl border border-white/10 text-xs">
                  <span className="text-slate-400">Akurasi:</span>
                  <span className={`font-black text-sm ${
                    speechResult.accuracyPercent >= 80 ? 'text-emerald-400' :
                    speechResult.accuracyPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {speechResult.accuracyPercent}%
                  </span>
                </div>
              )}
            </div>

            {interimText && (
              <p className="text-xs text-slate-300 italic">
                Terdeteksi: "{interimText}"
              </p>
            )}

            {micError && (
              <p className="text-xs text-rose-400">
                {micError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* The 4 Kahoot Geometric Shape Buttons (2x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5 pt-1">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrect = isAnswered && opt.id === question.correctOptionId;
          const isWrong = isAnswered && isSelected && !isCorrect;
          const isDimmed = isAnswered && !isCorrect && !isSelected;

          const shapeClasses: Record<string, string> = {
            triangle: 'btn-kahoot-red',
            diamond: 'btn-kahoot-blue',
            circle: 'btn-kahoot-yellow',
            square: 'btn-kahoot-green',
          };

          const btnClass = shapeClasses[opt.shape] || 'btn-kahoot-red';

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isAnswered}
              onMouseEnter={() => onHoverShape(opt.shape)}
              onMouseLeave={() => onHoverShape(null)}
              onClick={() => {
                soundService.playShapeClick(opt.shape);
                onSelectOption(opt.id);
              }}
              className={`kahoot-card-btn relative flex items-center gap-4 p-5 sm:p-6 rounded-2xl text-left font-bold text-white shadow-xl cursor-pointer ${btnClass} ${
                isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-[#0d011c] scale-[1.01]' : ''
              } ${
                isDimmed ? 'opacity-25 grayscale-[70%] cursor-not-allowed' : ''
              } ${
                isCorrect ? 'ring-4 ring-emerald-300 ring-offset-2 ring-offset-[#0d011c] shadow-[0_0_25px_rgba(52,211,153,0.5)]' : ''
              } ${
                isWrong ? 'ring-4 ring-rose-400 ring-offset-2 ring-offset-[#0d011c] opacity-75' : ''
              }`}
            >
              {/* Shape Icon Box */}
              <div className="w-12 h-12 rounded-xl bg-black/25 flex items-center justify-center flex-shrink-0 shadow-inner border border-white/20">
                {shapeSVGs[opt.shape]}
              </div>

              {/* Text */}
              <span className="flex-1 text-base sm:text-lg leading-snug drop-shadow-md font-extrabold text-white">
                {opt.text}
              </span>

              {/* Status Mark */}
              {isAnswered && (
                <div className="flex-shrink-0">
                  {isCorrect && (
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
                      <Check className="w-6 h-6 text-white stroke-[3]" />
                    </div>
                  )}
                  {isWrong && (
                    <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center shadow-lg">
                      <X className="w-6 h-6 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Card after answering */}
      {isAnswered && (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl animate-fadeIn ${
          selectedOption === question.correctOptionId
            ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/80 border-emerald-500/50 text-emerald-100'
            : 'bg-gradient-to-r from-rose-950/90 to-red-950/80 border-rose-500/50 text-rose-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              selectedOption === question.correctOptionId
                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-400 text-rose-300'
            }`}>
              {selectedOption === question.correctOptionId ? (
                <Check className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <X className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>

            <div>
              <p className="font-display font-black text-lg sm:text-xl">
                {selectedOption === question.correctOptionId
                  ? 'Jawaban Anda Tepat!'
                  : selectedOption === null
                  ? 'Waktu Habis!'
                  : 'Kurang Tepat, Mari Pelajari!'}
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                {selectedOption === question.correctOptionId
                  ? 'Kecepatan dan pemahaman konsep Anda sangat baik.'
                  : 'Ketahui letak kekeliruan dan rumus kalimat yang benar di bawah ini.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewExplanation}
            className="w-full sm:w-auto px-5 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-purple-700" />
            <span>Lihat Penjelasan & Contoh Kalimat</span>
          </button>
        </div>
      )}
    </div>
  );
};
