
import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  gamesWon: number;
  maxStreak: number;
  averageTries: number;
}

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const leaderboardQuery = query(
          collection(db, 'users'),
          orderBy('gamesWon', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboardData: LeaderboardEntry[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            id: doc.id,
            username: data.username || 'Anonymous Player',
            gamesWon: data.gamesWon || 0,
            maxStreak: data.maxStreak || 0,
            averageTries: data.averageTries || 0,
          });
        });
        
        setLeaders(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Faith Leaders
        </CardTitle>
        <CardDescription>
          Top players in BibleWordle
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leaderboard data yet. Be the first!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Player</th>
                  <th className="text-right py-2">Wins</th>
                  <th className="text-right py-2">Best Streak</th>
                  <th className="text-right py-2">Avg. Tries</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => (
                  <tr key={leader.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td className="py-3 font-medium">{leader.username}</td>
                    <td className="py-3 text-right">{leader.gamesWon}</td>
                    <td className="py-3 text-right">{leader.maxStreak}</td>
                    <td className="py-3 text-right">
                      {leader.averageTries.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
