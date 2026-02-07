import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden",
        isActive 
          ? "text-white bg-white/5 border border-white/5" 
          : "text-dark-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/5 border border-transparent"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-blue to-neon-purple"
            />
          )}
          
          <Icon 
            size={20} 
            className={cn(
              "transition-colors",
              isActive ? "text-neon-blue" : "text-dark-500 group-hover:text-white"
            )} 
          />
          
          <span className="font-medium text-sm flex-1">{label}</span>
          
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-neon-purple/20 text-neon-purple">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarLink;
