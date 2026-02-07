import React from 'react';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import PointsDisplay from '@components/rewards/PointsDisplay';
import RewardsHistory from '@components/rewards/RewardsHistory';
import AchievementBadge from '@components/rewards/AchievementBadge';
import { useRewardsData } from '@hooks/useRewards';
import { USER_LEVELS } from '@config/app.config';
import { Trophy } from 'lucide-react';

const Rewards = () => {
  const { points, level, rewards, isLoading } = useRewardsData();

  return (
    <PageContainer>
      <PageHeader
        title="Rewards & Points"
        description="Track your progress and achievements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Points Overview */}
        <div className="space-y-8">
          <PointsDisplay 
            points={points} 
            level={level} 
            isLoading={isLoading} 
          />

          {/* Next Milestone */}
          {level.nextLevel && (
            <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-yellow-500" size={24} />
                <h3 className="text-lg font-semibold text-white">Next Level</h3>
              </div>
              <p className="text-dark-300 mb-4">
                Earn <span className="text-neon-blue font-bold">{level.pointsToNextLevel}</span> more points to reach <span className="text-white font-bold">{level.nextLevel.name}</span> status.
              </p>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
              <p className="text-right text-xs text-dark-400 mt-2">{level.progressPercent}% Completed</p>
            </div>
          )}
        </div>

        {/* Right Column: History & Badges */}
        <div className="lg:col-span-2 space-y-8">
          {/* Badges */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Level Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {USER_LEVELS.map((lvl) => (
                <AchievementBadge 
                  key={lvl.name} 
                  level={lvl} 
                  currentPoints={points} 
                />
              ))}
            </div>
          </section>

          {/* History */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Points History</h2>
            <RewardsHistory history={rewards} isLoading={isLoading} />
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Rewards;
