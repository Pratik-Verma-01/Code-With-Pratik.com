import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthToggle from '@components/auth/AuthToggle';
import LoginForm from '@components/auth/LoginForm';
import SignupForm from '@components/auth/SignupForm';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  
  // 'login' or 'signup'
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'signup' || queryMode === 'login') {
      setMode(queryMode);
    }
  }, [searchParams]);

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    navigate(`${ROUTES.AUTH}?mode=${newMode}`, { replace: true });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-blue/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-dark-400">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Join the community of developers today'}
            </p>
          </div>

          <AuthToggle mode={mode} onToggle={toggleMode} />

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignupForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
