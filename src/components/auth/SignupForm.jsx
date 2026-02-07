import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, AtSign } from 'lucide-react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import GoogleAuthButton from './GoogleAuthButton';
import PasswordStrength from './PasswordStrength';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import { useToast } from '@hooks/useNotification';
import { useUsernameAvailability } from '@hooks/useUser';
import { useDebounce } from '@hooks/useDebounce';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const SignupForm = () => {
  const { signUp } = useAuthContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const username = watch('username');
  const password = watch('password');
  const debouncedUsername = useDebounce(username, 500);

  // Check username availability
  const { isAvailable, isChecking, isError } = useUsernameAvailability(debouncedUsername);

  const onSubmit = async (data) => {
    if (isChecking || (debouncedUsername && isAvailable === false)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        username: data.username,
      });

      if (result.success) {
        toast.success('Account created successfully! 🎉');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        leftIcon={<User size={18} />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <div className="relative">
        <Input
          label="Username"
          placeholder="johndoe"
          leftIcon={<AtSign size={18} />}
          error={errors.username?.message}
          {...register('username')}
          className={
            !errors.username && debouncedUsername && isAvailable === true
              ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
              : !errors.username && debouncedUsername && isAvailable === false
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : ""
          }
        />
        {debouncedUsername && !errors.username && (
          <div className="absolute right-3 top-[38px] text-xs">
            {isChecking ? (
              <span className="text-dark-400">Checking...</span>
            ) : isAvailable ? (
              <span className="text-green-500">Available</span>
            ) : (
              <span className="text-red-500">Taken</span>
            )}
          </div>
        )}
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />
        {password && <PasswordStrength password={password} />}
      </div>

      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
        isDisabled={isChecking || (debouncedUsername && isAvailable === false)}
        className="mt-4"
      >
        Create Account
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0F1115] text-dark-400">Or sign up with</span>
        </div>
      </div>

      <GoogleAuthButton isSignup />
    </form>
  );
};

export default SignupForm;
