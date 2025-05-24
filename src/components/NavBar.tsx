
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SignInButton } from './SignInButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StatsModal from './StatsModal';
import { Award, HelpCircle, User } from 'lucide-react';
import { GameStats } from '@/data/achievements';
import DarkModeToggle from './DarkModeToggle';

interface NavBarProps {
  stats: GameStats;
  isLoggedIn: boolean;
  username?: string;
  onSignOut?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ stats, isLoggedIn, username, onSignOut }) => {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-faith">
            BibleWordle
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <DarkModeToggle />

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsStatsOpen(true)}
            aria-label="Statistics"
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          >
            <Award className="h-5 w-5" />
          </Button>
          
          <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Help"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle>How to Play</DialogTitle>
                <DialogDescription>
                  Guess the Word in 6 tries.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
                <p className="mb-2">After each guess, the color of the tiles will change to show how close your guess was to the word:</p>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500"></div>
                    <span>The letter is in the word and in the correct spot.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500"></div>
                    <span>The letter is in the word but in the wrong spot.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-500"></div>
                    <span>The letter is not in the word in any spot.</span>
                  </div>
                </div>
                <p className="font-medium">BibleWordle features words related to the Bible and Christian faith.</p>
              </div>
            </DialogContent>
          </Dialog>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 bg-white dark:bg-gray-700"
                asChild
              >
                <Link to="/profile">
                  <User className="h-4 w-4 mr-1" />
                  {username || 'Profile'}
                </Link>
              </Button>
              {onSignOut && (
                <Button variant="ghost" onClick={onSignOut} size="sm" className="bg-white/80 dark:bg-gray-700/80">
                  Sign Out
                </Button>
              )}
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
      
      <StatsModal 
        open={isStatsOpen}
        onOpenChange={setIsStatsOpen}
        stats={stats}
      />
    </header>
  );
};

export default NavBar;
