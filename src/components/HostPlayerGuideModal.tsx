import React, { useState } from 'react';
import { X, Users, Crown, Smartphone, QrCode, Share2, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';

interface HostPlayerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamePin: string;
}

export const HostPlayerGuideModal: React.FC<HostPlayerGuideModalProps> = ({
  isOpen,
  onClose,
  gamePin,
}) => {
  const [activeTab, setActiveTab] = useState<'how_to_join' | 'host_rules' | 'player_rules'>('how_to_join');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?pin=${gamePin}`
    : `https://kahootenglish.app/?pin=${gamePin}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#180735] border border-white/20 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                Panduan Bermain: Cara Join, Aturan Host & Player
              </h3>
              <p className="text-xs text-purple-200/80">
                Instruksi lengkap menyelenggarakan kuis interaktif di kelas dan cara siswa bergabung
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
            onClick={() => setActiveTab('how_to_join')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'how_to_join'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            1. Cara Orang Lain Join Room
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('host_rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'host_rules'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            2. Aturan untuk Host (Guru)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('player_rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'player_rules'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            3. Aturan untuk Player (Siswa)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-sm text-slate-100">
          {/* TAB 1: How Others Join */}
          {activeTab === 'how_to_join' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-1">
                    Game PIN Ruang Kelas Anda:
                  </span>
                  <span className="font-mono font-black text-3xl sm:text-4xl text-white tracking-widest drop-shadow">
                    {gamePin}
                  </span>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Bagikan PIN ini kepada seluruh siswa di kelas atau ruang pertemuan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-slate-900 font-display font-black text-xs sm:text-sm rounded-xl shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Share2 className="w-4 h-4 text-purple-700" />}
                  <span>{copiedLink ? 'Tautan Tersalin!' : 'Salin Tautan Join Cepat'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-display font-bold text-white text-base">Buka Web di HP</h4>
                  <p className="text-xs text-purple-200/75 leading-relaxed">
                    Siswa membuka link aplikasi ini di browser ponsel pintar (Chrome, Safari, Edge) masing-masing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-display font-bold text-white text-base">Ketik PIN & Nama</h4>
                  <p className="text-xs text-purple-200/75 leading-relaxed">
                    Siswa memasukkan 6 digit Game PIN <span className="font-mono font-bold text-amber-300">({gamePin})</span>, mengetik nama panggilan, dan memilih avatar favorit.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-display font-bold text-white text-base">Siap di Lobi Live</h4>
                  <p className="text-xs text-purple-200/75 leading-relaxed">
                    Nama siswa akan langsung muncul di layar proyektor Host. Kuis akan dimulai saat Host menekan tombol Mulai!
                  </p>
                </div>
              </div>

              {/* QR Code Simulation Card */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h5 className="font-display font-bold text-white text-base">Dukungan Pindai Barcode / QR Code</h5>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Di layar proyektor Host, siswa cukup mengarahkan kamera HP ke QR Code untuk langsung terhubung tanpa perlu mengetik ulang PIN secara manual.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Host Rules */}
          {activeTab === 'host_rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-white text-base">Peran Host (Guru / Pemimpin Acara)</h4>
                  <p className="text-xs text-amber-200/80">
                    Host adalah pengatur jalannya permainan di layar utama kelas/proyektor (*Big Screen*).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1. Menampilkan PIN & Menunggu Siswa di Lobi</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Host memproyeksikan layar ke infokus atau share screen Zoom/Google Meet. Host memastikan seluruh siswa sudah masuk ke ruang lobi sebelum menekan Mulai.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>2. Mengontrol Waktu & Memutar Audio Soal</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Untuk soal *Listening* dan *Speaking*, Host dapat memutar rekaman suara penutur asli agar terdengar jelas melalui speaker kelas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>3. Menjelaskan Mengapa Siswa Salah (Pedagogical Reflection)</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Setelah waktu habis, Host dapat mengklik tombol "Buka Penjelasan" untuk membedah kesalahan umum siswa, rumus kalimat, dan contoh kalimat yang tepat.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>4. Sinkronisasi Otomatis ke Google Sheets</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Di akhir kuis, rekap nilai siswa, rincian jawaban per soal, dan akurasi akan otomatis tersimpan ke spreadsheet Google Sheets milik Host.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Player Rules */}
          {activeTab === 'player_rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-white text-base">Aturan untuk Player (Siswa / Peserta)</h4>
                  <p className="text-xs text-emerald-200/80">
                    Siswa menjawab kuis lewat perangkat HP masing-masing menggunakan 4 tombol bentuk warna khas Kahoot.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <span className="font-mono font-bold text-amber-400">⚡</span>
                    <span>1. Sistem Skor Kecepatan (Speed Points)</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Setiap soal bernilai maksimal <strong className="text-white">1.000 Poin</strong>. Menjawab dalam 2 detik pertama menghasilkan poin tertinggi (900-1000 poin). Semakin lambat Anda menjawab, poin berkurang proporsional.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <span className="font-mono font-bold text-orange-400">🔥</span>
                    <span>2. Bonus Combo Berturut-turut (Streak Multiplier)</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Menjawab benar berturut-turut memberikan bonus kombo ekstra (+100 poin untuk streak 2, +200 poin untuk streak 3, dan seterusnya). Jika sekali salah, streak kembali ke 0.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <span className="font-mono font-bold text-indigo-400">📖</span>
                    <span>3. Buku Catatan Kesalahan & Uji Ulang (Mistake Notebook)</span>
                  </div>
                  <p className="text-xs text-purple-200/75 pl-6 leading-relaxed">
                    Setelah kuis berakhir, siswa dapat membuka *Buku Catatan Kesalahan* untuk membaca alasan mengapa mereka keliru, mendengarkan contoh kalimat penutur asli, dan melakukan tes ulang langsung (*instant retest*).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-black/60 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-purple-300/70">
            Sistem kuis mendukung layar sentuh HP dan proyektor komputer.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-sm rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
