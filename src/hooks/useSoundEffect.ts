import { useCallback, useRef } from "react";

export function useSoundEffect() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Resume audio context if suspended (required for user interaction)
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }
      } catch (error) {
        console.debug("Audio context initialization failed:", error);
      }
    }
    return audioContextRef.current;
  }, []);

  const playPaperFlipSound = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      if (!audioContext) return;

      const now = audioContext.currentTime;

      // Create a soft paper flip sound using oscillators and envelope
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      // Configure oscillator (soft, whooshing sound)
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(350, now);
      oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      // Configure filter for softer sound
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      // Configure envelope with higher volume
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05); // Louder peak
      gainNode.gain.exponentialRampToValueAtTime(0.02, now + 0.15); // Decay

      // Connect nodes: oscillator -> filter -> gain -> destination
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play
      oscillator.start(now);
      oscillator.stop(now + 0.15);

      // Add a second, quieter layer for more depth
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();

      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(220, now);
      oscillator2.frequency.exponentialRampToValueAtTime(100, now + 0.15);

      gainNode2.gain.setValueAtTime(0, now);
      gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.start(now);
      oscillator2.stop(now + 0.15);
    } catch (error) {
      console.debug("Sound effect error:", error);
    }
  }, [initAudioContext]);

  return { playPaperFlipSound };
}
