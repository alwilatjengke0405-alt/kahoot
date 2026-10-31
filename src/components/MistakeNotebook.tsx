import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Check, X, Volume2, RotateCcw } from 'lucide-react';
import { PlayerScore, QuizQuestion } from '../types/quiz';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundEffects';

interface MistakeNotebookProps {
  player: PlayerScore;
  questions: QuizQuestion[];
  onBack: () => void;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  player,
  questions,
  onBack,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mistakes' | 'correct'>('mistakes');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [retestAnswers, setRetestAnswers] = useState<Record<string, string>>({});

  const answerMap = new Map(player.answers.map(a => [a.questionId, a]));

  const filteredQuestions = questions.filter(q => {
    const ans = answerMap.get(q.id);
    const isCorrect = ans?.isCorrect ?? false;

    if (filterType === 'mistakes' && isCorrect) return false;
    if (filterType === 'correct' && !isCorrect) return false;
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;

    return true;
  });

  const mistakesCount = questions.filter(q => !answerMap.get(q.id)?.isCorrect).length;

  const handleSpeak = (text: string) => {
    const clean = text.replace(/^(Benar|Salah|Contoh lain|Target|Transkrip|Audio|Dialogue):\s*/i, '');
    speechService.speak(clean, 0.95);
  };

  const handleRetestOption = (questionId: string, optionId: string, correctId: string) => {
    setRetestAnswers(prev => ({ ...prev, [questionId]: optionId }));
    if (optionId === correctId) {
      soundService.playCorrectChime();
    } else {
      soundService.playWrongBuzzer();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn pb-16">
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                Buku Catatan Kesalahan Siswa
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80">
              Ulas mengapa jawaban sebelumnya keliru, pelajari rumus kalimatnya, dan coba jawab kembali secara mandiri.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-2">
          <span>❌ {mistakesCount} Soal Perlu Penguatan</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType('mistakes')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'mistakes'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Hanya Kesalahan ({mistakesCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Semua Soal ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('correct')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filterType === 'correct'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Jawaban Benar ({questions.length - mistakesCount})
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter materi"
          className="bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/15 outline-none focus:border-purple-400 cursor-pointer"
        >
          <option value="all" className="bg-slate-900">Semua Materi (Recount & Community Leaders)</option>
          <option value="recount" className="bg-slate-900">1. Recount Text</option>
          <option value="community_leaders" className="bg-slate-900">2. Community Leaders</option>
        </select>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center bg-white/[0.05] rounded-3xl border border-white/10 text-purple-200 space-y-2">
          <p className="text-4xl">🎉</p>
          <p className="font-display text-xl font-black text-white">Tidak Ada Catatan dalam Kategori Ini</p>
          <p className="text-sm text-purple-200/70">Seluruh soal dijawab dengan benar atau sesuai filter yang dipilih.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, qIndex) => {
            const ans = answerMap.get(q.id);
            const isAnsCorrect = ans?.isCorrect ?? false;
            const currentRetest = retestAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-6 sm:p-7 rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-2xl space-y-5"
              >
                {/* Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-purple-200">
                    <span className="font-display font-black text-white text-sm">Soal #{qIndex + 1}</span>
                    <span className="opacity-40">·</span>
                    <span className="font-semibold text-purple-300">{q.categoryLabel}</span>
                    <span className="opacity-40">·</span>
                    <span className="uppercase font-bold text-amber-400">{q.difficulty}</span>
                  </div>

                  <div>
                    {isAnsCorrect ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Benar (+{ans?.pointsEarned || 0} pts)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 stroke-[3]" /> Kurang Tepat
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <h3 className="font-display text-lg sm:text-xl font-black text-white">
                    {q.question}
                  </h3>
                  {q.contextText && (
                    <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 text-sm text-slate-200 italic">
                      "{q.contextText}"
                    </div>
                  )}
                  {q.audioTranscript && (
                    <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between gap-2">
                      <span className="line-clamp-2">🔊 Audio: "{q.audioTranscript}"</span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(q.audioTranscript || '')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Putar
                      </button>
                    </div>
                  )}
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isOptionCorrect = opt.id === q.correctOptionId;
                    const wasChosen = opt.id === ans?.selectedOption;

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${
                          isOptionCorrect
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 font-bold'
                            : wasChosen
                            ? 'bg-rose-950/50 border-rose-500 text-rose-100'
                            : 'bg-black/30 border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            isOptionCorrect ? 'bg-emerald-500 text-white' : wasChosen ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-400'
                          }`}>
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        <div>
                          {isOptionCorrect && (
                            <span className="text-[10px] font-black uppercase text-emerald-300 px-2 py-0.5 bg-emerald-900/60 rounded">
                              Kunci Jawaban ✓
                            </span>
                          )}
                          {wasChosen && !isOptionCorrect && (
                            <span className="text-[10px] font-black uppercase text-rose-300 px-2 py-0.5 bg-rose-900/60 rounded">
                              Pilihan Anda ✗
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Instant Retest Bar */}
                {!isAnsCorrect && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                        Uji Ulang Pemahaman (Pilih jawaban yang tepat):
                      </span>
                      {currentRetest && (
                        <span className={`text-xs font-black ${
                          currentRetest === q.correctOptionId ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {currentRetest === q.correctOptionId ? 'Tepat Sekali! 🎉' : 'Masih belum pas, coba lagi!'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {q.options.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleRetestOption(q.id, opt.id, q.correctOptionId)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            currentRetest === opt.id
                              ? opt.id === q.correctOptionId
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-rose-600 text-white border-rose-400'
                              : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                          }`}
                        >
                          Pilihan {opt.id}: {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-depth Analysis Section */}
                <div className="space-y-3 pt-2">
                  {!isAnsCorrect && (
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs sm:text-sm text-rose-200 space-y-1">
                      <span className="font-bold text-rose-400 block text-xs uppercase tracking-wider">
                        🔍 Mengapa Pilihan Anda Kurang Tepat:
                      </span>
                      <p>{q.explanation.whyWrong}</p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-xs sm:text-sm text-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-400 block text-xs uppercase tracking-wider">
                      💡 Konsep & Aturan Tata Bahasa:
                    </span>
                    <p>{q.explanation.whyCorrect}</p>
                    <div className="mt-2 p-2.5 bg-black/60 rounded-xl border border-white/10 font-mono text-purple-200 text-xs">
                      {q.explanation.grammarRule}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-950/25 border border-purple-900/40 space-y-2">
                    <span className="font-bold text-purple-300 text-xs uppercase tracking-wider block">
                      📖 Contoh Kalimat yang Benar:
                    </span>
                    <div className="space-y-2">
                      {q.explanation.exampleSentences.map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200"
                        >
                          <span>{ex}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(ex)}
                            title="Dengarkan pengucapan kalimat"
                            className="p-1.5 text-purple-300 hover:text-white rounded-lg cursor-pointer flex-shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Return to Podium */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-display font-black text-sm rounded-2xl border border-white/15 shadow-xl cursor-pointer transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Panggung Juara</span>
        </button>
      </div>
    </div>
  );
};
