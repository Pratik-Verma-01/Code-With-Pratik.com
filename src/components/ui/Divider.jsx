import React from 'react';
import { cn } from '@utils/cn';

const Divider = ({ className, label, ...props }) => {
  if (label) {
    return (
      <div className={cn("relative flex items-center w-full my-6", className)} {...props}>
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink-0 mx-4 text-xs font-medium text-dark-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>
    );
  }

  return (
    <hr className={cn("border-t border-white/10 my-4", className)} {...props} />
  );
};

export default Divider;
