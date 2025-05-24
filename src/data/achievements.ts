
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastCompletedAt?: string;
  guessDistribution: number[];
  fastestWin?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    condition: (stats) => stats.gamesWon >= 1
  },
  {
    id: 'faithful_player',
    title: 'Faithful Player',
    description: 'Play 5 games',
    icon: '✝️',
    condition: (stats) => stats.gamesPlayed >= 5
  },
  {
    id: 'wisdom_seeker',
    title: 'Wisdom Seeker',
    description: 'Win 3 games',
    icon: '📖',
    condition: (stats) => stats.gamesWon >= 3
  },
  {
    id: 'blessed_streak',
    title: 'Blessed Streak',
    description: 'Get a streak of 3 wins',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'revelation',
    title: 'Revelation',
    description: 'Win a game in 3 or fewer tries',
    icon: '⚡',
    condition: (stats) => {
      for (let i = 0; i <= 2; i++) {
        if (stats.guessDistribution[i] > 0) {
          return true;
        }
      }
      return false;
    }
  },
  {
    id: 'disciple',
    title: 'Disciple',
    description: 'Win 12 games',
    icon: '👑',
    condition: (stats) => stats.gamesWon >= 12
  },
];

export const getUnlockedAchievements = (stats: GameStats): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
};

export const getNewAchievements = (
  oldStats: GameStats, 
  newStats: GameStats
): Achievement[] => {
  const oldUnlocked = new Set(getUnlockedAchievements(oldStats).map(a => a.id));
  const newUnlocked = getUnlockedAchievements(newStats);
  
  return newUnlocked.filter(a => !oldUnlocked.has(a.id));
};
