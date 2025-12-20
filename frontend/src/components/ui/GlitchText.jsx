import React, { useState, useEffect } from 'react';

const GlitchText = ({ 
  words = ["ACCELERATE", "AUTOMATE", "TRANSFORM"], 
  interval = 3000,
  className = "" 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(words[0]);
  const [isScrambling, setIsScrambling] = useState(false);
  
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;':\",./<>?";

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsScrambling(true);
      
      let scrambleIterations = 0;
      const nextIndex = (currentWordIndex + 1) % words.length;
      const targetWord = words[nextIndex];
      const maxIterations = 15; // Number of scramble frames before settling
      
      const scrambleTimer = setInterval(() => {
        const scrambled = targetWord
          .split("")
          .map((char, index) => {
            if (index < scrambleIterations / 3 || char === " ") {
              return targetWord[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
          
        setDisplayedText(scrambled);
        scrambleIterations++;
        
        if (scrambleIterations > maxIterations) {
          clearInterval(scrambleTimer);
          setDisplayedText(targetWord);
          setCurrentWordIndex(nextIndex);
          setIsScrambling(false);
        }
      }, 50); // Speed of scramble frames
      
    }, interval);

    return () => clearInterval(cycleInterval);
  }, [currentWordIndex, words, interval]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
    </span>
  );
};

export default GlitchText;
