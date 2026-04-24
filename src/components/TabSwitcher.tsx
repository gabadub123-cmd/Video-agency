import React from 'react';
import { motion } from 'framer-motion';

interface TabSwitcherProps {
  activeTab: 'Gallery' | 'Outreach';
  setActiveTab: (tab: 'Gallery' | 'Outreach') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['Gallery', 'Outreach'] as const;

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-6 py-2 text-sm font-medium transition-colors rounded-full ${
            activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white shadow-sm rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
