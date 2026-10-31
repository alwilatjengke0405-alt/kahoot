/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Crown, GraduationCap, School, Mail, Award, Target, Flame, LogOut, ArrowRightLeft } from 'lucide-react';
import { UserAccount } from '../services/authService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onSwitchAccount: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSwitchAccount,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isGuru = user.role === 'guru';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a0733] to-[#0e0220] border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isGuru
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
            }`}>
              {isGuru ? <Crown className="w-3.5 h-3.5 text-amber-300" /> : <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />}
              <span>{isGuru ? 'Profil Guru / Host' : 'Profil Siswa / Murid'}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.05] border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
            {user.avatar}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-display font-black text-white text-lg truncate">
              {user.name}
            </h3>
            <p className="text-xs text-purple-200/80 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 flex-shrink-0 text-purple-400" />
              <span>{user.email}</span>
            </p>
            <p className="text-xs text-purple-300/60 flex items-center gap-1 mt-0.5 truncate">
              <School className="w-3 h-3 flex-shrink-0 text-purple-400" />
              <span>{user.school}</span>
            </p>
          </div>
        </div>

        {/* Details based on Role */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {isGuru ? (
            <>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-purple-300/60 block">NIP</span>
                <span className="font-mono font-bold text-white text-xs">{user.nip || '19850315...'}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-purple-300/60 block">Mata Pelajaran</span>
                <span className="font-bold text-white text-xs truncate block">{user.subject || 'Bahasa Inggris'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-emerald-300/80 block">Kelas</span>
                <span className="font-bold text-white text-xs">{user.grade || '10.A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] uppercase font-bold text-emerald-300/80 block">Sekolah</span>
                <span className="font-bold text-white text-xs truncate block">{user.school || 'SMA Negeri 1'}</span>
              </div>
            </>
          )}
        </div>

        {/* Learning & Quiz Statistics */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200 block">
            Statistik Aktivitas Kuis:
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-center text-purple-400 mb-1">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-mono font-black text-white text-base block">{user.stats.highScore.toLocaleString()}</span>
              <span className="text-[10px] text-purple-300/70">Skor Tertinggi</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <Target className="w-4 h-4" />
              </div>
              <span className="font-mono font-black text-white text-base block">{user.stats.accuracy}%</span>
              <span className="text-[10px] text-purple-300/70">Akurasi</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-center text-amber-400 mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-mono font-black text-white text-base block">{user.stats.sessionsCount}</span>
              <span className="text-[10px] text-purple-300/70">Sesi Kuis</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchAccount();
            }}
            className="w-full py-3 px-4 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 text-purple-100 border border-purple-400/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-purple-300" />
            <span>Ganti Akun / Beralih Peran (Guru ↔ Murid)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-rose-300 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
