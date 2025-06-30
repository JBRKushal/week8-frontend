import React, { useState, useEffect } from 'react';

const HackerAnimation = () => {
  const [text, setText] = useState('');
  const finalText = 'TaskFlow';
  const characters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= finalText.length) {
        let displayText = finalText.slice(0, currentIndex);
        
        // Add random characters for the "hacking" effect
        for (let i = currentIndex; i < finalText.length; i++) {
          displayText += characters[Math.floor(Math.random() * characters.length)];
        }
        
        setText(displayText);
        
        if (currentIndex === finalText.length) {
          setText(finalText);
          clearInterval(interval);
        }
        
        currentIndex++;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-4xl font-bold text-blue-600 font-mono tracking-wider">
      {text}
      <span className="animate-pulse">|</span>
    </div>
  );
};

export default HackerAnimation;