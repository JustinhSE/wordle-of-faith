
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import GameBoard from '@/components/GameBoard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { GameStats, getNewAchievements, getUnlockedAchievements } from '@/data/achievements';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const PlayPage = () => {
  const [user, loading] = useAuthState(auth);
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.stats) {
            console.log("Loaded user stats:", userData.stats);
            setStats(userData.stats);
            // Calculate unlocked achievements
            const unlocked = getUnlockedAchievements(userData.stats);
            setUnlockedAchievementIds(unlocked.map(a => a.id));
          } else {
            // User exists but no stats yet
            await setDoc(userDocRef, { stats: defaultStats }, { merge: true });
            console.log("Created default stats for existing user");
          }
        } else {
          // New user
          await setDoc(userDocRef, { 
            stats: defaultStats,
            createdAt: serverTimestamp(),
            email: user.email,
            username: user.displayName || user.email?.split('@')[0] || 'Faithful Player',
          });
          console.log("Created new user with default stats");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your game data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user]);

  const handleGameEnd = async (won: boolean, attempts: number) => {
    if (!user) {
      // Prompt guest users to sign in to save progress
      toast({
        title: "Sign in to save progress",
        description: "Create an account to track your achievements and join the leaderboard",
        action: (
          <Button onClick={() => {
            const signInBtn = document.querySelector('[aria-label="Sign In"]') as HTMLButtonElement;
            if (signInBtn) signInBtn.click();
          }} variant="outline">
            Sign In
          </Button>
        ),
      });
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Copy the current stats to calculate new achievements
      const oldStats = { ...stats };
      
      // Update stats
      const newStats: GameStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        lastCompletedAt: new Date().toISOString(),
      };
      
      if (won) {
        newStats.gamesWon = stats.gamesWon + 1;
        newStats.currentStreak = stats.currentStreak + 1;
        newStats.maxStreak = Math.max(stats.maxStreak, newStats.currentStreak);
        
        // Update guess distribution (attempts is 1-based)
        const newDist = [...stats.guessDistribution];
        newDist[attempts - 1] = newDist[attempts - 1] + 1;
        newStats.guessDistribution = newDist;
        
        // Track fastest win
        if (!stats.fastestWin || attempts < stats.fastestWin) {
          newStats.fastestWin = attempts;
        }
      } else {
        // Lost, reset streak
        newStats.currentStreak = 0;
      }
      
      // Calculate average tries
      const totalGuesses = newStats.guessDistribution.reduce(
        (sum, count, index) => sum + count * (index + 1), 0
      );
      const averageTries = newStats.gamesWon > 0 
        ? totalGuesses / newStats.gamesWon 
        : 0;
      
      console.log("Updating user stats:", newStats);
      
      // Update Firestore
      await updateDoc(userDocRef, {
        'stats': newStats,
        'gamesPlayed': newStats.gamesPlayed,
        'gamesWon': newStats.gamesWon,
        'maxStreak': newStats.maxStreak,
        'averageTries': averageTries,
        'lastPlayedAt': serverTimestamp()
      });
      
      // Check for newly unlocked achievements
      const newAchievements = getNewAchievements(oldStats, newStats);
      if (newAchievements.length > 0) {
        // Update local state
        setUnlockedAchievementIds([...unlockedAchievementIds, ...newAchievements.map(a => a.id)]);
        
        // Show achievement notifications
        newAchievements.forEach(achievement => {
          toast({
            title: "New Achievement Unlocked!",
            description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
            className: "bg-gradient-to-r from-techBrightTeal to-techTeal border-techTeal text-white",
          });
        });
      }
      
      // Update local stats state
      setStats(newStats);
      
    } catch (error) {
      console.error("Error updating game stats:", error);
      toast({
        title: "Error",
        description: "Failed to update your game stats",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar 
        stats={stats} 
        isLoggedIn={!!user}
        username={user?.displayName || user?.email?.split('@')[0]}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-faith">
            Today's Word
          </h1>
          
          <GameBoard 
            onGameEnd={handleGameEnd}
            isLoggedIn={!!user}
          />
        </div>
      </main>
    </div>
  );
};

export default PlayPage;
