/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AccountRole = 'guru' | 'murid';

export interface UserStats {
  sessionsCount: number;
  highScore: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  accuracy: number;
  lastActive: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  avatar: string;
  school: string;
  nip?: string;     // Khusus Guru (Nomor Induk Pegawai)
  subject?: string; // Khusus Guru (Mata Pelajaran)
  nis?: string;     // Khusus Murid (Nomor Induk Siswa)
  grade?: string;   // Khusus Murid (Kelas, cth: 8-A)
  createdAt: string;
  stats: UserStats;
}

const STORAGE_KEY_CURRENT = 'kahoot_english_active_user';
const STORAGE_KEY_ACCOUNTS = 'kahoot_english_all_accounts';

export const DEFAULT_GURU: UserAccount = {
  id: 'teacher-kartika-1',
  email: 'kartika.dewi@gmail.com',
  name: 'Ibu Kartika Dewi, S.Pd.',
  role: 'guru',
  avatar: '👩‍🏫',
  school: 'SMA Negeri 1 Nusantara',
  nip: '19850315 201001 2 003',
  subject: 'Bahasa Inggris (Recount & Community Leaders)',
  createdAt: '2025-01-10T08:00:00Z',
  stats: {
    sessionsCount: 18,
    highScore: 12500,
    totalQuestionsAnswered: 180,
    correctAnswersCount: 172,
    accuracy: 95.5,
    lastActive: new Date().toISOString(),
  },
};

export const DEFAULT_MURID: UserAccount = {
  id: 'student-rizky-1',
  email: 'ahmad.rizky@gmail.com',
  name: 'Ahmad Rizky Pratama',
  role: 'murid',
  avatar: '🎓',
  school: 'SMA Negeri 1 Nusantara',
  grade: '10.A',
  createdAt: '2025-02-01T09:30:00Z',
  stats: {
    sessionsCount: 12,
    highScore: 9800,
    totalQuestionsAnswered: 120,
    correctAnswersCount: 98,
    accuracy: 81.6,
    lastActive: new Date().toISOString(),
  },
};

export const SECONDARY_MURID: UserAccount = {
  id: 'student-siti-2',
  email: 'siti.aminah@gmail.com',
  name: 'Siti Aminah',
  role: 'murid',
  avatar: '🌟',
  school: 'SMA Negeri 1 Nusantara',
  grade: '10.1',
  createdAt: '2025-02-05T10:15:00Z',
  stats: {
    sessionsCount: 8,
    highScore: 8900,
    totalQuestionsAnswered: 80,
    correctAnswersCount: 68,
    accuracy: 85.0,
    lastActive: new Date().toISOString(),
  },
};

class AuthService {
  private currentUser: UserAccount;
  private accounts: UserAccount[];

  constructor() {
    this.accounts = this.loadAccounts();
    this.currentUser = this.loadCurrentUser();
  }

  private loadAccounts(): UserAccount[] {
    if (typeof window === 'undefined') return [DEFAULT_GURU, DEFAULT_MURID, SECONDARY_MURID];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    const initial = [DEFAULT_GURU, DEFAULT_MURID, SECONDARY_MURID];
    this.saveAccounts(initial);
    return initial;
  }

  private saveAccounts(accounts: UserAccount[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // ignore
    }
  }

