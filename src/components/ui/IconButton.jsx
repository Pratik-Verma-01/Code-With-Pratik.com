import React from 'react';
import { cn } from '@utils/cn';
import Button from './Button';

const IconButton = React.forwardRef(({
  icon,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn("p-2 aspect-square", className)}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
