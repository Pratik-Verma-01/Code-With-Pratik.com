import React from 'react';
import { Facebook, Twitter, Linkedin, Link2, Mail } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@config/app.config';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { useToast } from '@hooks/useNotification';
import { cn } from '@utils/cn';

const ShareButtons = ({ title, description, url = window.location.href }) => {
  const { copy } = useCopyToClipboard();
  const toast = useToast();

  const handleCopyLink = async () => {
    const success = await copy(url);
    if (success) {
      toast.success('Link copied to clipboard!');
    }
  };

  const platforms = [
    {
      name: 'Twitter',
      icon: <Twitter size={18} />,
      url: SOCIAL_PLATFORMS.find(p => p.name === 'twitter').shareUrl(url, title),
      color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10',
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={18} />,
      url: SOCIAL_PLATFORMS.find(p => p.name === 'linkedin').shareUrl(url, title),
      color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      url: SOCIAL_PLATFORMS.find(p => p.name === 'facebook').shareUrl(url),
      color: 'hover:text-[#4267B2] hover:bg-[#4267B2]/10',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2.5 rounded-lg text-dark-400 transition-all duration-200 bg-white/5 border border-white/5",
            platform.color
          )}
          title={`Share on ${platform.name}`}
        >
          {platform.icon}
        </a>
      ))}
      
      <button
        onClick={handleCopyLink}
        className="p-2.5 rounded-lg text-dark-400 hover:text-neon-blue hover:bg-neon-blue/10 bg-white/5 border border-white/5 transition-all duration-200"
        title="Copy Link"
      >
        <Link2 size={18} />
      </button>
    </div>
  );
};

export default ShareButtons;
