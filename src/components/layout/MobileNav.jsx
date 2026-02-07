import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Bot, User } from 'lucide-react';
import { cn } from '@utils/cn';
import { ROUTES } from '@config/routes.config';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: ROUTES.DASHBOARD },
  { icon: Search, label: 'Explore', path: ROUTES.EXPLORE },
  { icon: PlusSquare, label: 'Create', path: ROUTES.UPLOAD_PROJECT, primary: true },
  { icon: Bot, label: 'AI', path: ROUTES.EXPLORE_AI },
  { icon: User, label: 'Profile', path: ROUTES.PROFILE },
];

const MobileNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-xl border-t border-white/10 lg:hidden safe-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center w-full h-full gap-1",
        isActive ? "text-neon-blue" : "text-dark-400"
      )}
    >
      {({ isActive }) => (
        <div className="relative flex flex-col items-center">
          {item.primary ? (
            <div className="absolute -top-8 p-3 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-sm text-white transform transition-transform active:scale-95">
              <item.icon size={24} />
            </div>
          ) : (
            <item.icon size={22} className={cn("transition-colors", isActive && "text-neon-blue")} />
          )}
          
          <span className={cn(
            "text-[10px] font-medium transition-opacity",
            item.primary ? "mt-4" : "",
            isActive ? "opacity-100" : "opacity-70"
          )}>
            {item.label}
          </span>
          
          {isActive && !item.primary && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute -top-2 w-1 h-1 rounded-full bg-neon-blue"
            />
          )}
        </div>
      )}
    </NavLink>
  );
};

export default MobileNav;
