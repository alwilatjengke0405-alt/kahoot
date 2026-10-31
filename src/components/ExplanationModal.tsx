import React from 'react';
import { X, Check, BookOpen, Lightbulb, HelpCircle, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import { speechService } from '../services/speechService';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestion;
  selectedOptionId: 'A' | 'B' | 'C' | 'D' | null;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedOptionId,
  onNextQuestion,
  isLastQuestion,
}) => {
  if (!isOpen) return null;

  const isCorrect = selectedOptionId === question.correctOptionId;
  const userOption = question.options.find(o => o.id === selectedOptionId);
  const correctOption = question.options.find(o => o.id === question.correctOptionId);

  const handleSpeakExample = (sentence: string) => {
    const clean = sentence.replace(/^(Benar|Salah|Contoh lain|Target|Transkrip|Audio|Dialogue):\s*/i, '');
    speechService.speak(clean, 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#180735] border border-white/20 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className={`p-5 sm:p-6 flex items-center justify-between border-b ${
          isCorrect
            ? 'bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-transparent border-emerald-500/30'
            : 'bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-transparent border-rose-500/30'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
              isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {isCorrect ? <Check className="w-6 h-6 stroke-[3]" /> : <X className="w-6 h-6 stroke-[3]" />}
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {isCorrect ? 'Analisis Pemahaman Konsep' : 'Penjelasan & Petunjuk Jawaban'}
              </h3>
              <p className="text-xs text-purple-200/80">
                Materi: <span className="font-semibold text-white">{question.categoryLabel}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-sm sm:text-base text-slate-100">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80 mb-1">
                Pilihan Anda:
              </span>
              <div className="font-semibold flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-bold text-xs">
                  {selectedOptionId || '-'}
                </span>
                <span>{userOption?.text || 'Waktu Habis (Tidak Menjawab)'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-purple-950/40 border-purple-400/40 text-purple-200">
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80 mb-1">
                Jawaban yang Seharusnya Benar:
              </span>
              <div className="font-semibold flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  {question.correctOptionId}
                </span>
                <span className="text-white">{correctOption?.text}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Misconception diagnosis */}
          {!isCorrect && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/25 border border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <h4>Mengapa Pilihan Anda Kurang Tepat?</h4>
              </div>
              <p className="text-rose-100/95 text-sm leading-relaxed">
                {question.explanation.whyWrong}
              </p>
            </div>
          )}

          {/* Section 2: Why Correct */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/25 border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <h4>Mengapa Jawaban "{question.correctOptionId}" Tepat?</h4>
            </div>
            <p className="text-emerald-100/95 text-sm leading-relaxed">
              {question.explanation.whyCorrect}
            </p>
          </div>

          {/* Section 3: Grammar Rule Formula */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h4>Rumus & Aturan Tata Bahasa Kunci</h4>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-purple-200 text-xs sm:text-sm font-bold">
              {question.explanation.grammarRule}
            </div>
            <p className="text-xs text-purple-200/80">
              <strong className="text-white">Petunjuk Kunci Soal:</strong> {question.explanation.keyClue}
            </p>
          </div>

          {/* Section 4: Sentence Examples with Native Audio */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <h4>Contoh Kalimat yang Tepat (Proper Examples)</h4>
              </div>
              <span className="text-xs text-purple-300/70 italic hidden sm:inline">
                Klik ikon audio untuk mendengarkan lafal
              </span>
            </div>

            <div className="space-y-2.5">
              {question.explanation.exampleSentences.map((example, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/10 hover:border-purple-400/40 transition-colors"
                >
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                    {example}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSpeakExample(example)}
                    title="Dengarkan pengucapan kalimat"
                    className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/40 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Vocabulary Tips */}
          {question.explanation.vocabularyTips && question.explanation.vocabularyTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <h4>Pengayaan Kosakata (Vocabulary Boost)</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.explanation.vocabularyTips.map((tip, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 text-purple-200 border border-white/10 rounded-lg text-xs font-semibold"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-black/60 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-purple-200 hover:text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNextQuestion();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-sm rounded-xl shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <span>{isLastQuestion ? 'Lihat Papan Peringkat Akhir' : 'Lanjut ke Soal Berikutnya'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
