
// A list of 5-letter Christian/Bible-related terms
export const WORD_LIST = [
  "FAITH", "GRACE", "CROSS", "PSALM", "BIBLE",
  "JESUS", "GLORY", "CROWN", "LIGHT", "ANGEL",
  "MERCY", "PEACE", "BLESS", "SAINT", "JUDGE", 
  "HEART", "SPIRIT", "BLOOD", "DEVIL", "ALTAR", 
  "TRIAL", "WATER", "CLEAN", "SAVED", "PETER", 
  "DAVID", "JAMES", "MOSES", "ROBE", "PRAY", 
  "ACTS", "KING", "HOLY", "LOVE", "HOPE", 
  "WISE", "FEAR", "JOHN", "MARK", "LUKE", 
  "MARY", "BODY", "STAR"
];

// Daily word generator - you'd typically have a more sophisticated method
// that ensures each day has a specific word everyone plays
export const getTodaysWord = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return WORD_LIST[dayOfYear % WORD_LIST.length];
};

// Function to get a random word for practice mode
export const getRandomWord = (): string => {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
};

// Check if a word is in our list
export const isValidWord = (word: string): boolean => {
  return WORD_LIST.includes(word.toUpperCase());
};
