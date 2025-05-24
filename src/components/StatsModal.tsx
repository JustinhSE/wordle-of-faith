
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GameStats } from '@/data/achievements';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: GameStats;
  isLoggedIn?: boolean;
  onSignInClick?: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ 
  open, 
  onOpenChange, 
  stats, 
  isLoggedIn = true,
  onSignInClick
}) => {
  // Calculate win percentage
  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  // Find the max in distribution to scale the bars
  const maxInDistribution = Math.max(...stats.guessDistribution, 1);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Statistics</DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Sign in to save your statistics across devices
            </p>
            <Button 
              onClick={onSignInClick}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-3 py-4 text-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.gamesPlayed}</span>
            <span className="text-xs">Played</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{winPercentage}</span>
            <span className="text-xs">Win %</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.currentStreak}</span>
            <span className="text-xs">Current Streak</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.maxStreak}</span>
            <span className="text-xs">Max Streak</span>
          </div>
        </div>
        
        <div className="py-2">
          <h3 className="text-lg font-medium mb-2">Guess Distribution</h3>
          <div className="space-y-1">
            {stats.guessDistribution.map((count, index) => (
              <div key={index} className="flex items-center">
                <div className="w-4 text-right mr-2">{index + 1}</div>
                <div 
                  className={`h-5 flex items-center justify-end px-2 text-sm font-medium text-white ${
                    count > 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${Math.max((count / maxInDistribution) * 100, 8)}%` }}
                >
                  {count > 0 ? count : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
