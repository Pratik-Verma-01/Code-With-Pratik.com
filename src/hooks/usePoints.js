import { useAuth } from '../context/AuthContext';

export function usePoints() {
  const { userProfile } = useAuth();

  const points = userProfile?.points || 0;

  // Level Logic
  const getLevel = () => {
    if (points < 100) return { name: 'Novice', color: 'text-gray-400' };
    if (points < 500) return { name: 'Coder', color: 'text-primary' };
    if (points < 1000) return { name: 'Hacker', color: 'text-secondary' };
    return { name: 'Grandmaster', color: 'text-yellow-400' };
  };

  const level = getLevel();
  
  // Calculate progress to next level
  const nextLevelThreshold = 
    points < 100 ? 100 : 
    points < 500 ? 500 : 
    1000;
  
  const progressPercent = Math.min(100, (points / nextLevelThreshold) * 100);

  return {
    points,
    level,
    progressPercent
  };
}
