import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@hooks/useTheme';
import { cn } from '@utils/cn';
import Dropdown, { DropdownItem } from '@components/ui/Dropdown';

const ThemeToggle = () => {
  const { theme, setTheme, isDark } = useTheme();

  const icon = isDark ? <Moon size={20} /> : <Sun size={20} />;

  return (
    <Dropdown
      trigger={
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "bg-white/5 hover:bg-white/10 text-dark-300 hover:text-white border border-white/5"
          )}
          aria-label="Toggle Theme"
        >
          {icon}
        </motion.button>
      }
      width="w-40"
    >
      <DropdownItem
        onClick={() => setTheme('light')}
        icon={<Sun size={16} />}
        className={cn(theme === 'light' && "text-neon-blue bg-neon-blue/5")}
      >
        Light
      </DropdownItem>
      <DropdownItem
        onClick={() => setTheme('dark')}
        icon={<Moon size={16} />}
        className={cn(theme === 'dark' && "text-neon-blue bg-neon-blue/5")}
      >
        Dark
      </DropdownItem>
      <DropdownItem
        onClick={() => setTheme('system')}
        icon={<Monitor size={16} />}
        className={cn(theme === 'system' && "text-neon-blue bg-neon-blue/5")}
      >
        System
      </DropdownItem>
    </Dropdown>
  );
};

export default ThemeToggle;
