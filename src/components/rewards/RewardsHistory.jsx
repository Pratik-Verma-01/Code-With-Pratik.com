import React from 'react';
import { motion } from 'framer-motion';
import HistoryItem from './HistoryItem';
import EmptyState from '@components/ui/EmptyState';
import Skeleton from '@components/ui/Skeleton';
import { History } from 'lucide-react';

const RewardsHistory = ({ history = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <div>
                <Skeleton width={120} height={16} className="mb-2" />
                <Skeleton width={80} height={12} />
              </div>
            </div>
            <Skeleton width={50} height={20} />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState
        icon={<History />}
        title="No History"
        description="You haven't earned any points yet. Start contributing!"
        className="min-h-[200px]"
      />
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <HistoryItem item={item} />
        </motion.div>
      ))}
    </div>
  );
};

export default RewardsHistory;
