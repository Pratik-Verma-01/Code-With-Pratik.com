import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Upload, 
  Folder, 
  Bot, 
  Gift, 
  Settings, 
  Bell, 
  User 
} from 'lucide-react';
import { cn } from '@utils/cn';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';
import { useIsMobile } from '@hooks/useMediaQuery';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: Upload, label: 'Upload Project', path: ROUTES.UPLOAD_PROJECT },
  { icon: Folder, label: 'My Projects', path: ROUTES.MY_PROJECTS },
  { icon: Bot, label: 'Explore AI', path: ROUTES.EXPLORE_AI },
  { icon: Gift, label: 'Rewards', path: ROUTES.REWARDS },
];

const SECONDARY_ITEMS = [
  { icon: User, label: 'Profile', path: ROUTES.PROFILE },
  { icon: Bell, label: 'Notifications', path: ROUTES.NOTIFICATIONS },
  { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS },
];

const Sidebar = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile();
  const { totalPoints } = useAuthContext();

  const sidebarClasses = cn(
    "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-dark-900 border-r border-white/5 overflow-y-auto custom-scrollbar z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] w-64",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full p-4">
          
          {/* Points Card */}
          <div className="p-4 mb-6 rounded-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-1">Total Points</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white font-display">{totalPoints}</span>
                <span className="text-xs text-neon-blue">XP</span>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="space-y-1 mb-8">
            <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Menu</p>
            {MENU_ITEMS.map((item) => (
              <SidebarItem key={item.path} item={item} onClick={isMobile ? onClose : undefined} />
            ))}
          </div>

          {/* Secondary Menu */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Account</p>
            {SECONDARY_ITEMS.map((item) => (
              <SidebarItem key={item.path} item={item} onClick={isMobile ? onClose : undefined} />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-xs text-center text-dark-500">
              © 2024 CODE-With-PRATIK
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ item, onClick }) => {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
        isActive 
          ? "text-white bg-white/5 border border-white/5 shadow-inner" 
          : "text-dark-400 hover:text-white hover:bg-white/5"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 w-1 h-full bg-neon-blue rounded-r-full"
            />
          )}
          <item.icon 
            size={20} 
            className={cn(
              "transition-colors",
              isActive ? "text-neon-blue" : "text-dark-500 group-hover:text-white"
            )} 
          />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;
