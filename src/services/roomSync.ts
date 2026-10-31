import { PlayerScore } from '../types/quiz';

export interface RoomState {
  pin: string;
  category: string;
  difficulty: string;
  questionCount: number;
  status: 'lobby' | 'countdown' | 'question' | 'answered' | 'leaderboard' | 'podium';
  currentQuestionIndex: number;
  timeLeft: number;
  totalTime: number;
  players: PlayerScore[];
  answerTally: { A: number; B: number; C: number; D: number };
}

type SyncCallback = (data: any) => void;

class RoomSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<SyncCallback>> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('kahoot_english_room_channel');
        this.channel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type && this.listeners.has(type)) {
            this.listeners.get(type)!.forEach((cb) => cb(payload));
          }
        };
      } catch {
        // Fallback for environments without BroadcastChannel
      }
    }
  }

  public subscribe(type: string, cb: SyncCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(cb);
    return () => {
      this.listeners.get(type)?.delete(cb);
    };
  }

  public broadcast(type: string, payload: any) {
    if (this.channel) {
      this.channel.postMessage({ type, payload });
    }
    // Also trigger locally in case same window
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.forEach((cb) => cb(payload));
    }
  }
}

export const roomSyncService = new RoomSyncService();
