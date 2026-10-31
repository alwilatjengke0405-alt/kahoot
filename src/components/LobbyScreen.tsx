/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2, VolumeX, Database, Users, BookOpen, Crown, Smartphone, QrCode, HelpCircle, Check, Share2, Layers, Sliders, Gamepad2 } from 'lucide-react';
import { DifficultyLevel, QuestionCategory, QuizSettings, UserRole } from '../types/quiz';
import { AccountRole } from '../services/authService';

interface LobbyScreenProps {
  onStartGame: (nickname: string, avatar: string, settings: QuizSettings) => void;
  onOpenSheetsModal: () => void;
  onOpenGuideModal: () => void;
  isSheetsConnected: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  accountRole?: AccountRole;
  accountName?: string;
  accountAvatar?: string;
  initialRole?: UserRole;
  onSwitchToPlayerMode?: () => void;
}

const AVATARS = ['🎓', '👩‍🏫', '🚀', '🦊', '🦁', '⚡', '🌟', '🦉', '👑', '🎯', '🦄', '🎒'];

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartGame,
  onOpenSheetsModal,
  onOpenGuideModal,
  isSheetsConnected,
  soundEnabled,
  onToggleSound,
  accountRole = 'guru',
  accountName = 'Ibu Kartika Dewi, S.Pd.',
  accountAvatar = '👩‍🏫',
  initialRole = 'host',
  onSwitchToPlayerMode,
}) => {
  const [nickname, setNickname] = useState(accountName);
  const [selectedAvatar, setSelectedAvatar] = useState(accountAvatar);
  const [selectedCategory, setSelectedCategory] = useState<'all' | QuestionCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [enableBots, setEnableBots] = useState(true);
  const [gamePin] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with account profile if changed
  useEffect(() => {
    if (accountName) setNickname(accountName);
    if (accountAvatar) setSelectedAvatar(accountAvatar);
  }, [accountName, accountAvatar]);

  // Adjust default role based on account
  useEffect(() => {
    if (initialRole) {
      setUserRole(initialRole);
    }
  }, [initialRole]);

  const categories = [
    {
      id: 'all',
      name: 'Semua Materi (Recount + Leaders)',
      subtitle: 'Kombinasi lengkap struktur recount dan pengenalan tokoh warga',
      icon: <Sparkles className="w-5 h-5 text-purple-300" />,
      badge: 'Materi Komprehensif',
      accent: 'from-purple-900/60 to-indigo-950/60 border-purple-500/50 hover:border-purple-400',
    },
    {
      id: 'recount',
      name: '1. Recount Text',
      subtitle: 'Generic Structure, Language Features & Functions, Connectives',
      icon: <BookOpen className="w-5 h-5 text-rose-300" />,
      badge: 'Past Tense & Kronologi',
      accent: 'from-rose-950/50 to-slate-900/50 border-rose-500/50 hover:border-rose-400',
    },
    {
      id: 'community_leaders',
      name: '2. Community Leaders',
      subtitle: 'Self Introduction, Introducing Others, Roles & Protocol',
      icon: <Crown className="w-5 h-5 text-amber-300" />,
      badge: 'Tokoh & Kepemimpinan',
      accent: 'from-amber-950/50 to-slate-900/50 border-amber-500/50 hover:border-amber-400',
    },
  ];

  const difficulties: { id: 'all' | DifficultyLevel; label: string; desc: string; color: string }[] = [
    { id: 'all', label: 'Semua Level', desc: 'Campuran bertahap', color: 'border-purple-500/50 bg-purple-950/30 text-purple-200' },
    { id: 'Easy', label: 'Easy (Mudah)', desc: 'Konsep dasar & kosa kata', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' },
    { id: 'Normal', label: 'Normal (Sedang)', desc: 'Tenses & situasi nyata', color: 'border-blue-500/50 bg-blue-950/30 text-blue-300' },
    { id: 'Hard', label: 'Hard (Sulit)', desc: 'Diplomasi & tenses bertumpuk', color: 'border-amber-500/50 bg-amber-950/30 text-amber-300' },
    { id: 'Expert', label: 'Expert (Ahli)', desc: 'Inversi, sumpah & retorika', color: 'border-rose-500/50 bg-rose-950/30 text-rose-300' },
  ];

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?pin=${gamePin}`
      : `https://kahootenglish.app/?pin=${gamePin}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nickname.trim() || (accountRole === 'guru' ? 'Guru Pengampu' : 'Siswa Belajar');
    onStartGame(finalName, selectedAvatar, {
      selectedCategory,
      difficultyFilter,
      questionCount,
      timerMultiplier: 1.0,
      enableBots: userRole === 'player' ? true : enableBots,
      botCount: 4,
      soundEnabled,
      gamePin,
      userRole,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-fadeIn pb-14">
      {/* 
        CONDITIONAL TOP BANNER:
        - If 'host': show Game PIN and shareable link for students
        - If 'solo': COMPLETELY HIDE the share link & PIN as requested by user! Show private solo practice banner.
        - If 'player': show student prompt
      */}
      {userRole === 'solo' ? (
        /* SOL0 PRACTICE MODE BANNER (NO LINK, NO PIN) */
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-purple-950/70 to-slate-900/90 border border-indigo-400/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 p-2.5 flex items-center justify-center shadow-lg flex-shrink-0 text-indigo-300">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider">
                  Sesi Belajar Privat
                </span>
                <span className="text-xs text-indigo-300/80">Tanpa Tautan / Tanpa PIN</span>
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight mt-1">
                Mode Latihan Mandiri (Solo)
              </h2>
              <p className="text-xs text-indigo-200/80 mt-0.5 max-w-md">
                Latihan personal mandiri langsung dari browser. Semua analisis jawaban salah dan contoh kalimat benar akan ditampilkan setelah menjawab.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            <button
              type="button"
              onClick={onOpenSheetsModal}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSheetsConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSheetsConnected ? 'Sheets Aktif' : 'Simpan Nilai'}</span>
            </button>
          </div>
        </div>
      ) : userRole === 'host' ? (
        /* HOST PROJECTOR BANNER (WITH GAME PIN & SHARE LINK) */
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-black/40 to-indigo-950/80 border border-purple-400/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg flex-shrink-0">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-purple-300 uppercase tracking-widest block">
                Kode PIN Ruangan Guru:
              </span>
              <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-widest drop-shadow-md">
                {gamePin}
              </div>
              <p className="text-[11px] text-purple-200/70">
                Siswa membuka browser di HP dan mengetik PIN di atas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 font-bold text-xs border border-purple-400/40 cursor-pointer transition-all shadow-md"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tautan Tersalin!' : 'Salin Tautan Join'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenGuideModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 border border-white/15 font-bold text-xs cursor-pointer transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
              <span>Aturan Host & Player</span>
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            <button
              type="button"
              onClick={onOpenSheetsModal}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSheetsConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSheetsConnected ? 'Sheets Terhubung' : 'Google Sheets'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* PLAYER BANNER */
        <div className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display font-black text-white text-base">Mode Layar Siswa (Player Controller)</p>
              <p className="text-xs text-emerald-200/80">Masukkan Game PIN yang diberikan Guru untuk bergabung ke kuis kelas.</p>
            </div>
          </div>
          {onSwitchToPlayerMode && (
            <button
              type="button"
              onClick={onSwitchToPlayerMode}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer transition-all"
            >
              Buka Layar Masuk PIN
            </button>
          )}
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleLaunch}
        className="rounded-3xl p-6 sm:p-9 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center space-y-1.5">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Arena Kuis Bahasa Inggris 3D
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto">
            {userRole === 'solo'
              ? 'Latihan mandiri personal: tentukan jumlah soal (1–25) dan tingkat kesulitan untuk menguji pemahaman Anda.'
              : userRole === 'host'
              ? 'Sesi proyektor kelas: murid bergabung dengan PIN atau tautan, pantau peringkat murid secara real-time.'
              : 'Pilih peran dan persiapan kuis bahasa Inggris interaktif.'}
          </p>
        </div>

        {/* Role Selector: 3 Explicit Options (Host vs Player vs Solo) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
              Pilih Mode / Peran:
            </label>
            <span className="text-[11px] text-purple-300/70">
              Akun Anda: <strong className="text-white">{accountRole === 'guru' ? 'Guru' : 'Murid'}</strong> ({accountName})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Host (Layar Guru) */}
            <button
              type="button"
              onClick={() => setUserRole('host')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                userRole === 'host'
                  ? 'bg-purple-600/40 border-purple-400 ring-2 ring-purple-400/50 shadow-xl'
                  : 'bg-black/40 border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  <Crown className="w-4 h-4 text-amber-300" />
                </div>
                {userRole === 'host' && <Check className="w-4 h-4 text-purple-300 stroke-[3]" />}
              </div>
              <div>
                <p className="font-display font-black text-white text-sm">Host (Layar Guru)</p>
                <p className="text-[11px] text-purple-200/70 mt-0.5 leading-snug">
                  Tampilkan kuis di proyektor, bagikan PIN / tautan join murid.
                </p>
              </div>
            </button>

            {/* 2. Player (Layar Siswa) */}
            <button
              type="button"
              onClick={() => {
                setUserRole('player');
                if (onSwitchToPlayerMode) onSwitchToPlayerMode();
              }}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                userRole === 'player'
                  ? 'bg-emerald-600/40 border-emerald-400 ring-2 ring-emerald-400/50 shadow-xl'
                  : 'bg-black/40 border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Smartphone className="w-4 h-4 text-emerald-300" />
                </div>
                {userRole === 'player' && <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />}
              </div>
              <div>
                <p className="font-display font-black text-white text-sm">Player (Siswa HP)</p>
                <p className="text-[11px] text-purple-200/70 mt-0.5 leading-snug">
                  Menjawab di ponsel dengan 4 tombol warna & join via PIN.
                </p>
              </div>
            </button>

            {/* 3. Solo (Latihan Mandiri - Tanpa Tautan) */}
            <button
              type="button"
              onClick={() => setUserRole('solo')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                userRole === 'solo'
                  ? 'bg-indigo-600/40 border-indigo-400 ring-2 ring-indigo-400/50 shadow-xl'
                  : 'bg-black/40 border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Gamepad2 className="w-4 h-4 text-indigo-300" />
                </div>
                {userRole === 'solo' && <Check className="w-4 h-4 text-indigo-300 stroke-[3]" />}
              </div>
              <div>
                <p className="font-display font-black text-white text-sm">Latihan Mandiri</p>
                <p className="text-[11px] text-indigo-200/70 mt-0.5 leading-snug">
                  Privat untuk siswa: tanpa kode ruangan atau tautan bersama.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Question Count Selector (1-25) */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Jumlah Soal Kuis (1 – 25 Soal):</span>
            </label>
            <span className="px-3.5 py-1 bg-purple-500/30 text-purple-200 font-mono font-black text-base rounded-xl border border-purple-400/40">
              {questionCount} Soal
            </span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full h-2.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-purple-300/70 mr-1">Preset Cepat:</span>
            {[5, 10, 15, 20, 25].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  questionCount === count
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-purple-200 border border-white/10'
                }`}
              >
                {count} Soal
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Pilih Tingkat Kesulitan (Difficulty Level):</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {difficulties.map((diff) => {
              const isSelected = difficultyFilter === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficultyFilter(diff.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${diff.color} ${
                    isSelected
                      ? 'ring-2 ring-white shadow-xl scale-[1.02] font-black'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{diff.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{diff.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Identitas Peserta / Guru */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
            Identitas Tampil di Permainan:
          </label>
          <div className="flex gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
              {selectedAvatar}
            </div>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ketik nama tampilan..."
              className="flex-1 px-5 py-3.5 bg-black/40 border border-white/15 rounded-2xl text-white font-extrabold text-base focus:outline-none focus:border-purple-400 placeholder-purple-300/40 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-purple-300/70 mr-1">Avatar:</span>
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setSelectedAvatar(av)}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedAvatar === av
                    ? 'bg-purple-600 ring-2 ring-white scale-110 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 border border-white/5'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Curriculum Category Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block">
            Pilih Modul Pembelajaran:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer bg-gradient-to-br ${cat.accent} ${
                    isSelected
                      ? 'ring-2 ring-white shadow-xl scale-[1.01]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        {cat.icon}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    </div>
                    <p className="font-display font-extrabold text-white text-base leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-xs text-purple-200/70 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-purple-300/80 pt-2 border-t border-white/10">
                    {cat.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bot Toggle (Only shown when relevant) */}
        {userRole !== 'solo' ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm sm:text-base">
                  Simulasi Teman Sekelas (AI Classmates)
                </p>
                <p className="text-xs text-purple-200/70">
                  Sertakan bot siswa di papan klasemen untuk menambah persaingan seru
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={enableBots}
                onChange={(e) => setEnableBots(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-400/30 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <p className="text-xs text-indigo-200/80">
              <strong>Latihan Mandiri:</strong> Sesi murni individual tanpa bot dan tanpa tautan bersama. Anda dapat fokus menjawab dan meneliti setiap penjelasan materi.
            </p>
          </div>
        )}

        {/* Launch Button */}
        <button
          type="submit"
          className="w-full py-4.5 sm:py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-display font-black text-xl rounded-2xl border-b-4 border-emerald-900 shadow-2xl shadow-emerald-950/60 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>
            {userRole === 'host'
              ? 'Mulai Sesi Host di Proyektor'
              : userRole === 'solo'
              ? 'Mulai Latihan Mandiri Sekarang'
              : 'Mulai Menjawab Kuis'} ({questionCount} Soal · {difficultyFilter === 'all' ? 'Semua Level' : difficultyFilter})
          </span>
        </button>
      </form>
    </div>
  );
};
