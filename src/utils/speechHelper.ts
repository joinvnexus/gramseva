// ভয়েস রিকগনিশন হেল্পার

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechSynthesisUtterance: any;
  }
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  keywords: string[];
}

export class SpeechHelper {
  private recognition: any = null;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'bn-BD';
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.processCommand(transcript);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  addCommands(commands: VoiceCommand[]): void {
    this.commands.push(...commands);
  }

  private processCommand(transcript: string): void {
    const lowerTranscript = transcript.toLowerCase();
    
    for (const cmd of this.commands) {
      const matched = cmd.keywords.some(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (matched) {
        cmd.action();
        this.speak(`আপনি বলেছেন: ${cmd.command}`);
        break;
      }
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, lang: string = 'bn-BD'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }
}

// প্রি-ডিফাইন্ড কমান্ড
export const defaultVoiceCommands: VoiceCommand[] = [
  {
    command: 'সার্ভিস দেখাও',
    action: () => {
      window.location.href = '/services';
    },
    keywords: ['সার্ভিস', 'দেখাও', 'সব সার্ভিস', 'লিস্ট'],
  },
  {
    command: 'রিপোর্ট করো',
    action: () => {
      window.location.href = '/reports/new';
    },
    keywords: ['রিপোর্ট', 'সমস্যা', 'কিছু বলার', 'নতুন রিপোর্ট'],
  },
  {
    command: 'হাট বাজার দেখাও',
    action: () => {
      window.location.href = '/market';
    },
    keywords: ['হাট', 'বাজার', 'হাট বাজার', 'বাজারের দর'],
  },
  {
    command: 'প্রোফাইল দেখাও',
    action: () => {
      window.location.href = '/profile';
    },
    keywords: ['প্রোফাইল', 'আমার প্রোফাইল', 'একাউন্ট'],
  },
  {
    command: 'ড্যাশবোর্ড',
    action: () => {
      window.location.href = '/dashboard';
    },
    keywords: ['ড্যাশবোর্ড', 'হোম', 'মেইন পেজ'],
  },
];