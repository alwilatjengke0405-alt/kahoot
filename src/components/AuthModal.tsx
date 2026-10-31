/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, GraduationCap, School, ShieldCheck, Mail, User, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { AccountRole, UserAccount, authService, DEFAULT_GURU, DEFAULT_MURID } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
  initialRole?: AccountRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  initialRole = 'guru',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<AccountRole>(initialRole);

  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('SMA Negeri 1 Nusantara');
  const [nip, setNip] = useState('');
  const [grade, setGrade] = useState('10.A');
  const [selectedAvatar, setSelectedAvatar] = useState(selectedRole === 'guru' ? '👩‍🏫' : '🎓');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (role: AccountRole) => {
    setSelectedRole(role);
    setSelectedAvatar(role === 'guru' ? '👩‍🏫' : '🎓');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleQuickDemoLogin = (role: AccountRole) => {
    const user = authService.switchDemoAccount(role);
    onUserChanged(user);
    setSuccessMessage(`Berhasil masuk sebagai ${role === 'guru' ? 'Guru' : 'Murid'}: ${user.name}`);
    setTimeout(() => {
      onClose();
      setSuccessMessage(null);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMessage('Harap masukkan alamat email.');
        return;
      }
      const res = authService.login(email, selectedRole);
      if (res.success && res.user) {
        onUserChanged(res.user);
        setSuccessMessage(`Selamat datang kembali, ${res.user.name}!`);
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 700);
      } else {
        setErrorMessage(res.error || 'Gagal masuk. Periksa kembali email Anda.');
      }
    } else {
      // Register
      if (!email.trim() || !name.trim()) {
        setErrorMessage('Email dan Nama Lengkap wajib diisi.');
        return;
      }

      const res = authService.register({
        email,
        name,
        role: selectedRole,
        avatar: selectedAvatar,
        school,
        nip: selectedRole === 'guru' ? nip : undefined,
        grade: selectedRole === 'murid' ? grade : undefined,
      });

      if (res.success && res.user) {
        onUserChanged(res.user);
        setSuccessMessage(`Akun ${selectedRole === 'guru' ? 'Guru' : 'Murid'} berhasil dibuat!`);
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 700);
      } else {
        setErrorMessage(res.error || 'Pendaftaran gagal.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1c0836] via-[#120324] to-[#0a0114] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-white">
                Sistem Akun & Identitas
              </h2>
              <p className="text-xs text-purple-200/70">
                Pemisahan Akun Guru (Host & Nilai) dan Akun Murid (Siswa & Latihan)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Demo Switcher Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Masuk Cepat Demo (1-Klik)</span>
              </span>
              <span className="text-[10px] text-purple-300/60">Tanpa ketik kata sandi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('guru')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  currentUser.role === 'guru'
                    ? 'bg-purple-600/40 border-purple-400 ring-2 ring-purple-400/50'
                    : 'bg-black/40 border-white/10 hover:border-purple-400/40'
                }`}
              >
                <span className="text-2xl">{DEFAULT_GURU.avatar}</span>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-purple-500/40 text-purple-200">
                      Guru
                    </span>
                    <span className="text-xs font-bold text-white truncate">{DEFAULT_GURU.name}</span>
                  </div>
                  <p className="text-[10px] text-purple-300/70 truncate">{DEFAULT_GURU.email}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('murid')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  currentUser.role === 'murid'
                    ? 'bg-emerald-600/40 border-emerald-400 ring-2 ring-emerald-400/50'
                    : 'bg-black/40 border-white/10 hover:border-emerald-400/40'
                }`}
              >
                <span className="text-2xl">{DEFAULT_MURID.avatar}</span>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/40 text-emerald-200">
                      Murid
                    </span>
                    <span className="text-xs font-bold text-white truncate">{DEFAULT_MURID.name}</span>
                  </div>
                  <p className="text-[10px] text-emerald-300/70 truncate">{DEFAULT_MURID.email}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Login vs Register */}
          <div className="flex p-1 rounded-2xl bg-black/50 border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300/80 hover:text-white'
              }`}
            >
              Masuk (Login Email)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300/80 hover:text-white'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Role Choice: Guru vs Murid */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
              Pilih Jenis Akun:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('guru')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedRole === 'guru'
                    ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border-purple-400 ring-2 ring-purple-400/50 shadow-lg'
                    : 'bg-black/30 border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Crown className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="font-display font-black text-white text-sm">Akun Guru</p>
                  <p className="text-[11px] text-purple-200/70">Host Proyektor & Rekap Nilai Siswa</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('murid')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  selectedRole === 'murid'
                    ? 'bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg'
                    : 'bg-black/30 border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <GraduationCap className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-display font-black text-white text-sm">Akun Murid</p>
                  <p className="text-[11px] text-emerald-200/70">Latihan Mandiri & Buku Kesalahan</p>
                </div>
              </button>
            </div>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Alamat Email {selectedRole === 'guru' ? 'Guru' : 'Murid'}:</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'guru' ? 'cth: kartika.guru@gmail.com' : 'cth: ahmad.siswa@gmail.com'}
                className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 placeholder-purple-300/40"
              />
            </div>

            {/* Extra fields for Register */}
            {mode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nama Lengkap:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'guru' ? 'cth: Ibu Kartika Dewi, S.Pd.' : 'cth: Ahmad Rizky Pratama'}
                    className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 placeholder-purple-300/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-purple-400" />
                      <span>Nama Sekolah:</span>
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="SMA Negeri 1"
                      className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 placeholder-purple-300/40"
                    />
                  </div>

                  {selectedRole === 'guru' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-purple-200">
                        NIP (Nomor Induk Pegawai):
                      </label>
                      <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        placeholder="19850315 201001 2 003"
                        className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 placeholder-purple-300/40"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-purple-200">
                        Kelas:
                      </label>
                      <input
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="cth: 10.A atau 10.1"
                        className="w-full px-4 py-3 bg-black/50 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 placeholder-purple-300/40"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Role Rights Summary Box */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1.5">
              <span className="font-bold text-white block">
                Hak Akses {selectedRole === 'guru' ? 'Akun Guru' : 'Akun Murid'}:
              </span>
              <ul className="text-purple-200/80 space-y-1 list-disc list-inside">
                {selectedRole === 'guru' ? (
                  <>
                    <li>Memimpin sesi kuis di Layar Proyektor Kelas (Host)</li>
                    <li>Memantau grafik respons live & ranking siswa per nomor soal</li>
                    <li>Sinkronisasi dan ekspor nilai ke Google Sheets & spreadsheet CSV</li>
                  </>
                ) : (
                  <>
                    <li>Latihan Mandiri privat (bebas gangguan tanpa kode PIN)</li>
                    <li>Menjawab kuis multiplayer di ponsel dengan 4 tombol warna</li>
                    <li>Akses Buku Catatan Kesalahan untuk remedial & penjelasan tenses</li>
                  </>
                )}
              </ul>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-display font-black text-sm text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedRole === 'guru'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              }`}
            >
              <span>{mode === 'login' ? `Masuk sebagai ${selectedRole === 'guru' ? 'Guru' : 'Murid'}` : `Daftar Akun ${selectedRole === 'guru' ? 'Guru' : 'Murid'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
