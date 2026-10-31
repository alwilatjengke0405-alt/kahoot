export interface SpeechState {
  isPlaying: boolean;
  rate: number;
  activeWordIndex: number;
}

type AudioOrbCallback = (amplitude: number) => void;

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioOrbListeners: Set<AudioOrbCallback> = new Set();
  private animationInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribeAudioOrb(cb: AudioOrbCallback): () => void {
    this.audioOrbListeners.add(cb);
    return () => this.audioOrbListeners.delete(cb);
  }

  private notifyAudioOrb(amp: number) {
    this.audioOrbListeners.forEach(cb => cb(amp));
  }

  public speak(
    text: string,
    rate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.synth) {
      // Fallback
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 3000);
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    utterance.rate = rate;
    utterance.lang = 'en-US';

    // Find best English voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
      // Animate simulated audio waveform / orb pulsing
      let step = 0;
      this.animationInterval = window.setInterval(() => {
        step += 0.2;
        const amp = 0.4 + 0.6 * Math.abs(Math.sin(step) * Math.cos(step * 1.5));
        this.notifyAudioOrb(amp);
      }, 50);
    };

    utterance.onend = () => {
      this.cleanupAnimation();
      this.notifyAudioOrb(0);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.cleanupAnimation();
      this.notifyAudioOrb(0);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  private cleanupAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  public stop() {
    this.cleanupAnimation();
    this.notifyAudioOrb(0);
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();

// Speech Recognition for Speaking module
export interface RecognitionResult {
  transcript: string;
  accuracyPercent: number;
  matchedWords: string[];
  missingWords: string[];
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isAvailable(): boolean {
    return !!this.recognition;
  }

  public startListening(
    targetPhrase: string,
    onInterim: (text: string) => void,
    onComplete: (result: RecognitionResult) => void,
    onError: (err: string) => void
  ) {
    if (!this.recognition) {
      onError('Speech Recognition tidak didukung pada browser ini. Silakan gunakan Chrome atau Edge.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    }

    this.isListening = true;
    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onInterim(finalTranscript || interim);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(`Mikrofon error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      const evaluation = this.evaluatePronunciation(targetPhrase, finalTranscript);
      onComplete(evaluation);
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError(err.message || 'Gagal memulai mikrofon');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private cleanWords(str: string): string[] {
    return str
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
  }

  public evaluatePronunciation(targetPhrase: string, spokenText: string): RecognitionResult {
    const targetWords = this.cleanWords(targetPhrase);
    const spokenWords = this.cleanWords(spokenText);

    if (spokenWords.length === 0) {
      return {
        transcript: spokenText,
        accuracyPercent: 0,
        matchedWords: [],
        missingWords: targetWords,
      };
    }

    const matchedWords: string[] = [];
    const missingWords: string[] = [];

    targetWords.forEach(targetWord => {
      if (spokenWords.includes(targetWord)) {
        matchedWords.push(targetWord);
      } else {
        missingWords.push(targetWord);
      }
    });

    const accuracyPercent = Math.min(
      100,
      Math.round((matchedWords.length / Math.max(1, targetWords.length)) * 100)
    );

    return {
      transcript: spokenText,
      accuracyPercent,
      matchedWords,
      missingWords,
    };
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
