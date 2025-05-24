
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Leaderboard from '@/components/Leaderboard';
import AchievementsPanel from '@/components/AchievementsPanel';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ACHIEVEMENTS, GameStats } from '@/data/achievements';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const LeaderboardPage = () => {
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().stats) {
          const userData = userDoc.data();
          setStats(userData.stats);
          
          // Calculate unlocked achievements
          const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
            achievement.condition(userData.stats)
          );
          setUnlockedAchievementIds(unlockedAchievements.map(a => a.id));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your achievements",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user]);

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
        <Tabs defaultValue="leaderboard" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="leaderboard" className="mt-0">
            <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-faith">
              Top Faithful Players
            </h1>
            <Leaderboard />
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-0">
            <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-faith">
              Achievements
            </h1>
            <AchievementsPanel 
              achievements={ACHIEVEMENTS}
              unlockedAchievementIds={unlockedAchievementIds}
            />
            
            {!user && (
              <div className="mt-8 p-4 text-center bg-gray-100 rounded-lg">
                <p className="text-gray-600">Sign in to track your achievements and compete on the leaderboard</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LeaderboardPage;
