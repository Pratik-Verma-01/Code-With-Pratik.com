import React, { useState } from 'react';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import Tabs from '@components/ui/Tabs';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Toggle from '@components/ui/Toggle';
import { useAuthContext } from '@contexts/AuthContext';
import { useToast } from '@hooks/useNotification';
import { User, Lock, Bell, Palette } from 'lucide-react';

const Settings = () => {
  const { user, updateEmail, updatePassword } = useAuthContext();
  const toast = useToast();

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} />, content: <AccountSettings user={user} updateEmail={updateEmail} toast={toast} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} />, content: <SecuritySettings updatePassword={updatePassword} toast={toast} /> },
    { id: 'preferences', label: 'Preferences', icon: <Palette size={18} />, content: <PreferenceSettings /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, content: <NotificationSettings /> },
  ];

  return (
    <PageContainer maxWidth="max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
        <Tabs tabs={tabs} />
      </div>
    </PageContainer>
  );
};

const AccountSettings = ({ user, updateEmail, toast }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateEmail(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Email updated successfully');
      setPassword('');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold text-white">Change Email</h3>
      <Input
        label="New Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Current Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        helperText="Required to confirm changes"
      />
      <Button type="submit" isLoading={isLoading}>Update Email</Button>
    </form>
  );
};

const SecuritySettings = ({ updatePassword, toast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    const result = await updatePassword(currentPassword, newPassword);
    setIsLoading(false);

    if (result.success) {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold text-white">Change Password</h3>
      <Input
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isLoading}>Update Password</Button>
    </form>
  );
};

const PreferenceSettings = () => {
  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold text-white">Appearance</h3>
      {/* Theme is handled globally, maybe add more detailed prefs here later */}
      <p className="text-dark-400">Theme settings are available in the navigation bar.</p>
    </div>
  );
};

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    pushNotifications: false,
    marketing: false,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-semibold text-white">Notifications</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Email Updates</p>
            <p className="text-sm text-dark-400">Receive emails about your account activity</p>
          </div>
          <Toggle checked={settings.emailUpdates} onChange={() => toggle('emailUpdates')} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Push Notifications</p>
            <p className="text-sm text-dark-400">Receive push notifications on desktop</p>
          </div>
          <Toggle checked={settings.pushNotifications} onChange={() => toggle('pushNotifications')} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Marketing</p>
            <p className="text-sm text-dark-400">Receive news and special offers</p>
          </div>
          <Toggle checked={settings.marketing} onChange={() => toggle('marketing')} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
