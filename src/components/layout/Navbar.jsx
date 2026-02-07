import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@utils/cn';
import { useAuthContext } from '@contexts/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import NotificationBell from '@components/notifications/NotificationBell';
import { ROUTES } from '@config/routes.config';
import Button from '@components/ui/Button';

const Navbar = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-40 w-full h-16 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-dark-400 rounded-lg lg:hidden hover:bg-white/5 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="hidden text-lg font-bold font-display sm:block gradient-text">
              CODE-With-PRATIK
            </span>
          </Link>
        </div>

        {/* Center: Search (Dashboard only) or Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {!isDashboard && (
            <>
              <NavLink to={ROUTES.EXPLORE}>Explore</NavLink>
              <NavLink to={ROUTES.FEATURES}>Features</NavLink>
              <NavLink to={ROUTES.ABOUT}>About</NavLink>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="hidden sm:block h-6 w-px bg-white/10" />
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="hidden sm:block">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button size="sm" className="bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-neon-blue",
        isActive ? "text-neon-blue" : "text-dark-300"
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="h-0.5 bg-neon-blue mt-0.5 rounded-full"
        />
      )}
    </Link>
  );
};

export default Navbar;