  private loadCurrentUser(): UserAccount {
    if (typeof window === 'undefined') return DEFAULT_GURU;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.role) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_GURU;
  }

  public getCurrentUser(): UserAccount {
    return this.currentUser;
  }

  public setCurrentUser(user: UserAccount): void {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));
      } catch {
        // ignore
      }
    }
  }

  public getAllAccounts(): UserAccount[] {
    return this.accounts;
  }

  public login(
    email: string,
    role: AccountRole
  ): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    let account = this.accounts.find(
      a => a.email.toLowerCase() === trimmedEmail && a.role === role
    );

    // If not found by exact email and role, check if email exists under another role
    if (!account) {
      const existingOpposite = this.accounts.find(
        a => a.email.toLowerCase() === trimmedEmail
      );
      if (existingOpposite) {
        return {
          success: false,
          error: `Email ini terdaftar sebagai ${existingOpposite.role === 'guru' ? 'Akun Guru' : 'Akun Murid'}. Harap pilih tab peran yang sesuai.`,
        };
      }

      // Auto-create account with reasonable defaults if email looks valid
      if (trimmedEmail.includes('@')) {
        const namePart = trimmedEmail.split('@')[0].replace(/[._-]/g, ' ');
        const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const newAccount: UserAccount = {
          id: `user-${Date.now()}`,
          email: trimmedEmail,
          name: role === 'guru' ? `Bpk/Ibu ${capitalized}` : capitalized,
          role,
          avatar: role === 'guru' ? '👨‍🏫' : '🎒',
          school: 'SMA Negeri 1 Nusantara',
          nip: role === 'guru' ? `1990${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
          nis: role === 'murid' ? `${Math.floor(20240000 + Math.random() * 9999)}` : undefined,
          grade: role === 'murid' ? 'Kelas 10-A' : undefined,
          subject: role === 'guru' ? 'Bahasa Inggris' : undefined,
          createdAt: new Date().toISOString(),
          stats: {
            sessionsCount: 0,
            highScore: 0,
            totalQuestionsAnswered: 0,
            correctAnswersCount: 0,
            accuracy: 0,
            lastActive: new Date().toISOString(),
          },
        };
        this.accounts.push(newAccount);
        this.saveAccounts(this.accounts);
        this.setCurrentUser(newAccount);
        return { success: true, user: newAccount };
      }

      return {
        success: false,
        error: 'Email tidak valid. Pastikan format email benar (misal: nama@gmail.com).',
      };
    }

    this.setCurrentUser(account);
    return { success: true, user: account };
  }

  public register(
    data: {
      email: string;
      name: string;
      role: AccountRole;
      avatar?: string;
      school?: string;
      nip?: string;
      subject?: string;
      nis?: string;
      grade?: string;
    }
  ): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Alamat email wajib diisi dengan format valid.' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Nama lengkap wajib diisi.' };
    }

    // Check if exists
    const existing = this.accounts.find(a => a.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: `Email "${trimmedEmail}" sudah terdaftar sebagai ${existing.role === 'guru' ? 'Akun Guru' : 'Akun Murid'}. Silakan masuk.`,
      };
    }

    const newAccount: UserAccount = {
      id: `${data.role}-${Date.now()}`,
      email: trimmedEmail,
      name: data.name.trim(),
      role: data.role,
      avatar: data.avatar || (data.role === 'guru' ? '👩‍🏫' : '🎓'),
      school: data.school?.trim() || 'SMA Negeri 1 Nusantara',
      nip: data.role === 'guru' ? data.nip?.trim() || 'Belum diisi' : undefined,
      subject: data.role === 'guru' ? data.subject?.trim() || 'Bahasa Inggris' : undefined,
      nis: data.role === 'murid' ? data.nis?.trim() || 'Belum diisi' : undefined,
      grade: data.role === 'murid' ? data.grade?.trim() || 'Kelas 10' : undefined,
      createdAt: new Date().toISOString(),
      stats: {
        sessionsCount: 0,
        highScore: 0,
        totalQuestionsAnswered: 0,
        correctAnswersCount: 0,
        accuracy: 0,
        lastActive: new Date().toISOString(),
      },
    };

    this.accounts.push(newAccount);
    this.saveAccounts(this.accounts);
    this.setCurrentUser(newAccount);
    return { success: true, user: newAccount };
  }

  public switchDemoAccount(role: AccountRole): UserAccount {
    const target = role === 'guru' ? DEFAULT_GURU : DEFAULT_MURID;
    this.setCurrentUser(target);
    return target;
  }

  public recordQuizCompletion(result: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  }): void {
    const cur = this.currentUser;
    const newSessions = cur.stats.sessionsCount + 1;
    const newTotalQ = cur.stats.totalQuestionsAnswered + result.totalQuestions;
    const newCorrect = cur.stats.correctAnswersCount + result.correctAnswers;
    const newAccuracy = newTotalQ > 0 ? Math.round((newCorrect / newTotalQ) * 1000) / 10 : 0;
    const newHighScore = Math.max(cur.stats.highScore, result.score);

    cur.stats = {
      sessionsCount: newSessions,
      highScore: newHighScore,
      totalQuestionsAnswered: newTotalQ,
      correctAnswersCount: newCorrect,
      accuracy: newAccuracy,
      lastActive: new Date().toISOString(),
    };

    this.setCurrentUser(cur);

    // Update in accounts array
    const idx = this.accounts.findIndex(a => a.id === cur.id);
    if (idx !== -1) {
      this.accounts[idx] = cur;
      this.saveAccounts(this.accounts);
    }
  }

  public logout(): void {
    // Reset to default student or guest
    this.setCurrentUser(DEFAULT_MURID);
  }
}

export const authService = new AuthService();
