/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crown, Smartphone, Gamepad2, HelpCircle } from 'lucide-react';
import { UserRole } from '../types/quiz';

interface RoleSwitcherBarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  gamePin: string;
  playerCount: number;
  onOpenGuide: () => void;
  accountRole?: 'guru' | 'murid';
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onChangeRole,
  gamePin,
  playerCount,
  onOpenGuide,
  accountRole,
}) => {
  return (
    <div className="w-full bg-[#0d011c]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Role Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/15 shadow-inner">
          <button
            type="button"
            onClick={() => onChangeRole('host')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              currentRole === 'host'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                : 'text-purple-300 hover:text-white hover:bg-white/10'
            }`}
            title="Tampilkan soal di layar proyektor kelas"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Layar Guru (Host)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('player')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              currentRole === 'player'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/40'
                : 'text-purple-300 hover:text-white hover:bg-white/10'
            }`}
            title="Tampilan menjawab di ponsel siswa"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Layar Siswa (Player)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('solo')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              currentRole === 'solo'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/40'
                : 'text-purple-300 hover:text-white hover:bg-white/10'
            }`}
            title="Latihan privat tanpa tautan ruangan"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Latihan Mandiri (Solo)</span>
          </button>
        </div>

        {/* Right: Info indicator based on Mode */}
        {currentRole === 'solo' ? (
          /* For Solo Practice: No share link, no room PIN, purely private individual mode */
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Latihan Mandiri (Privat · Tanpa Tautan Ruangan)</span>
            </span>
          </div>
        ) : (
          /* For Multiplayer Host / Player: Show PIN and Student count */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-purple-300 uppercase tracking-widest font-semibold">Game PIN:</span>
              <span className="px-3 py-0.5 rounded-lg bg-white text-slate-950 font-mono font-black text-sm tracking-widest shadow-md">
                {gamePin}
              </span>
            </div>

            <span className="text-purple-300/40 hidden sm:inline">|</span>

            <span className="text-[11px] text-purple-200">
              <strong className="text-white font-bold">{playerCount}</strong> Siswa Tergabung
            </span>

            <button
              type="button"
              onClick={onOpenGuide}
              className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-purple-400" />
              <span>Panduan</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
