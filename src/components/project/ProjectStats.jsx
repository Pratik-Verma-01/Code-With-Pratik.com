import React from 'react';
import { Eye, Download, MessageSquare, Heart } from 'lucide-react';
import { formatCompactNumber } from '@utils/formatters';

const Stat = ({ icon, value, label }) => (
  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5 min-w-[80px]">
    <div className="text-dark-400 mb-1">{icon}</div>
    <span className="text-lg font-bold text-white">{formatCompactNumber(value)}</span>
    <span className="text-xs text-dark-500">{label}</span>
  </div>
);

const ProjectStats = ({ viewCount = 0, downloadCount = 0 }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Stat 
        icon={<Eye size={18} />} 
        value={viewCount} 
        label="Views" 
      />
      <Stat 
        icon={<Download size={18} />} 
        value={downloadCount} 
        label="Downloads" 
      />
    </div>
  );
};

export default ProjectStats;
