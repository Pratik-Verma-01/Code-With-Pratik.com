import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Code2, User, LogOut, Upload, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { currentUser, logout, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';
  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              CODE<span className="text-primary">-</span>WITH<span className="text-secondary">-</span>PRATIK
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Explore</Link>
            
            {currentUser ? (
              <>
                <Link to="/upload">
                  <Button variant="outline" className="py-2 px-4 text-sm">
                    <Upload className="w-4 h-4" /> Upload
                  </Button>
                </Link>
                
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white">{userProfile?.username}</p>
                    <p className="text-xs text-primary">{userProfile?.points || 0} XP</p>
                  </div>
                  <Link to="/dashboard">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                      <img 
                        src={userProfile?.photoURL || currentUser.photoURL} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-2 border-[#0f172a]"
                      />
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login / Join</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f172a] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-300">Explore</Link>
              {currentUser ? (
                <>
                  <Link to="/upload" onClick={() => setIsOpen(false)} className="block text-gray-300">Upload Project</Link>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-gray-300">Dashboard</Link>
                  <button onClick={logout} className="flex items-center gap-2 text-red-400 w-full text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
