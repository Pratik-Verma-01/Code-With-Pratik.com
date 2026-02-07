import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Calendar, MapPin, Link as LinkIcon, Github, Twitter } from 'lucide-react';
import PageContainer from '@components/layout/PageContainer';
import Avatar from '@components/ui/Avatar';
import Button from '@components/ui/Button';
import ProjectList from '@components/project/ProjectList';
import StatsCard from '@components/profile/StatsCard';
import ActivityFeed from '@components/profile/ActivityFeed';
import { useAuthContext } from '@contexts/AuthContext';
import { useUserStats } from '@hooks/useUser';
import { useUserProjects } from '@hooks/useUserProjects';
import { ROUTES } from '@config/routes.config';
import { formatDate } from '@utils/formatters';

const Profile = () => {
  const { user, userData } = useAuthContext();
  const { stats, isLoading: loadingStats } = useUserStats(user?.uid);
  const { projects, isLoading: loadingProjects } = useUserProjects({ limit: 5 });

  if (!user) return null;

  return (
    <PageContainer>
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Banner */}
        <div className="h-48 rounded-2xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        </div>

        {/* Info */}
        <div className="px-6 md:px-10 pb-6 -mt-16 flex flex-col md:flex-row items-end md:items-end gap-6">
          <Avatar 
            src={userData?.photo_url || user.photoURL} 
            alt={userData?.full_name} 
            size="2xl"
            className="ring-4 ring-dark-950 shadow-xl"
          />
          
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-white mb-1">
              {userData?.full_name || user.displayName}
            </h1>
            <p className="text-dark-400 font-medium">@{userData?.username}</p>
          </div>

          <div className="mb-2">
            <Link to={ROUTES.EDIT_PROFILE}>
              <Button variant="secondary" leftIcon={<Edit size={16} />}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Stats */}
        <div className="space-y-8">
          {/* Bio */}
          <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">About</h3>
            <p className="text-dark-300 leading-relaxed mb-6">
              {userData?.bio || "No bio yet. Tell the world about yourself!"}
            </p>
            
            <div className="space-y-3 text-sm text-dark-400">
              <div className="flex items-center gap-3">
                <Calendar size={16} />
                <span>Joined {formatDate(userData?.created_at)}</span>
              </div>
              {userData?.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData?.website && (
                <div className="flex items-center gap-3">
                  <LinkIcon size={16} />
                  <a href={userData.website} target="_blank" rel="noreferrer" className="text-neon-blue hover:underline">
                    {userData.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
                {userData?.github_url && (
                  <a href={userData.github_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                )}
                {userData?.twitter_url && (
                  <a href={userData.twitter_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <StatsCard stats={stats} isLoading={loadingStats} />
        </div>

        {/* Right Column: Projects & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <Link to={ROUTES.MY_PROJECTS} className="text-sm text-neon-blue hover:text-neon-purple">
                View all
              </Link>
            </div>
            <ProjectList projects={projects} isLoading={loadingProjects} view="list" limit={3} />
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Activity</h2>
            <ActivityFeed userId={user.uid} />
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
