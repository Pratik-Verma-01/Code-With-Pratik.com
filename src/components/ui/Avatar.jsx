import React, { useState } from 'react';
import { cn } from '@utils/cn';
import { getInitials, stringToColor } from '@utils/helpers';

const Avatar = ({
  src,
  alt,
  size = 'md', // sm, md, lg, xl, 2xl
  className,
  bordered = false,
  status, // online, offline, busy, away
  ...props
}) => {
  const [error, setError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const fallbackColor = stringToColor(alt || 'User');

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center select-none font-bold text-white relative",
          sizes[size],
          bordered && "ring-2 ring-dark-900",
          !src || error ? "" : "bg-dark-800"
        )}
        style={!src || error ? { backgroundColor: fallbackColor } : {}}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(alt)}</span>
        )}
      </div>

      {status && (
        <div
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-dark-950",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
