
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { GameStats, ACHIEVEMENTS, getUnlockedAchievements } from '@/data/achievements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Award } from 'lucide-react';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [unlockedAchievements, setUnlockedAchievements] = useState<typeof ACHIEVEMENTS>([]);
  const [userSince, setUserSince] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.stats) {
            setStats(userData.stats);
            setUnlockedAchievements(getUnlockedAchievements(userData.stats));
          }
          
          if (userData.createdAt) {
            setUserSince(userData.createdAt.toDate());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-techBrightTeal" />
        <p className="mt-4 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar 
        stats={stats} 
        isLoggedIn={!!user}
        username={user?.displayName || user?.email?.split('@')[0]}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">Player Profile</CardTitle>
              <CardDescription>
                {user?.email} | Member since {userSince?.toLocaleDateString() || 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user?.displayName || user?.email}`}
                  alt="Profile" 
                  className="h-20 w-20 rounded-full bg-gray-100"
                />
                <div>
                  <h2 className="text-xl font-bold">{user?.displayName || user?.email?.split('@')[0] || 'Faithful Player'}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
              <CardDescription>Your BibleWordle performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-techBrightTeal">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Games Played</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-techBrightTeal">
                    {stats.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Win Rate</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-techBrightTeal">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-techBrightTeal">{stats.maxStreak}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Max Streak</div>
                </div>
              </div>
              
              {stats.fastestWin && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fastest win: <span className="font-bold text-techBrightTeal">{stats.fastestWin}</span> attempts</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Showcasing your biblical knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              {unlockedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {unlockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Award className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Complete games to unlock achievements</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Guess Distribution</CardTitle>
              <CardDescription>How many guesses you typically need</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.gamesWon > 0 ? (
                <div className="space-y-2">
                  {stats.guessDistribution.map((count, index) => {
                    const percentage = stats.gamesWon ? Math.max((count / stats.gamesWon) * 100, 0) : 0;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 text-right">{index + 1}</div>
                        <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                          <div 
                            className="h-full bg-techBrightTeal flex items-center justify-end px-2 text-xs text-white"
                            style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                          >
                            {count > 0 ? count : ''}
                          </div>
                        </div>
                        <div className="w-8 text-left text-xs text-gray-500">{percentage.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Complete games to see your guess distribution
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
