/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Database, BookOpen, Crown, Smartphone, HelpCircle, User, ShieldCheck, ArrowRightLeft, Sparkles, GraduationCap, LogOut } from 'lucide-react';
import { ThreeScene } from './components/ThreeScene';
import { QuizCard } from './components/QuizCard';
import { HostMonitorView } from './components/HostMonitorView';
import { PlayerView } from './components/PlayerView';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { ExplanationModal } from './components/ExplanationModal';
import { Leaderboard } from './components/Leaderboard';
import { PodiumScreen } from './components/PodiumScreen';
import { MistakeNotebook } from './components/MistakeNotebook';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { HostPlayerGuideModal } from './components/HostPlayerGuideModal';
import { LobbyScreen } from './components/LobbyScreen';
import { LoginScreen } from './components/LoginScreen';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { INITIAL_QUESTIONS, BOT_NAMES } from './data/englishQuestions';
import { GamePhase, PlayerScore, QuizQuestion, QuizSettings, GoogleSheetsConfig, UserRole } from './types/quiz';
import { soundService } from './services/soundEffects';
import { sheetsService } from './services/sheetsService';
import { roomSyncService } from './services/roomSync';
import { authService, UserAccount, AccountRole, DEFAULT_GURU, DEFAULT_MURID } from './services/authService';

