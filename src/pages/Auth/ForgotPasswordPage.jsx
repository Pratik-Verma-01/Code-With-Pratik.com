import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import { useToast } from '@hooks/useNotification';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuthContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await resetPassword(data.email);
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      toast.success('Password reset email sent');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
          >
            <CheckCircle size={32} />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
          <p className="text-dark-400 mb-8">
            We've sent a password reset link to your email address. Please follow the instructions to reset your password.
          </p>
          
          <Link to={`${ROUTES.AUTH}?mode=login`}>
            <Button variant="outline" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
        
        <Link 
          to={`${ROUTES.AUTH}?mode=login`}
          className="inline-flex items-center text-sm text-dark-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <h1 className="text-2xl font-bold font-display text-white mb-2">
          Forgot Password?
        </h1>
        <p className="text-dark-400 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            leftIcon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            className="bg-gradient-to-r from-neon-blue to-neon-purple"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
