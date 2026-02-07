import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@lib/firebase';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { useToast } from '@hooks/useNotification';
import { ROUTES } from '@config/routes.config';
import PasswordStrength from '@components/auth/PasswordStrength';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const oobCode = searchParams.get('oobCode');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!oobCode) {
      toast.error('Invalid reset code');
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      toast.success('Password reset successfully');
      navigate(`${ROUTES.AUTH}?mode=login`);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
        <p className="text-dark-400">This password reset link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold font-display text-white mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          
          {password && <PasswordStrength password={password} />}

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            className="bg-gradient-to-r from-neon-blue to-neon-purple"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