export default function App() {
  // Login Gate State (starts at Login Menu as requested)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [gamePhase, setGamePhase] = useState<GamePhase>('lobby');
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [highlightShape, setHighlightShape] = useState<'triangle' | 'diamond' | 'circle' | 'square' | null>(null);

  // Auth & Profile State
  const [currentUserAccount, setCurrentUserAccount] = useState<UserAccount>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [teacherGuardOpen, setTeacherGuardOpen] = useState(false);

  // Modals
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Settings & Players
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [show3DScene, setShow3DScene] = useState(true);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => sheetsService.getConfig());
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [currentUserId, setCurrentUserId] = useState('user-1');
  const [userRole, setUserRole] = useState<UserRole>(() => (currentUserAccount.role === 'guru' ? 'host' : 'player'));

  const [settings, setSettings] = useState<QuizSettings>({
    selectedCategory: 'all',
    difficultyFilter: 'all',
    questionCount: 10,
    timerMultiplier: 1.0,
    enableBots: true,
    botCount: 4,
    soundEnabled: true,
    gamePin: '849201',
    userRole: currentUserAccount.role === 'guru' ? 'host' : 'player',
  });

  const [readyCountdown, setReadyCountdown] = useState<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const botTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const handleRecordPlayerAnswerRef = useRef<(playerId: string, optionId: 'A' | 'B' | 'C' | 'D', timeTaken: number) => void>(() => {});

  // URL Query Sync (e.g. ?pin=849201)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pinParam = params.get('pin');
      if (pinParam) {
        setSettings(prev => ({ ...prev, gamePin: pinParam, userRole: 'player' }));
        setUserRole('player');
        // If arrived via direct join link, bypass initial menu to student player view
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Handle successful login from dedicated LoginScreen
  const handleLoginSuccess = (user: UserAccount, targetUserRole: UserRole) => {
    setCurrentUserAccount(user);
    setUserRole(targetUserRole);
    setSettings(prev => ({ ...prev, userRole: targetUserRole }));
    setIsLoggedIn(true);
    setGamePhase('lobby');
  };

  const handleLogoutToLoginMenu = () => {
    setIsLoggedIn(false);
    setGamePhase('lobby');
  };

  // Sync user role with account role default if in lobby
  const handleUserAccountChange = (user: UserAccount) => {
    setCurrentUserAccount(user);
    if (gamePhase === 'lobby') {
      const targetRole: UserRole = user.role === 'guru' ? 'host' : 'player';
      setUserRole(targetRole);
      setSettings(prev => ({ ...prev, userRole: targetRole }));
    }
  };

  const handleQuickToggleAccountRole = () => {
    const nextRole: AccountRole = currentUserAccount.role === 'guru' ? 'murid' : 'guru';
    const target = authService.switchDemoAccount(nextRole);
    handleUserAccountChange(target);
  };

  // Multi-Tab Synchronization via roomSyncService
  useEffect(() => {
    const unsubRoomUpdate = roomSyncService.subscribe('HOST_ROOM_UPDATE', (payload) => {
      if (userRole === 'player') {
        if (payload.status) setGamePhase(payload.status);
        if (payload.currentQuestionIndex !== undefined) setCurrentQuestionIndex(payload.currentQuestionIndex);
        if (payload.timeLeft !== undefined) setTimeLeft(payload.timeLeft);
        if (payload.players) setPlayers(payload.players);
      }
    });

    const unsubPlayerAnswer = roomSyncService.subscribe('PLAYER_ANSWER', (payload) => {
      // Host receives player answer in real time
      handleRecordPlayerAnswerRef.current(payload.playerId, payload.optionId, payload.timeTaken);
    });

    return () => {
      unsubRoomUpdate();
      unsubPlayerAnswer();
    };
  }, [userRole]);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentUser = players.find(p => p.id === currentUserId);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setSoundEnabled(next);
  };

  const handleStartGame = (nickname: string, avatar: string, newSettings: QuizSettings) => {
    setSettings(newSettings);
    setUserRole(newSettings.userRole);

    // 1. Filter by category
    let pool = [...INITIAL_QUESTIONS];
    if (newSettings.selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === newSettings.selectedCategory);
    }

    // 2. Filter by difficulty
    if (newSettings.difficultyFilter !== 'all') {
      const exactPool = pool.filter(q => q.difficulty === newSettings.difficultyFilter);
      if (exactPool.length > 0) pool = exactPool;
    }

    // 3. Shuffle
    pool.sort(() => Math.random() - 0.5);

    // 4. Slice by requested count (1 to 25)
    const finalQuestions = pool.slice(0, Math.min(newSettings.questionCount, pool.length));
    setQuestions(finalQuestions);

    // 5. Setup Players
    const mainPlayer: PlayerScore = {
      id: 'player-me',
      name: nickname,
      avatar,
      score: 0,
      streak: 0,
      highestStreak: 0,
      correctCount: 0,
      answers: [],
    };
    setCurrentUserId('player-me');

    let initialPlayerList: PlayerScore[] = [mainPlayer];

    // Add bots only if not solo practice
    if (newSettings.userRole !== 'solo' && newSettings.enableBots) {
      const botPlayers: PlayerScore[] = BOT_NAMES.slice(0, newSettings.botCount).map((bot, idx) => ({
        id: `bot-${idx}`,
        name: bot.name,
        avatar: bot.avatar,
        score: 0,
        streak: 0,
        highestStreak: 0,
        correctCount: 0,
        answers: [],
      }));
      initialPlayerList = [mainPlayer, ...botPlayers];
    }

    setPlayers(initialPlayerList);

    // Broadcast room info
    roomSyncService.broadcast('HOST_ROOM_UPDATE', {
      status: 'countdown',
      currentQuestionIndex: 0,
      timeLeft: finalQuestions[0]?.timeLimitSeconds || 20,
      players: initialPlayerList,
    });

    // 3-2-1 Countdown
    triggerCountdown(() => {
      startQuestion(0, finalQuestions, initialPlayerList);
    });
  };

  const triggerCountdown = (onComplete: () => void) => {
    setGamePhase('countdown');
    soundService.playCountdownTick(false);
    let count = 3;
    setReadyCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setReadyCountdown(count);
        soundService.playCountdownTick(false);
      } else {
        clearInterval(interval);
        setReadyCountdown(null);
        onComplete();
      }
    }, 800);
  };

  const startQuestion = (index: number, qList = questions, playerList = players) => {
    const q = qList[index];
    if (!q) return;

    setCurrentQuestionIndex(index);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsTimerPaused(false);
    setTimeLeft(q.timeLimitSeconds);
    setGamePhase('question');
    questionStartTimeRef.current = Date.now();

    // Broadcast question to all players
    roomSyncService.broadcast('HOST_ROOM_UPDATE', {
      status: 'question',
      currentQuestionIndex: index,
      timeLeft: q.timeLimitSeconds,
      players: playerList,
    });

    // Simulate bot answers staggered over time
    if (userRole !== 'solo' && settings.enableBots) {
      simulateBotAnswers(q, settings.botCount);
    }
  };

  const simulateBotAnswers = (q: QuizQuestion, botCount = settings.botCount) => {
    botTimeoutsRef.current.forEach(t => clearTimeout(t));
    botTimeoutsRef.current = [];

    BOT_NAMES.slice(0, botCount).forEach((bot, idx) => {
      const botDelay = (1 - bot.speedFactor) * q.timeLimitSeconds * 1000 + Math.random() * 2000;
      const t = setTimeout(() => {
        const isBotCorrect = Math.random() < bot.accuracy;
        const chosen = isBotCorrect
          ? q.correctOptionId
          : (['A', 'B', 'C', 'D'].filter(o => o !== q.correctOptionId)[Math.floor(Math.random() * 3)] as any);
        handleRecordPlayerAnswerRef.current(`bot-${idx}`, chosen, botDelay / 1000);
      }, botDelay);
      botTimeoutsRef.current.push(t);
    });
  };

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== 'question' || isAnswered || isTimerPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpire();
          return 0;
        }
        if (prev <= 5) {
          soundService.playCountdownTick(true);
        } else {
          soundService.playCountdownTick(false);
        }
        // Broadcast tick
        roomSyncService.broadcast('HOST_ROOM_UPDATE', { timeLeft: prev - 1 });
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, isAnswered, currentQuestionIndex, isTimerPaused]);

  const handleTogglePauseTimer = () => {
    setIsTimerPaused(prev => !prev);
  };

  const handleAddTime = (seconds: number = 10) => {
    setTimeLeft(prev => {
      const updated = prev + seconds;
      roomSyncService.broadcast('HOST_ROOM_UPDATE', { timeLeft: updated });
      return updated;
    });
  };

  // Answer handler
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    const timeTaken = Math.max(1, (Date.now() - questionStartTimeRef.current) / 1000);
    handleRecordPlayerAnswer(currentUserId, optionId, timeTaken);

    // If player mode, lock in answer and broadcast to host
    if (userRole === 'player') {
      roomSyncService.broadcast('PLAYER_ANSWER', {
        playerId: currentUserId,
        optionId,
        timeTaken,
      });
    }

    if (userRole === 'solo') {
      setIsAnswered(true);
      setSelectedOption(optionId);
      setGamePhase('answered');
    }
  };

  const handleRecordPlayerAnswer = useCallback((playerId: string, optionId: 'A' | 'B' | 'C' | 'D', timeTaken: number) => {
    const q = questions[currentQuestionIndex];
    if (!q) return;

    const isCorrect = optionId === q.correctOptionId;

    let points = 0;
    if (isCorrect) {
      const timeFactor = Math.max(0.1, timeLeft / q.timeLimitSeconds);
      points = Math.round(500 + 500 * timeFactor);
    }

    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id === playerId) {
          const newStreak = isCorrect ? p.streak + 1 : 0;
          const streakBonus = isCorrect && newStreak > 1 ? (newStreak - 1) * 100 : 0;
          const totalEarned = points + streakBonus;

          if (playerId === currentUserId) {
            if (isCorrect) soundService.playCorrectChime();
            else soundService.playWrongBuzzer();
          }

          // Check if already answered
          const existingAnsIdx = p.answers.findIndex(a => a.questionId === q.id);
          const newAnsRecord = {
            questionId: q.id,
            selectedOption: optionId,
            isCorrect,
            timeTakenSeconds: timeTaken,
            pointsEarned: totalEarned,
          };

          const answersList = existingAnsIdx >= 0
            ? p.answers.map((a, i) => i === existingAnsIdx ? newAnsRecord : a)
            : [...p.answers, newAnsRecord];

          return {
            ...p,
            score: p.score + totalEarned,
            streak: newStreak,
            highestStreak: Math.max(p.highestStreak || 0, newStreak),
            correctCount: p.correctCount + (isCorrect ? 1 : 0),
            answers: answersList,
          };
        }
        return p;
      });

      // Broadcast updated scores to players
      roomSyncService.broadcast('HOST_ROOM_UPDATE', { players: updated });
      return updated;
    });
  }, [questions, currentQuestionIndex, timeLeft, currentUserId]);

  useEffect(() => {
    handleRecordPlayerAnswerRef.current = handleRecordPlayerAnswer;
  });

  useEffect(() => {
    return () => {
      botTimeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleTimeExpire = () => {
    botTimeoutsRef.current.forEach(t => clearTimeout(t));
    botTimeoutsRef.current = [];
    setIsAnswered(true);
    setGamePhase('answered');
    soundService.playWrongBuzzer();

    roomSyncService.broadcast('HOST_ROOM_UPDATE', {
      status: 'answered',
      timeLeft: 0,
    });
  };

  const handleProceedAfterQuestion = () => {
    setIsExplanationOpen(false);
    setGamePhase('leaderboard');
    roomSyncService.broadcast('HOST_ROOM_UPDATE', { status: 'leaderboard' });
  };

  const handleNextFromLeaderboard = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      startQuestion(currentQuestionIndex + 1);
    } else {
      setGamePhase('podium');
      roomSyncService.broadcast('HOST_ROOM_UPDATE', { status: 'podium' });

      // Record stats in local account profile
      const user = players.find(p => p.id === currentUserId);
      if (user) {
        authService.recordQuizCompletion({
          score: user.score,
          totalQuestions: questions.length,
          correctAnswers: user.correctCount,
        });
        setCurrentUserAccount(authService.getCurrentUser());
      }

      // Auto sync to Google Sheets
      if (user && sheetsConfig.scriptUrl && sheetsConfig.connected) {
        const payload = sheetsService.createSubmissionPayload(user, questions, settings.selectedCategory);
        sheetsService.syncToSheets(payload, sheetsConfig).catch(() => {});
      }
    }
  };

  const handlePlayerJoinFromStudent = (name: string, avatar: string, pin: string) => {
    const studentPlayer: PlayerScore = {
      id: `student-${Date.now()}`,
      name,
      avatar,
      score: 0,
      streak: 0,
      highestStreak: 0,
      correctCount: 0,
      answers: [],
    };
    setCurrentUserId(studentPlayer.id);

    setPlayers(prev => {
      const nextList = [...prev.filter(p => p.id !== studentPlayer.id), studentPlayer];
      roomSyncService.broadcast('HOST_ROOM_UPDATE', { players: nextList });
      return nextList;
    });
  };

  // Role Switch Guard: check if Murid attempts to access Host Proyektor
  const handleRoleChangeRequest = (targetRole: UserRole) => {
    if (targetRole === 'host' && currentUserAccount.role === 'murid') {
      setTeacherGuardOpen(true);
      return;
    }
    setUserRole(targetRole);
    setSettings(s => ({ ...s, userRole: targetRole }));
  };

  return (
    <div className="ambient-kahoot-bg min-h-screen text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white relative">
      {/* 
        HEADER TOP BAR (Top Bar Contract:
        Wordmark - User Identity - Menu Login Trigger - 3D Toggle - Sound Toggle - Sheets Button)
      */}
      <header className="w-full bg-[#0d011c]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: App Brand & Topic */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-950/50">
              <div className="w-full h-full bg-[#110325] rounded-[14px] flex items-center justify-center font-display font-black text-white text-base">
                K!
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-black text-white text-lg tracking-tight">
                  KahootEnglish<span className="text-purple-400">3D</span>
                </span>
                <span className="text-[11px] font-extrabold tracking-wider text-purple-400 uppercase hidden sm:inline-block border-l border-white/20 pl-2.5">
                  SMA · Recount & Leaders
                </span>
              </div>
              <p className="text-[11px] text-purple-200/60 hidden md:block">
                Media Evaluasi Interaktif Bahasa Inggris SMA
              </p>
            </div>
          </div>

          {/* Right: Global Controls & Account Badge */}
          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <>
                {/* Account Profile Badge (Click to open profile modal) */}
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                    currentUserAccount.role === 'guru'
                      ? 'bg-purple-950/60 border-purple-400/40 hover:border-purple-300 text-purple-100 shadow-md shadow-purple-950/30'
                      : 'bg-emerald-950/60 border-emerald-400/40 hover:border-emerald-300 text-emerald-100 shadow-md shadow-emerald-950/30'
                  }`}
                  title="Lihat profil dan statistik akun"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-sm flex-shrink-0">
                    {currentUserAccount.avatar}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                        currentUserAccount.role === 'guru' ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {currentUserAccount.role === 'guru' ? 'Guru' : 'Murid'}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[120px] lg:max-w-[150px]">
                        {currentUserAccount.name}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-70 truncate max-w-[160px]">{currentUserAccount.email}</p>
                  </div>
                </button>

                {/* Quick Switch Button (Guru ↔ Murid) */}
                <button
                  type="button"
                  onClick={handleQuickToggleAccountRole}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title={`Beralih cepat ke akun ${currentUserAccount.role === 'guru' ? 'Murid' : 'Guru'}`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden md:inline">
                    {currentUserAccount.role === 'guru' ? 'Ke Murid' : 'Ke Guru'}
                  </span>
                </button>

                {/* Return to Login Menu */}
                <button
                  type="button"
                  onClick={handleLogoutToLoginMenu}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Kembali ke Menu Login (Pilih Host/Guru atau Murid/Player)"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-300" />
                  <span className="hidden sm:inline">Menu Login</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-400/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Menu Login: Pilih Host atau Murid</span>
              </div>
            )}

            {/* 3D Visual Scene Toggle */}
            <button
              type="button"
              onClick={() => setShow3DScene(!show3DScene)}
              title={show3DScene ? 'Sembunyikan 3D Visual' : 'Tampilkan 3D Visual'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer transition-colors"
            >
              {show3DScene ? <Eye className="w-4 h-4 text-purple-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            {/* Sheets Status Button */}
            <button
              type="button"
              onClick={() => setIsSheetsModalOpen(true)}
              title={sheetsConfig.connected ? 'Google Sheets Terhubung' : 'Hubungkan Google Sheets'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                sheetsConfig.connected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Role Switcher Bar (Only rendered once logged in) */}
      {isLoggedIn && (
        <RoleSwitcherBar
          currentRole={userRole}
          onChangeRole={handleRoleChangeRequest}
          gamePin={settings.gamePin}
          playerCount={players.length || 1}
          onOpenGuide={() => setIsGuideModalOpen(true)}
          accountRole={currentUserAccount.role}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Three.js Interactive 3D Canvas */}
        {show3DScene && (
          <div className="w-full transition-all duration-300">
            <ThreeScene
              gamePhase={!isLoggedIn ? 'lobby' : gamePhase}
              highlightShape={highlightShape}
              isAudioPlaying={currentQuestion?.category === 'recount' || currentQuestion?.category === 'community_leaders'}
            />
          </div>
        )}

        {/* SCREEN 0: DEDICATED LOGIN MENU (Pilih Host/Guru atau Murid/Player) */}
        {!isLoggedIn ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            {/* 3-2-1 Countdown Overlay */}
            {gamePhase === 'countdown' && readyCountdown !== null && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 animate-fadeIn">
                <span className="text-sm font-extrabold uppercase tracking-widest text-purple-300 mb-4">
                  Bersiaplah! Pertanyaan Dimulai Dalam:
                </span>
                <div className="w-32 h-32 rounded-3xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center font-display font-black text-7xl text-white shadow-2xl animate-ping">
                  {readyCountdown}
                </div>
              </div>
            )}

            {/* VIEW 1: PLAYER MODE (Handphone Screen) */}
            {userRole === 'player' && (
              <PlayerView
                currentQuestion={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                timeLeft={timeLeft}
                totalTime={currentQuestion.timeLimitSeconds}
                phase={gamePhase}
                hostPin={settings.gamePin}
                onPlayerAnswer={handleSelectOption}
                onJoinRoom={handlePlayerJoinFromStudent}
                playerScore={currentUser}
                players={players}
                onOpenMistakes={() => setGamePhase('review')}
                defaultNickname={currentUserAccount.name}
                defaultAvatar={currentUserAccount.avatar}
              />
            )}

            {/* VIEW 2: HOST MODE - QUESTION MONITOR (Projector Screen) */}
            {userRole === 'host' && (gamePhase === 'question' || gamePhase === 'answered') && currentQuestion && (
              <HostMonitorView
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                timeLeft={timeLeft}
                totalTime={currentQuestion.timeLimitSeconds}
                isAnswered={isAnswered || gamePhase === 'answered'}
                players={players}
                onNextQuestion={handleProceedAfterQuestion}
                onOpenExplanation={() => setIsExplanationOpen(true)}
                isLastQuestion={currentQuestionIndex + 1 >= questions.length}
                gamePin={settings.gamePin}
                isTimerPaused={isTimerPaused}
                onTogglePauseTimer={handleTogglePauseTimer}
                onAddTime={() => handleAddTime(10)}
                onForceEndQuestion={handleTimeExpire}
              />
            )}

            {/* VIEW 3: SOLO / CLASSIC QUIZ VIEW */}
            {userRole === 'solo' && (gamePhase === 'question' || gamePhase === 'answered') && currentQuestion && (
              <QuizCard
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                timeLeft={timeLeft}
                totalTime={currentQuestion.timeLimitSeconds}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                onSelectOption={handleSelectOption}
                onHoverShape={setHighlightShape}
                onViewExplanation={() => setIsExplanationOpen(true)}
                streak={currentUser?.streak || 0}
              />
            )}

            {/* LOBBY VIEW (For Host or Solo) */}
            {gamePhase === 'lobby' && userRole !== 'player' && (
              <LobbyScreen
                onStartGame={handleStartGame}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
                onOpenGuideModal={() => setIsGuideModalOpen(true)}
                isSheetsConnected={sheetsConfig.connected}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                accountRole={currentUserAccount.role}
                accountName={currentUserAccount.name}
                accountAvatar={currentUserAccount.avatar}
                initialRole={userRole}
                onSwitchToPlayerMode={() => setUserRole('player')}
              />
            )}

            {/* LEADERBOARD VIEW */}
            {gamePhase === 'leaderboard' && (
              <Leaderboard
                players={players}
                currentUserId={currentUserId}
                onNext={handleNextFromLeaderboard}
                isLastQuestion={currentQuestionIndex + 1 >= questions.length}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
              />
            )}

            {/* PODIUM VIEW */}
            {gamePhase === 'podium' && (
              <PodiumScreen
                players={players}
                currentUserId={currentUserId}
                questions={questions}
                onPlayAgain={() => setGamePhase('lobby')}
                onOpenMistakes={() => setGamePhase('review')}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
                isSheetsConnected={sheetsConfig.connected}
              />
            )}

            {/* REVIEW MISTAKE NOTEBOOK */}
            {gamePhase === 'review' && currentUser && (
              <MistakeNotebook
                player={currentUser}
                questions={questions}
                onBack={() => setGamePhase('podium')}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Next Button for Solo Mode */}
      {isLoggedIn && gamePhase === 'answered' && userRole === 'solo' && (
        <div className="sticky bottom-4 z-30 max-w-md mx-auto w-full px-4 animate-fadeIn">
          <div className="bg-[#14052b]/95 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsExplanationOpen(true)}
              className="flex-1 py-3 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>Buka Penjelasan</span>
            </button>

            <button
              type="button"
              onClick={handleProceedAfterQuestion}
              className="flex-1 py-3 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
            >
              Lanjut ke Klasemen &gt;
            </button>
          </div>
        </div>
      )}

      {/* Teacher Role Guard Modal (When student tries to access host projector) */}
      {teacherGuardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-[#1c0836] to-[#0d011c] border border-purple-400/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-lg">Akses Khusus Guru</h3>
                <p className="text-xs text-purple-200/70">Layar Host Proyektor Kelas</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Anda sedang masuk dengan <strong>Akun Murid ({currentUserAccount.name})</strong>. Layar Host Proyektor dirancang untuk Guru mengendalikan jalannya kuis dan menampilkan soal di depan kelas.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs space-y-1 text-purple-300">
              <p className="font-bold text-white">Ingin berganti peran?</p>
              <p>Anda dapat beralih ke Akun Guru demo atau tetap bermain sebagai murid.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const guruUser = authService.switchDemoAccount('guru');
                  handleUserAccountChange(guruUser);
                  setUserRole('host');
                  setSettings(s => ({ ...s, userRole: 'host' }));
                  setTeacherGuardOpen(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Beralih ke Akun Guru (Bu Kartika Dewi)</span>
              </button>

              <button
                type="button"
                onClick={() => setTeacherGuardOpen(false)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Tetap di Akun Murid (Mainkan Kuis)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register / Switch Role) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUserAccount}
        onUserChanged={handleUserAccountChange}
        initialRole={currentUserAccount.role}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUserAccount}
        onSwitchAccount={() => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        onLogout={() => {
          authService.logout();
          setIsLoggedIn(false);
          setIsProfileModalOpen(false);
        }}
      />

      {/* Explanation Modal */}
      {currentQuestion && (
        <ExplanationModal
          isOpen={isExplanationOpen}
          onClose={() => setIsExplanationOpen(false)}
          question={currentQuestion}
          selectedOptionId={selectedOption}
          onNextQuestion={handleProceedAfterQuestion}
          isLastQuestion={currentQuestionIndex + 1 >= questions.length}
        />
      )}

      {/* Google Sheets Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={(updated) => setSheetsConfig(updated)}
        playerScore={currentUser}
        questions={questions}
        category={settings.selectedCategory}
      />

      {/* Host & Player Guide Modal */}
      <HostPlayerGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        gamePin={settings.gamePin}
      />

      {/* Footer */}
      <footer className="w-full bg-[#0e0221] border-t border-white/10 py-4 text-center text-xs text-purple-300/60">
        <p>
          KahootEnglish 3D • {isLoggedIn ? (
            <>
              Akun: <strong className="text-purple-200">{currentUserAccount.name}</strong> ({currentUserAccount.role === 'guru' ? 'Guru' : 'Murid'}) • Mode: {userRole === 'host' ? '👑 Host Proyektor Guru' : userRole === 'player' ? '📱 Layar Siswa (Player)' : '🎮 Latihan Mandiri'} • <button type="button" onClick={handleLogoutToLoginMenu} className="underline text-purple-300 hover:text-white cursor-pointer ml-1">Ganti Menu Login</button>
            </>
          ) : (
            'Portal Kuis Interaktif Bahasa Inggris SMA (Recount Text & Community Leaders)'
          )}
        </p>
      </footer>
    </div>
  );
}
