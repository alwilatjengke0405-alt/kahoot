import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Database, Send, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { APPS_SCRIPT_TEMPLATE, sheetsService } from '../services/sheetsService';
import { GoogleSheetsConfig, PlayerScore, QuizQuestion } from '../types/quiz';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  playerScore?: PlayerScore;
  questions?: QuizQuestion[];
  category?: string;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  playerScore,
  questions,
  category = 'All',
}) => {
  const [scriptUrl, setScriptUrl] = useState(config.scriptUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'code' | 'history'>('setup');

  useEffect(() => {
    if (isOpen) {
      setScriptUrl(config.scriptUrl || '');
      setSyncStatus(null);
    }
  }, [isOpen, config.scriptUrl]);

  const localHistory = sheetsService.getLocalSubmissions();

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = () => {
    const updated: GoogleSheetsConfig = {
      ...config,
      scriptUrl: scriptUrl.trim(),
      connected: scriptUrl.trim().startsWith('https://script.google.com/'),
    };
    onSaveConfig(updated);
    sheetsService.saveConfig(updated);
  };

  const handleSyncCurrent = async () => {
    if (!playerScore || !questions) {
      setSyncStatus({ type: 'error', message: 'Belum ada data kuis aktif yang dapat dikirim.' });
      return;
    }

    if (!scriptUrl.trim().startsWith('https://script.google.com/')) {
      setSyncStatus({ type: 'error', message: 'Harap masukkan URL Web App Google Apps Script yang valid.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const payload = sheetsService.createSubmissionPayload(playerScore, questions, category);
    const updatedConfig: GoogleSheetsConfig = {
      ...config,
      scriptUrl: scriptUrl.trim(),
    };

    const result = await sheetsService.syncToSheets(payload, updatedConfig);
    setIsSyncing(false);

    if (result.success) {
      setSyncStatus({ type: 'success', message: result.message });
      handleSave();
    } else {
      setSyncStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#180735] border border-white/20 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/70 via-purple-950/60 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                Integrasi Database Google Sheets
              </h3>
              <p className="text-xs text-purple-200/80">
                Penyimpanan nilai, riwayat jawaban, dan akurasi siswa via Google Apps Script Webhook
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

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-3 bg-black/40 border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'setup'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            1. Panduan & URL Web App
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            2. Salin Kode Apps Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            3. Riwayat Lokal ({localHistory.length})
          </button>
        </div>

        {/* Tab 1 */}
        {activeTab === 'setup' && (
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                Langkah Cepat Menghubungkan Google Spreadsheet:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                    1
                  </span>
                  <p className="font-bold text-white text-sm">Buka Spreadsheet</p>
                  <p className="text-purple-200/70 leading-relaxed">
                    Buka Google Sheets, klik menu <strong className="text-white">Ekstensi &gt; Apps Script</strong>.
                  </p>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center">
                    2
                  </span>
                  <p className="font-bold text-white text-sm">Tempel Kode</p>
                  <p className="text-purple-200/70 leading-relaxed">
                    Buka tab 2 di atas, salin kode Apps Script, tempel di editor, lalu simpan.
                  </p>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center">
                    3
                  </span>
                  <p className="font-bold text-white text-sm">Deploy Web App</p>
                  <p className="text-purple-200/70 leading-relaxed">
                    Klik <strong className="text-white">Deploy &gt; Web app</strong>. Pilih Who has access: <strong className="text-emerald-300">Anyone</strong>, lalu salin URL-nya.
                  </p>
                </div>
              </div>
            </div>

            {/* Input URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-200 block uppercase tracking-wider">
                URL Google Apps Script Web App:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scriptUrl}
                  onChange={(e) => setScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Simpan URL
                </button>
              </div>
            </div>

            {syncStatus && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
                syncStatus.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500 text-rose-200'
              }`}>
                {syncStatus.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                <span>{syncStatus.message}</span>
              </div>
            )}

            {playerScore && (
              <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-display font-black text-white text-base">
                    Kirim Nilai Siswa "{playerScore.name}" ke Spreadsheet
                  </p>
                  <p className="text-xs text-purple-200/80">
                    Skor: {playerScore.score} pts • Akurasi: {Math.round((playerScore.correctCount / Math.max(1, questions?.length || 1)) * 100)}%
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSyncCurrent}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm rounded-xl shadow-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSyncing ? 'Mengirim Data...' : 'Kirim Sekarang'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Code */}
        {activeTab === 'code' && (
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-base">Kode Google Apps Script</h4>
                <p className="text-xs text-purple-200/70">Salin dan tempel kode ini di editor Apps Script spreadsheet Anda.</p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode'}</span>
              </button>
            </div>

            <pre className="p-4 bg-black/60 rounded-2xl border border-white/10 text-purple-200 font-mono text-xs overflow-x-auto max-h-72 custom-scrollbar">
              {APPS_SCRIPT_TEMPLATE}
            </pre>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-base">Riwayat Kuis Sesi Ini</h4>
                <p className="text-xs text-purple-200/70">Pencadangan data lokal di peramban.</p>
              </div>
              <button
                type="button"
                onClick={() => sheetsService.exportLocalToCsv()}
                disabled={localHistory.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File CSV (.csv)</span>
              </button>
            </div>

            {localHistory.length === 0 ? (
              <p className="p-8 text-center text-xs text-purple-300/60 bg-black/40 rounded-2xl border border-white/10">
                Belum ada data kuis tersimpan di sesi ini.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {localHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-sm">{rec.studentName}</span>
                      <p className="text-purple-300/70 text-[11px]">{rec.timestamp} • {rec.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-300 text-sm">{rec.totalScore} pts</span>
                      <p className="text-emerald-400 font-semibold text-[11px]">
                        {rec.correctAnswers}/{rec.totalQuestions} ({rec.accuracyPercent}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 bg-black/60 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
