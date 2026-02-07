import React from 'react';
import { toast as hotToast } from 'react-hot-toast';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

const icons = {
  success: <CheckCircle className="text-green-400" size={20} />,
  error: <AlertCircle className="text-red-400" size={20} />,
  warning: <AlertTriangle className="text-yellow-400" size={20} />,
  info: <Info className="text-blue-400" size={20} />,
};

const borderColors = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-500',
};

const Toast = ({ t, type = 'info', message, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "relative flex items-center w-full max-w-sm overflow-hidden bg-dark-800/90 backdrop-blur-xl border border-white/10 shadow-glass-lg rounded-xl p-4 gap-3 border-l-4",
        borderColors[type],
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >
      <div className="flex-shrink-0">
        {icon || icons[type]}
      </div>
      
      <div className="flex-1 text-sm font-medium text-white">
        {message}
      </div>
      
      <button
        onClick={() => hotToast.dismiss(t.id)}
        className="flex-shrink-0 p-1 rounded-full text-dark-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
