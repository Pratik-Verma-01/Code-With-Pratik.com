import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, signupSchema } from '../../lib/validators';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Mail, Lock, User, Github } from 'lucide-react';

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Forms
  const { register: regLogin, handleSubmit: handleLogin, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const { register: regSignup, handleSubmit: handleSignup, formState: { errors: signupErrors } } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onLogin = async (data) => {
    setIsLoading(true);
    try {
      await login(data.identifier, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials or account blocked.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.username, data.fullName);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use.');
      } else {
        toast.error('Signup failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google Sign In failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative perspective-1000">
      <motion.div
        layout
        className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Toggle Header */}
        <div className="flex bg-black/20 rounded-xl p-1 mb-8 relative">
          <motion.div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary/20 rounded-lg"
            animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-400'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${!isLogin ? 'text-white' : 'text-gray-400'}`}>
            Sign Up
          </button>
        </div>

        <AnimatePresence mode='wait'>
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin(onLogin)}
              className="space-y-4"
            >
              <Input 
                label="Email" 
                placeholder="you@example.com" 
                {...regLogin('identifier')} 
                error={loginErrors.identifier?.message}
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                {...regLogin('password')} 
                error={loginErrors.password?.message}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Login
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSignup(onSignup)}
              className="space-y-4"
            >
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                {...regSignup('fullName')} 
                error={signupErrors.fullName?.message}
              />
              <Input 
                label="Username" 
                placeholder="johndoe_dev" 
                {...regSignup('username')} 
                error={signupErrors.username?.message}
              />
              <Input 
                label="Email" 
                type="email" 
                placeholder="you@example.com" 
                {...regSignup('email')} 
                error={signupErrors.email?.message}
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="Min 8 chars" 
                {...regSignup('password')} 
                error={signupErrors.password?.message}
              />
              <Button type="submit" className="w-full" variant="secondary" isLoading={isLoading}>
                Create Account
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#1e293b] text-gray-400">Or continue with</span></div>
        </div>

        <button 
          onClick={onGoogle}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
      </motion.div>
    </div>
  );
}
