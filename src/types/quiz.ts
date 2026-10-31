export type QuestionCategory = 'recount' | 'community_leaders';

export type DifficultyLevel = 'Easy' | 'Normal' | 'Hard' | 'Expert';

export interface ExplanationDetail {
  whyWrong: string;
  whyCorrect: string;
  grammarRule: string;
  keyClue: string;
  exampleSentences: string[];
  vocabularyTips?: string[];
}

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  subtopic: string;
  difficulty: DifficultyLevel;
  question: string;
  contextText?: string;
  audioTranscript?: string;
  targetSpeechPhrase?: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
    shape: 'triangle' | 'diamond' | 'circle' | 'square';
    color: string;
  }[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  timeLimitSeconds: number;
  explanation: ExplanationDetail;
}

export interface AnswerRecord {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timeTakenSeconds: number;
  pointsEarned: number;
}

export interface PlayerScore {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  highestStreak: number;
  correctCount: number;
  isBot?: boolean;
  answers: AnswerRecord[];
}

export type GamePhase =
  | 'lobby'
  | 'countdown'
  | 'question'
  | 'answered'
  | 'explanation'
  | 'leaderboard'
  | 'podium'
  | 'review';

export type UserRole = 'host' | 'player' | 'solo';

export interface GoogleSheetsConfig {
  scriptUrl: string;
  sheetName: string;
  autoSync: boolean;
  lastSyncTimestamp?: string;
  connected: boolean;
}

export interface QuizSettings {
  selectedCategory: 'all' | QuestionCategory;
  difficultyFilter: 'all' | DifficultyLevel;
  questionCount: number;
  timerMultiplier: number;
  enableBots: boolean;
  botCount: number;
  soundEnabled: boolean;
  gamePin: string;
  userRole: UserRole;
}
