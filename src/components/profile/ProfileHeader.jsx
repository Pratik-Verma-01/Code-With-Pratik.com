import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';
import Avatar from '@components/ui/Avatar';
import Button from '@components/ui/Button';
import { Edit, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { useToast } from '@hooks/useNotification';

const ProfileHeader = ({ user, isOwnProfile }) => {
  const { copy } = useCopyToClipboard();
  const toast = useToast();

  const handleShare = () => {
    const url = window.location.href;
    copy(url).then(() => toast.success('Profile link copied!'));
  };

  return (
    <div className="relative mb-8">
      {/* Banner */}
      <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-8 pb-4 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-end md:items-end gap-6">
          
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Avatar 
              src={user.photo_url} 
              alt={user.full_name} 
              size="2xl"
              className="ring-4 ring-dark-950 shadow-2xl w-32 h-32 md:w-40 md:h-40 text-3xl"
            />
            {isOwnProfile && (
              <Link to={ROUTES.EDIT_PROFILE}>
                <button className="absolute bottom-2 right-2 p-2 bg-dark-800 rounded-full border border-white/10 hover:bg-dark-700 transition-colors shadow-lg">
                  <Edit size={16} className="text-white" />
                </button>
              </Link>
            )}
          </motion.div>
          
          {/* Details */}
          <div className="flex-1 mb-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 font-display">
              {user.full_name}
            </h1>
            <p className="text-dark-400 font-medium text-lg">@{user.username}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-4 md:mb-6 w-full md:w-auto">
            {isOwnProfile ? (
              <Link to={ROUTES.EDIT_PROFILE} className="flex-1 md:flex-none">
                <Button variant="secondary" fullWidth leftIcon={<Edit size={16} />}>
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button fullWidth className="flex-1 md:flex-none">
                Follow
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={handleShare}
              className="px-3"
              aria-label="Share Profile"
            >
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
