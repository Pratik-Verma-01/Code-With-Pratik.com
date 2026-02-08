import React from 'react';
import { MapPin, Link as LinkIcon, Calendar, Github, Twitter } from 'lucide-react';
import { formatDate, formatUrlForDisplay } from '@utils/formatters';
import Card, { CardTitle, CardContent } from '@components/ui/Card';

const ProfileCard = ({ user }) => {
  return (
    <Card className="h-full">
      <CardContent className="space-y-6">
        <div>
          <CardTitle className="mb-4 text-lg">About</CardTitle>
          <p className="text-dark-300 leading-relaxed text-sm">
            {user.bio || "No bio yet."}
          </p>
        </div>

        <div className="space-y-3 text-sm text-dark-400">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-dark-500" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>
          
          {user.location && (
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-dark-500" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center gap-3">
              <LinkIcon size={16} className="text-dark-500" />
              <a 
                href={user.website} 
                target="_blank" 
                rel="noreferrer" 
                className="text-neon-blue hover:underline truncate"
              >
                {formatUrlForDisplay(user.website)}
              </a>
            </div>
          )}
        </div>

        {(user.github_url || user.twitter_url) && (
          <div className="pt-6 border-t border-white/5 flex gap-4">
            {user.github_url && (
              <SocialLink href={user.github_url} icon={<Github size={20} />} label="GitHub" />
            )}
            {user.twitter_url && (
              <SocialLink href={user.twitter_url} icon={<Twitter size={20} />} label="Twitter" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-dark-400 hover:text-white transition-colors hover:bg-white/5 p-2 rounded-lg"
    aria-label={label}
  >
    {icon}
  </a>
);

export default ProfileCard;
