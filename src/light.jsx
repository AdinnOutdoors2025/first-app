import React, { useState, useEffect } from 'react';
import './word.css';

const words = ['Support', 'Service']; // Array of words

const Word = () => {
  const [scrambledWord, setScrambledWord] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambling, setScrambling] = useState(true);

  useEffect(() => {
    const scrambleInterval = setInterval(() => {
      setScrambledWord(scrambleWord(words[currentWordIndex])); // Scramble the current word vertically
    }, 150); // Scrambling every 150ms

    const wordChangeInterval = setInterval(() => {
      setScrambling(false); // Stop scrambling after 2 seconds and show the word
    }, 2000); // Stop scrambling after 2 seconds

    const changeWordInterval = setInterval(() => {
      // Switch between "Support" and "Service"
      setScrambling(true); // Start scrambling again
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length); // Change the word index after 4 seconds
    }, 4000); // Change word every 4 seconds

    // Clean up intervals
    return () => {
      clearInterval(scrambleInterval);
      clearInterval(wordChangeInterval);
      clearInterval(changeWordInterval);
    };
  }, [currentWordIndex]);

  // Scramble the word vertically
  const scrambleWord = (word) => {
    const scrambled = word
      .split('')
      .map((char) => (Math.random() > 0.5 ? ' ' : char)) // Add spaces to simulate vertical movement
      .join('');
    return scrambled;
  };

  return (
    <div className="container">
      <div className="word-container">
        <span className={`scrambled-word ${scrambling ? 'scrambling' : 'stopped'}`}>
          {scrambledWord || words[currentWordIndex]}
        </span>
      </div>
    </div>
  );
};

export default Word;
