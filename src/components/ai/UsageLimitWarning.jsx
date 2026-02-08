import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '@components/ui/Button';

const UsageLimitWarning = ({ onUpgrade }) => {
  return (
    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-yellow-500 mb-1">
            Usage Limit Reached
          </h4>
          <p className="text-xs text-yellow-200/80 mb-3">
            You've reached your daily AI interaction limit. Upgrade to Pro for unlimited chats with Nova.
          </p>
          <Button 
            size="sm" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black border-none"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitWarning;
