import React from 'react';
import { cn } from '@utils/cn';

const Skeleton = ({ className, variant = 'text', width, height, ...props }) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-dark-800/50",
        variants[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/5 bg-dark-800/30 p-4 h-[320px] flex flex-col gap-4">
    <Skeleton variant="rectangular" className="w-full h-40" />
    <div className="space-y-2">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-4" />
    </div>
    <div className="mt-auto flex justify-between items-center">
      <div className="flex gap-2">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton className="w-20 h-4 self-center" />
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
