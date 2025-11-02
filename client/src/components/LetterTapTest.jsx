import React, { useState, useEffect } from 'react';

function LetterTapTest({ letters, targetLetter, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTaps, setUserTaps] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setUserTaps([...userTaps, currentIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [started, currentIndex, userTaps]);

  useEffect(() => {
    if (!started) return;

    if (currentIndex < letters.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Calculate results
      const targetIndices = letters.map((letter, idx) => letter === targetLetter ? idx : null).filter(idx => idx !== null);
      const correctTaps = userTaps.filter(tap => targetIndices.includes(tap)).length;
      const incorrectTaps = userTaps.filter(tap => !targetIndices.includes(tap)).length;
      const missedTaps = targetIndices.length - correctTaps;
      
      onComplete({
        correctTaps,
        incorrectTaps,
        missedTaps,
        totalTargets: targetIndices.length
      });
    }
  }, [currentIndex, started]);

  const startTest = () => {
    setStarted(true);
  };

  if (!started) {
    return (
      <div>
        <p>Press the SPACEBAR every time you see the letter '{targetLetter}'.</p>
        <button onClick={startTest}>Start Test</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: '4rem', fontWeight: 'bold', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentIndex < letters.length ? letters[currentIndex] : 'Complete!'}
      </div>
      <p>Press SPACEBAR when you see '{targetLetter}'</p>
      <p>Letter {currentIndex + 1} of {letters.length}</p>
    </div>
  );
}

export default LetterTapTest;
