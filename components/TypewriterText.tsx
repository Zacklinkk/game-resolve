import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

export const TypewriterText: React.FC<Props> = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    
    const timer = setInterval(() => {
      if (i <= text.length) {
        // Scramble effect for the leading edge
        const clean = text.slice(0, i);
        let scrambled = '';
        
        // Add 2 random chars at the end to simulate decoding, unless finished
        if (i < text.length) {
          const r1 = CHARS[Math.floor(Math.random() * CHARS.length)];
          const r2 = CHARS[Math.floor(Math.random() * CHARS.length)];
          scrambled = r1 + r2;
        }
        
        setDisplayedText(clean + scrambled);
        i++;
      } else {
        setDisplayedText(text); // Ensure final text is clean
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <p className="leading-relaxed text-base md:text-lg text-stone-300 font-serif whitespace-pre-line drop-shadow-md min-h-[20vh] md:min-h-[50vh]">
      {displayedText}
      <span className="animate-pulse inline-block w-2 h-4 bg-amber-600 ml-1 align-middle shadow-[0_0_10px_rgba(217,119,6,0.8)]"></span>
    </p>
  );
};