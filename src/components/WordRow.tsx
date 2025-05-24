
import React from 'react';

interface WordRowProps {
  word: string;
  targetWord: string;
  isSubmitted: boolean;
  isCurrentRow: boolean;
}

const WordRow: React.FC<WordRowProps> = ({ word, targetWord, isSubmitted, isCurrentRow }) => {
  // Pad the word to always have 5 characters
  const paddedWord = word.padEnd(5, ' ');

  // We need to calculate which letters are correct, present, or absent
  const getTileStatus = (letter: string, index: number): 'correct' | 'present' | 'absent' | '' => {
    if (!isSubmitted || letter === ' ') return '';
    if (!targetWord) return '';  // If target word is not set yet

    // If letter is in the correct position
    if (letter === targetWord[index]) return 'correct';

    // If letter exists in the target word but not at this position
    if (targetWord.includes(letter)) {
      // Count occurrences of this letter in the target
      const targetOccurrences = targetWord.split('').filter(char => char === letter).length;
      
      // Count correct occurrences of this letter in the word
      const correctOccurrences = word.split('').filter((char, i) => char === letter && targetWord[i] === letter).length;
      
      // Count previous occurrences of this letter marked as "present"
      let previousPresentCount = 0;
      for (let i = 0; i < index; i++) {
        if (word[i] === letter && targetWord[i] !== letter) {
          previousPresentCount++;
        }
      }

      // If we've already marked the max number of occurrences, mark as absent
      if (previousPresentCount + correctOccurrences < targetOccurrences) {
        return 'present';
      }
    }
    
    return 'absent';
  };

  return (
    <div className="flex gap-1">
      {paddedWord.split('').map((letter, index) => {
        const status = getTileStatus(letter, index);
        let tileClass = "word-tile border-2 border-gray-300";
        let animationClass = "";
        
        if (isSubmitted) {
          if (status === 'correct') tileClass = "word-tile border-0 bg-green-500 text-white";
          else if (status === 'present') tileClass = "word-tile border-0 bg-yellow-500 text-white";
          else if (status === 'absent') tileClass = "word-tile border-0 bg-gray-500 text-white";
          
          // Add animation delay based on index
          animationClass = `animate-reveal [animation-delay:${index * 200}ms]`;
        } else if (isCurrentRow && letter !== ' ') {
          tileClass = "word-tile border-2 border-gray-400";
          animationClass = "animate-pop";
        }
        
        return (
          <div key={index} className={`${tileClass} ${animationClass} px-2`}>
            {letter !== ' ' ? letter : ''}
          </div>
        );
      })}
    </div>
  );
};

export default WordRow;
