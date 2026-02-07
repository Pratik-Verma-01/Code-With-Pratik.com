import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import GoogleAuthButton from './GoogleAuthButton';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import { useToast } from '@hooks/useNotification';

const schema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

const LoginForm = () => {
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await signIn({
        emailOrUsername: data.email,
        password: data.password,
      });

      if (result.success) {
        toast.success('Welcome back! 👋');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email or Username"
        placeholder="john@example.com"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-1">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link 
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-neon-blue hover:text-neon-purple transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
        className="mt-6"
      >
        Sign In
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0F1115] text-dark-400">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton />
    </form>
  );
};

export default LoginForm;
