
import React, { useState, useEffect } from 'react';
import WordRow from './WordRow';
import Keyboard from './Keyboard';
import { isValidWord, getTodaysWord } from '../data/wordList';
import { toast } from '@/components/ui/use-toast';
import { SignInButton } from './SignInButton';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

interface GameBoardProps {
  onGameEnd: (won: boolean, attempts: number) => void;
  isLoggedIn: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ onGameEnd, isLoggedIn }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_ATTEMPTS).fill(''));
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [letterStates, setLetterStates] = useState<Record<string, 'correct' | 'present' | 'absent' | undefined>>({});
  const [isShaking, setIsShaking] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lastPlayedDate, setLastPlayedDate] = useState<string | null>(null);
  const [nextGameTime, setNextGameTime] = useState<number>(0);
  
  // Initialize the game with today's word and check if already played today
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const word = getTodaysWord();
    console.log("Target word set:", word);
    setTargetWord(word);

    // Check local storage for last played date for this word
    const storedDate = localStorage.getItem('lastPlayedDate');
    const storedWord = localStorage.getItem('lastPlayedWord');
    
    if (storedDate === today && storedWord === word) {
      setLastPlayedDate(today);
      setGameCompleted(true);

      // Load previous game state if available
      const storedGameStatus = localStorage.getItem('gameStatus');
      const storedGuesses = localStorage.getItem('guesses');
      const storedCurrentAttempt = localStorage.getItem('currentAttempt');
      const storedLetterStates = localStorage.getItem('letterStates');
      
      if (storedGameStatus && storedGuesses && storedCurrentAttempt && storedLetterStates) {
        setGameStatus(storedGameStatus as 'playing' | 'won' | 'lost');
        setGuesses(JSON.parse(storedGuesses));
        setCurrentAttempt(parseInt(storedCurrentAttempt, 10));
        setLetterStates(JSON.parse(storedLetterStates));
      }
    }
    
    // Set up next game time countdown
    const updateNextGameTime = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextGameTime(tomorrow.getTime() - now.getTime());
    };
    
    updateNextGameTime();
    const timer = setInterval(updateNextGameTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLetter = (letter: string) => {
    if (gameStatus !== 'playing' || gameCompleted) return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const removeLetter = () => {
    if (gameStatus !== 'playing' || gameCompleted) return;
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const submitGuess = () => {
    if (gameStatus !== 'playing' || gameCompleted) return;
    
    console.log("Submitting guess:", currentGuess, "current attempt:", currentAttempt);
    
    if (currentGuess.length !== WORD_LENGTH) {
      toast({
        title: "Word too short",
        description: "Your guess must be 5 letters",
        variant: "destructive",
      });
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Update guesses array
    const newGuesses = [...guesses];
    newGuesses[currentAttempt] = currentGuess.toUpperCase();
    setGuesses(newGuesses);

    // Update letter states for keyboard
    const newLetterStates = { ...letterStates };
    const targetLetters = targetWord.split('');

    // First pass: mark correct positions
    currentGuess.toUpperCase().split('').forEach((letter, i) => {
      if (letter === targetWord[i]) {
        newLetterStates[letter] = 'correct';
        targetLetters[i] = '#'; // Mark as used
      }
    });

    // Second pass: mark present or absent letters
    currentGuess.toUpperCase().split('').forEach((letter, i) => {
      if (letter !== targetWord[i]) { // Skip already correct letters
        const remainingIndex = targetLetters.indexOf(letter);
        if (remainingIndex !== -1) {
          newLetterStates[letter] = 'present';
          targetLetters[remainingIndex] = '#'; // Mark as used
        } else if (newLetterStates[letter] !== 'correct' && newLetterStates[letter] !== 'present') {
          newLetterStates[letter] = 'absent';
        }
      }
    });

    setLetterStates(newLetterStates);

    // Check if won
    if (currentGuess.toUpperCase() === targetWord) {
      console.log("Game won!");
      setGameStatus('won');
      setGameCompleted(true);
      
      // Store game completion data
      const today = new Date().toLocaleDateString();
      localStorage.setItem('lastPlayedDate', today);
      localStorage.setItem('lastPlayedWord', targetWord);
      localStorage.setItem('gameStatus', 'won');
      localStorage.setItem('guesses', JSON.stringify(newGuesses));
      localStorage.setItem('currentAttempt', String(currentAttempt));
      localStorage.setItem('letterStates', JSON.stringify(newLetterStates));
      
      toast({
        title: "Praise God! You won!",
        description: `You discovered the word in ${currentAttempt + 1} ${currentAttempt === 0 ? 'try' : 'tries'}`,
      });
      onGameEnd(true, currentAttempt + 1);
    } else if (currentAttempt === MAX_ATTEMPTS - 1) {
      // Game over - lost
      console.log("Game lost!");
      setGameStatus('lost');
      setGameCompleted(true);
      
      // Store game completion data
      const today = new Date().toLocaleDateString();
      localStorage.setItem('lastPlayedDate', today);
      localStorage.setItem('lastPlayedWord', targetWord);
      localStorage.setItem('gameStatus', 'lost');
      localStorage.setItem('guesses', JSON.stringify(newGuesses));
      localStorage.setItem('currentAttempt', String(currentAttempt + 1));
      localStorage.setItem('letterStates', JSON.stringify(newLetterStates));
      
      toast({
        title: "Game Over",
        description: `The word was ${targetWord}`,
        variant: "destructive",
      });
      onGameEnd(false, MAX_ATTEMPTS);
    } else {
      // Move to next attempt
      console.log("Moving to next attempt:", currentAttempt + 1);
      setCurrentAttempt(currentAttempt + 1);
    }
    
    // Reset current guess for next row
    setCurrentGuess('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameStatus !== 'playing' || gameCompleted) return;
    
    if (e.key === 'Enter') {
      submitGuess();
    } else if (e.key === 'Backspace') {
      removeLetter();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      addLetter(e.key.toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, currentAttempt, gameStatus, gameCompleted]);

  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "00:00:00";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const shareResult = () => {
    // Create emoji grid
    let resultGrid = `BibleWordle ${new Date().toLocaleDateString()}\n`;
    resultGrid += `${gameStatus === 'won' ? currentAttempt + 1 : 'X'}/${MAX_ATTEMPTS}\n\n`;
    
    for (let i = 0; i <= Math.min(currentAttempt, MAX_ATTEMPTS - 1); i++) {
      const guess = guesses[i];
      let rowEmojis = '';
      
      guess.split('').forEach((letter, j) => {
        if (letter === targetWord[j]) {
          rowEmojis += '🟩'; // Correct
        } else if (targetWord.includes(letter)) {
          rowEmojis += '🟧'; // Present
        } else {
          rowEmojis += '⬛'; // Absent
        }
      });
      
      resultGrid += rowEmojis + '\n';
    }
    
    // Add app URL
    resultGrid += '\nhttps://biblewordle.com';
    
    // Copy to clipboard
    navigator.clipboard.writeText(resultGrid).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Share your results with others",
      });
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {gameCompleted ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center mb-4">
          <p className="text-lg font-medium mb-2">
            You've completed today's BibleWordle!
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Next word unlocks in <span className="font-bold text-techBrightTeal">{formatTimeRemaining(nextGameTime)}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={shareResult}
              className="bg-techBrightTeal hover:bg-techBrightTeal/90 flex items-center gap-2"
            >
              <Share className="w-4 h-4" />
              Share Results
            </Button>
            
            {!isLoggedIn && (
              <div className="flex justify-center mt-2 sm:mt-0">
                <SignInButton />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className={`flex flex-col items-center gap-1 ${isShaking ? 'animate-shake' : ''}`}>
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <WordRow 
                key={i} 
                word={i === currentAttempt ? currentGuess : guesses[i]} 
                targetWord={targetWord}
                isSubmitted={i < currentAttempt}
                isCurrentRow={i === currentAttempt}
              />
            ))}
          </div>
          
          <Keyboard
            onKeyPress={addLetter}
            onDelete={removeLetter}
            onEnter={submitGuess}
            letterStates={letterStates}
          />
        </>
      )}

      {gameStatus === 'lost' && (
        <div className="mt-4 text-center">
          <p className="text-xl">The word was: <span className="font-bold text-techBrightTeal">{targetWord}</span></p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
