
import React from 'react';

interface KeyboardProps {
  onKeyPress: (letter: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStates: Record<string, 'correct' | 'present' | 'absent' | undefined>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onDelete, onEnter, letterStates }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  const getKeyClass = (key: string) => {
    const baseClass = "keyboard-key cursor-pointer select-none";
    const widthClass = key === "ENTER" || key === "DEL" ? "px-2 md:px-3" : "min-w-[2rem] md:min-w-[2.5rem]";
    
    if (key === "ENTER" || key === "DEL") {
      return `${baseClass} ${widthClass} bg-gray-400 text-white hover:bg-gray-500`;
    }
    
    const letterState = letterStates[key];
    
    if (letterState === 'correct') {
      return `${baseClass} ${widthClass} bg-green-500 text-white`;
    } else if (letterState === 'present') {
      return `${baseClass} ${widthClass} bg-yellow-500 text-white`;
    } else if (letterState === 'absent') {
      return `${baseClass} ${widthClass} bg-gray-500 text-white`;
    }
    
    return `${baseClass} ${widthClass} bg-gray-200 hover:bg-gray-300`;
  };

  const handleKeyPress = (key: string) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DEL') {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full max-w-md">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
