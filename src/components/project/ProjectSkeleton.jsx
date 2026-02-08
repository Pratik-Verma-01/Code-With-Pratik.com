import React from 'react';
import Skeleton from '@components/ui/Skeleton';
import { cn } from '@utils/cn';

const ProjectSkeleton = ({ layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="flex flex-col sm:flex-row bg-dark-800/30 border border-white/5 rounded-xl overflow-hidden h-auto sm:h-32">
        <Skeleton variant="rectangular" className="sm:w-48 h-32 sm:h-full" />
        <div className="flex-1 p-4 flex flex-col justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="w-1/3 h-5" />
            <Skeleton className="w-2/3 h-4" />
          </div>
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="w-24 h-4" />
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-dark-800/30 overflow-hidden h-[340px] flex flex-col">
      <Skeleton variant="rectangular" className="w-full h-44" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start">
          <Skeleton className="w-2/3 h-6" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-4" />
        
        <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
