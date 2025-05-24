
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GameStats } from '@/data/achievements';
import { toast } from '@/components/ui/use-toast';
import GameplayPreview from '@/components/GameplayPreview';
import Testimonials from '@/components/Testimonials';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const Index = () => {
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.stats) {
            setStats(userData.stats);
          } else {
            // User exists but no stats yet
            await setDoc(userDocRef, { stats: defaultStats }, { merge: true });
          }
        } else {
          // New user
          await setDoc(userDocRef, { 
            stats: defaultStats,
            createdAt: new Date(),
            email: user.email,
            username: user.displayName || user.email?.split('@')[0] || 'Faithful Player',
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        toast({
          title: "Error",
          description: "Failed to load your game stats",
          variant: "destructive",
        });
      }
    };

    fetchUserStats();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-faithGold/10 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <NavBar 
        stats={stats} 
        isLoggedIn={!!user}
        username={user?.displayName || user?.email?.split('@')[0]}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-faith animate-float dark:text-white">
            BibleWordle
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl dark:text-gray-300">
            Test your knowledge of Biblical terms in this faith-inspired word game
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-cta hover:opacity-90 text-white relative overflow-hidden group"
              asChild
            >
              <Link to="/play" className="relative z-10 flex items-center">
                Play Now
                <span className="ml-2">➔</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_forwards]"></span>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-faithPurple text-faithPurple hover:bg-faithPurple/5 dark:border-faithPurple/70 dark:text-faithPurple/90"
              asChild
            >
              <Link to="/leaderboard" className="flex items-center">
                Leaderboard
                <span className="ml-2">🏆</span>
              </Link>
            </Button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="feature-card flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="text-4xl mb-4 animate-pulse-soft">📖</div>
              <h2 className="text-xl font-bold mb-2 dark:text-white">Biblical Words</h2>
              <p className="text-gray-600 text-center dark:text-gray-300">
                Challenge yourself with words from the Bible and Christian heritage
              </p>
            </div>
            
            <div className="feature-card flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="text-4xl mb-4 animate-pulse-soft">🏆</div>
              <h2 className="text-xl font-bold mb-2 dark:text-white">Achievements</h2>
              <p className="text-gray-600 text-center dark:text-gray-300">
                Earn special badges as you improve your guessing skills
              </p>
            </div>
            
            <div className="feature-card flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="text-4xl mb-4 animate-pulse-soft">🔥</div>
              <h2 className="text-xl font-bold mb-2 dark:text-white">Leaderboards</h2>
              <p className="text-gray-600 text-center dark:text-gray-300">
                Compete with others and see who has the most Biblical knowledge
              </p>
            </div>
          </div>
        </div>
        
        {/* Game Preview Carousel */}
        <GameplayPreview />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* CTA Section */}
        <div className="my-16 text-center py-12 px-4 bg-gradient-to-r from-techTeal/10 to-techBrightTeal/10 rounded-2xl border border-techTeal/20 dark:from-techTeal/5 dark:to-techBrightTeal/5 dark:border-techTeal/10">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Ready to Challenge Yourself?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto dark:text-gray-300">
            Join thousands of players testing their Biblical knowledge daily with BibleWordle.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-tech hover:opacity-90 text-white animate-pulse-soft"
            asChild
          >
            <Link to="/play">Start Playing Now</Link>
          </Button>
        </div>
        
        {/* Scripture Quote */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-2 dark:text-gray-400">
            "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus."
          </p>
          <p className="text-gray-600 font-semibold dark:text-gray-300">- Colossians 3:17</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
