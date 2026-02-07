import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from './Logo';
import { ROUTES } from '@config/routes.config';
import ParticleBackground from '@components/effects/ParticleBackground';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 relative overflow-hidden">
      {/* Background Effects */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-30" />
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="mb-8 flex flex-col items-center gap-2 group">
          <Logo size="lg" animated />
          <span className="text-2xl font-bold font-display gradient-text">
            CODE-With-PRATIK
          </span>
        </Link>

        {/* Content */}
        <div className="w-full">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-dark-500 text-center">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-neon-blue hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-neon-blue hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
