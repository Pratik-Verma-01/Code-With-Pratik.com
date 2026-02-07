import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Code, Trophy } from 'lucide-react';
import { useAuthContext } from '@contexts/AuthContext';
import { useToast } from '@hooks/useNotification';
import Avatar from '@components/ui/Avatar';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '@components/ui/Dropdown';
import { ROUTES } from '@config/routes.config';

const UserMenu = () => {
  const { user, signOut, photoURL, displayName, email } = useAuthContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
          <Avatar 
            src={photoURL} 
            alt={displayName} 
            size="sm" 
            bordered 
            className="ring-offset-2 ring-offset-dark-900 ring-neon-blue"
          />
        </button>
      }
      width="w-64"
    >
      <div className="px-4 py-3 bg-white/5">
        <p className="text-sm font-semibold text-white truncate">{displayName}</p>
        <p className="text-xs text-dark-400 truncate">{email}</p>
      </div>
      
      <DropdownDivider />
      
      <DropdownHeader>Account</DropdownHeader>
      <DropdownItem icon={<User size={16} />} onClick={() => navigate(ROUTES.PROFILE)}>
        Profile
      </DropdownItem>
      <DropdownItem icon={<Code size={16} />} onClick={() => navigate(ROUTES.MY_PROJECTS)}>
        My Projects
      </DropdownItem>
      <DropdownItem icon={<Trophy size={16} />} onClick={() => navigate(ROUTES.REWARDS)}>
        Rewards & Points
      </DropdownItem>
      
      <DropdownDivider />
      
      <DropdownItem icon={<Settings size={16} />} onClick={() => navigate(ROUTES.SETTINGS)}>
        Settings
      </DropdownItem>
      
      <DropdownDivider />
      
      <DropdownItem 
        icon={<LogOut size={16} />} 
        onClick={handleSignOut} 
        danger
      >
        Sign Out
      </DropdownItem>
    </Dropdown>
  );
};

export default UserMenu;
