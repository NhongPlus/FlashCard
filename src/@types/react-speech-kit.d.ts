declare module "react-speech-kit" {
  interface SpeechSynthesisVoice {
    default?: boolean;
    lang?: string;
    localService?: boolean;
    name?: string;
    voiceURI?: string;
  }

  interface UseSpeechSynthesisProps {
    onEnd?: () => void;
    onBoundary?: () => void;
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    lang?: string;
    voice?: SpeechSynthesisVoice;
    pitch?: number;
    rate?: number;
    volume?: number;
  }

  interface SpeechSynthesisResult {
    speak: (args: { text: string }) => void;
    speaking: boolean;
    supported: boolean;
    cancel: () => void;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(
    props?: UseSpeechSynthesisProps
  ): SpeechSynthesisResult;
}
