
import React from 'react';
import { Achievement } from '@/data/achievements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface AchievementsPanelProps {
  achievements: Achievement[];
  unlockedAchievementIds: string[];
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ 
  achievements, 
  unlockedAchievementIds 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="text-yellow-500" />
          Achievements
        </CardTitle>
        <CardDescription>
          Track your spiritual journey through the game
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievementIds.includes(achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isUnlocked 
                  ? 'bg-gradient-to-r from-faithPurple/10 to-faithLavender/10 border-faithPurple/30' 
                  : 'bg-gray-100 border-gray-200'
              }`}
            >
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  {isUnlocked && (
                    <Badge variant="secondary" className="bg-faithLavender text-faithPurple">
                      Unlocked
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;
