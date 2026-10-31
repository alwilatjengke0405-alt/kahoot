/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Crown, GraduationCap, Mail, User, School, Sparkles, ArrowRight, ShieldCheck, Gamepad2, Smartphone, Check, BookOpen, AlertCircle } from 'lucide-react';
import { AccountRole, UserAccount, authService, DEFAULT_GURU, DEFAULT_MURID } from '../services/authService';
import { UserRole } from '../types/quiz';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount, targetUserRole: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<AccountRole>('guru');
  const [studentModeChoice, setStudentModeChoice] = useState<'solo' | 'player'>('solo');

  // Fields for Guru
  const [guruEmail, setGuruEmail] = useState(DEFAULT_GURU.email);
  const [guruName, setGuruName] = useState(DEFAULT_GURU.name);
  const [guruNip, setGuruNip] = useState(DEFAULT_GURU.nip || '19850315 201001 2 003');
  const [guruSchool, setGuruSchool] = useState(DEFAULT_GURU.school);

  // Fields for Murid (Hanya Sekolah, Email Siswa, Nama Siswa, dan Kelas)
  const [muridEmail, setMuridEmail] = useState(DEFAULT_MURID.email);
  const [muridName, setMuridName] = useState(DEFAULT_MURID.name);
  const [muridGrade, setMuridGrade] = useState(DEFAULT_MURID.grade || '10.A');
  const [muridSchool, setMuridSchool] = useState(DEFAULT_MURID.school);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuickDemoGuru = () => {
    const user = authService.switchDemoAccount('guru');
    onLoginSuccess(user, 'host');
  };

  const handleQuickDemoMurid = (mode: 'solo' | 'player') => {
    const user = authService.switchDemoAccount('murid');
    onLoginSuccess(user, mode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedRole === 'guru') {
      if (!guruEmail.trim() || !guruName.trim()) {
        setErrorMessage('Harap isi alamat email dan nama guru.');
        return;
      }
      const existing = authService.getAllAccounts().find(
        a => a.email.toLowerCase() === guruEmail.trim().toLowerCase() && a.role === 'guru'
      );
      if (existing) {
        authService.setCurrentUser(existing);
        onLoginSuccess(existing, 'host');
      } else {
        const res = authService.register({
          email: guruEmail,
          name: guruName,
          role: 'guru',
          school: guruSchool,
          nip: guruNip,
          avatar: '👩‍🏫',
          subject: 'Bahasa Inggris',
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user, 'host');
        } else {
          setErrorMessage(res.error || 'Gagal masuk akun guru.');
        }
      }
    } else {
      // Murid
      if (!muridEmail.trim() || !muridName.trim()) {
        setErrorMessage('Harap isi alamat email dan nama siswa.');
        return;
      }
      const existing = authService.getAllAccounts().find(
        a => a.email.toLowerCase() === muridEmail.trim().toLowerCase() && a.role === 'murid'
      );
      if (existing) {
        authService.setCurrentUser(existing);
        onLoginSuccess(existing, studentModeChoice);
      } else {
        const res = authService.register({
          email: muridEmail,
          name: muridName,
          role: 'murid',
          school: muridSchool,
          grade: muridGrade,
          avatar: '🎓',
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user, studentModeChoice);
        } else {
          setErrorMessage(res.error || 'Gagal masuk akun murid.');
        }
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 animate-fadeIn py-8 px-4 sm:px-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Portal Masuk Pembelajaran Interaktif</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-200 tracking-tight drop-shadow-lg">
          KahootEnglish<span className="text-purple-400">3D</span>
        </h1>

        <p className="text-sm sm:text-base text-purple-200/80 max-w-lg mx-auto leading-relaxed">
          Media Evaluasi Interaktif Bahasa Inggris SMA
          <span className="block text-xs text-purple-300/60 mt-1 font-medium">
            Materi: Recount Text & Community Leaders · Audio Listening & Speaking
          </span>
        </p>
      </div>

      {/* Main Glassmorphic Login Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#18062e]/95 via-[#110322]/95 to-[#090113]/98 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(147,51,234,0.3)] space-y-8">
        {/* Glow ambient accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Step 1: Role Picker (Host/Guru vs Murid/Player) */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200">
              1. Pilih Peran Anda:
            </span>
            <span className="text-[11px] text-purple-300/60">Klik kartu di bawah</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPTION 1: HOST / GURU */}
            <button
              type="button"
              onClick={() => { setSelectedRole('guru'); setErrorMessage(null); }}
              className={`group p-6 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                selectedRole === 'guru'
                  ? 'bg-gradient-to-br from-purple-900/90 via-purple-950/90 to-[#130325]/95 border-purple-400 ring-2 ring-purple-400/60 shadow-[0_10px_30px_rgba(147,51,234,0.35)] scale-[1.01]'
                  : 'bg-black/40 border-white/10 opacity-75 hover:opacity-100 hover:border-white/20 hover:bg-black/60'
              }`}
            >
              {selectedRole === 'guru' && (
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Aktif</span>
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-amber-500/20 text-purple-200 border border-purple-400/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  👑
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-xl">
                    Host / Guru
                  </h3>
                  <p className="text-xs text-purple-300/90 font-medium">Pendidik & Pembawa Acara</p>
                </div>
              </div>

              <p className="text-xs text-purple-200/80 leading-relaxed border-t border-white/10 pt-3.5">
                Kendali kuis di <strong>layar proyektor kelas</strong>, pantau klasemen siswa secara real-time, putar audio ke speaker kelas, dan rekap otomatis ke Google Sheets.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-purple-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Layar Proyektor · Rekap Nilai</span>
              </div>
            </button>

            {/* OPTION 2: MURID / PLAYER */}
            <button
              type="button"
              onClick={() => { setSelectedRole('murid'); setErrorMessage(null); }}
              className={`group p-6 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                selectedRole === 'murid'
                  ? 'bg-gradient-to-br from-emerald-950/90 via-teal-950/90 to-[#021f18]/95 border-emerald-400 ring-2 ring-emerald-400/60 shadow-[0_10px_30px_rgba(16,185,129,0.35)] scale-[1.01]'
                  : 'bg-black/40 border-white/10 opacity-75 hover:opacity-100 hover:border-white/20 hover:bg-black/60'
              }`}
            >
              {selectedRole === 'murid' && (
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Aktif</span>
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-cyan-500/20 text-emerald-200 border border-emerald-400/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  🎓
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-xl">
                    Murid / Player
                  </h3>
                  <p className="text-xs text-emerald-300/90 font-medium">Siswa & Peserta Kuis</p>
                </div>
              </div>

              <p className="text-xs text-purple-200/80 leading-relaxed border-t border-white/10 pt-3.5">
                Pilih antara <strong>Latihan Mandiri (privat tanpa PIN)</strong> atau bergabung ke kuis kelas guru dengan memasukkan Game PIN dari proyektor.
              </p>

              <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Latihan Mandiri · Kontroler Siswa</span>
              </div>
            </button>
          </div>
        </div>

        {/* 1-Click Fast Demo Shortcuts */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="text-xs text-purple-200/90 font-medium">
              Akses cepat demo tanpa mengetik:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleQuickDemoGuru}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600/70 border border-purple-400/40 text-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>👑 Demo Host (kartika.dewi@gmail.com)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoMurid('solo')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/70 border border-emerald-400/40 text-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>🎓 Demo Siswa (ahmad.rizky@gmail.com)</span>
            </button>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs based on selected role */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-t border-white/10 pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200">
                2. Data Masuk Akun {selectedRole === 'guru' ? 'Host / Guru' : 'Murid / Player'}:
              </span>
              <span className="text-[11px] text-purple-300/60 font-mono">
                Tersimpan di browser
              </span>
            </div>

            {selectedRole === 'guru' ? (
              /* GURU / HOST FIELDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span>Email Biasa Guru (Host):</span>
                    </label>
                    <span className="text-[10px] text-purple-300/70 font-mono">bebas domain</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={guruEmail}
                    onChange={(e) => setGuruEmail(e.target.value)}
                    placeholder="kartika.dewi@gmail.com"
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 placeholder-purple-300/40 shadow-inner transition-all"
                  />
                  <p className="text-[10px] text-purple-300/60">Gunakan email biasa (contoh @gmail.com atau @yahoo.com)</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nama Guru Lengkap:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guruName}
                    onChange={(e) => setGuruName(e.target.value)}
                    placeholder="Ibu Kartika Dewi, S.Pd."
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 placeholder-purple-300/40 shadow-inner transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sekolah:</span>
                  </label>
                  <input
                    type="text"
                    value={guruSchool}
                    onChange={(e) => setGuruSchool(e.target.value)}
                    placeholder="SMA Negeri 1 Nusantara"
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 placeholder-purple-300/40 shadow-inner transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>NIP (Nomor Induk Pegawai):</span>
                  </label>
                  <input
                    type="text"
                    value={guruNip}
                    onChange={(e) => setGuruNip(e.target.value)}
                    placeholder="19850315 201001 2 003"
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 placeholder-purple-300/40 shadow-inner transition-all"
                  />
                </div>
              </div>
            ) : (
              /* MURID / PLAYER FIELDS (HANYA SEKOLAH, EMAIL, NAMA, DAN KELAS - TANPA NIS) */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Email Biasa Siswa (Player):</span>
                      </label>
                      <span className="text-[10px] text-emerald-300/70 font-mono">bebas domain</span>
                    </div>
                    <input
                      type="email"
                      required
                      value={muridEmail}
                      onChange={(e) => setMuridEmail(e.target.value)}
                      placeholder="ahmad.rizky@gmail.com"
                      className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-emerald-300/40 shadow-inner transition-all"
                    />
                    <p className="text-[10px] text-emerald-300/60">Gunakan email biasa (contoh @gmail.com atau @yahoo.com)</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Nama Siswa:</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={muridName}
                      onChange={(e) => setMuridName(e.target.value)}
                      placeholder="Ahmad Rizky Pratama"
                      className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-emerald-300/40 shadow-inner transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sekolah:</span>
                    </label>
                    <input
                      type="text"
                      value={muridSchool}
                      onChange={(e) => setMuridSchool(e.target.value)}
                      placeholder="SMA Negeri 1 Nusantara"
                      className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-emerald-300/40 shadow-inner transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kelas:</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={muridGrade}
                      onChange={(e) => setMuridGrade(e.target.value)}
                      placeholder="cth: 10.A atau 10.1"
                      className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-emerald-300/40 shadow-inner transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Sub-choice for Student: Solo vs Room */}
                <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 block">
                      Pilihan Mode Belajar Siswa:
                    </label>
                    <span className="text-[10px] text-emerald-300/70">Bisa diubah kapan saja</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStudentModeChoice('solo')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        studentModeChoice === 'solo'
                          ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400/50 shadow-md'
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/10'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white text-xs">Latihan Mandiri (Solo)</p>
                        <p className="text-[11px] text-purple-200/70 mt-0.5">Privat tanpa PIN dan tanpa tautan ruangan</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentModeChoice('player')}
                      className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        studentModeChoice === 'player'
                          ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/50 shadow-md'
                          : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white text-xs">Join Sesi Guru (Player)</p>
                        <p className="text-[11px] text-emerald-200/70 mt-0.5">Masukkan PIN proyektor kelas di ponsel</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Submit Button with 3D Tactile Depression */}
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl font-display font-black text-base text-white transition-all cursor-pointer flex items-center justify-center gap-3 active:translate-y-1 shadow-xl ${
              selectedRole === 'guru'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 border-b-4 border-purple-900 shadow-purple-950/60'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 border-b-4 border-emerald-900 shadow-emerald-950/60'
            }`}
          >
            <span>
              {selectedRole === 'guru'
                ? 'Masuk sebagai Host / Guru (Layar Proyektor) >'
                : studentModeChoice === 'solo'
                ? 'Masuk sebagai Murid (Mulai Latihan Mandiri) >'
                : 'Masuk sebagai Murid (Buka Layar Masuk PIN) >'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Role explanation footers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-purple-200/70">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
          <Crown className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold mb-0.5">Peran Guru (Host Proyektor):</strong>
            Gunakan laptop kelas yang terhubung proyektor. Kendalikan laju soal, tampilkan timer 3D, putar audio kelas, dan simpan nilai ke Google Sheets.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
          <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold mb-0.5">Peran Siswa (Player & Solo):</strong>
            Latihan mandiri berjalan tanpa tautan/PIN. Pada sesi kelas langsung, ubah ponsel menjadi kontroler kuis berkecepatan tinggi dengan 4 tombol geometris.
          </div>
        </div>
      </div>
    </div>
  );
};
