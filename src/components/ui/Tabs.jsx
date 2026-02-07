import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const Tabs = ({
  tabs = [], // [{ id, label, icon, content }]
  defaultTab,
  onChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (id) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tab List */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id ? "text-neon-blue" : "text-dark-400 hover:text-white"
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
            
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(0,212,255,0.5)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
};

export default Tabs;
