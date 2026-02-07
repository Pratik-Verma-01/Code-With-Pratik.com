import React, { useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@components/ui/Button';
import { useAuthContext } from '@contexts/AuthContext';
import { useToast } from '@hooks/useNotification';

const EmailVerificationBanner = () => {
  const { isEmailVerified, resendVerificationEmail } = useAuthContext();
  const [isVisible, setIsVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  if (isEmailVerified || !isVisible) return null;

  const handleResend = async () => {
    setIsSending(true);
    const result = await resendVerificationEmail();
    setIsSending(false);

    if (result.success) {
      toast.success('Verification email sent!');
    } else {
      toast.error(result.error || 'Failed to send email');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-yellow-500/10 border-b border-yellow-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
            <p className="text-sm text-yellow-200">
              Please verify your email address to access all features.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 h-8"
              onClick={handleResend}
              isLoading={isSending}
              leftIcon={<Send size={14} />}
            >
              Resend
            </Button>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="text-yellow-500/70 hover:text-yellow-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerificationBanner;
