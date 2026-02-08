import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Calendar, Github, Share2 } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import LanguageBadge from './LanguageBadge';
import ShareButtons from './ShareButtons';
import Avatar from '@components/ui/Avatar';
import Button from '@components/ui/Button';
import { formatProjectDate, formatCompactNumber } from '@utils/formatters';
import { useProjectActions } from '@hooks/useProject';

const ProjectDetail = ({ project }) => {
  const { trackDownload } = useProjectActions(project.id);

  const handleDownload = () => {
    trackDownload();
    window.open(project.code_archive_url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Hero Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <img
            src={project.thumbnail_url || '/default-project.png'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <LanguageBadge language={project.primary_language} size="lg" />
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-display font-bold text-white mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-dark-300 leading-relaxed mb-8">
            {project.short_description}
          </p>
          
          <div className="bg-dark-800/30 rounded-xl p-6 border border-white/5">
            <MarkdownPreview content={project.long_description} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
          <div className="flex flex-col gap-4 mb-6">
            <Button 
              onClick={handleDownload}
              fullWidth 
              size="lg"
              className="bg-gradient-to-r from-neon-blue to-neon-purple shadow-neon-sm"
              leftIcon={<Download size={20} />}
            >
              Download Code
            </Button>
            
            {project.git_repo_url && (
              <a 
                href={project.git_repo_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" fullWidth leftIcon={<Github size={20} />}>
                  View Repository
                </Button>
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10 mb-6">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 text-dark-400 mb-1">
                <Eye size={16} /> Views
              </div>
              <p className="text-xl font-bold text-white">
                {formatCompactNumber(project.view_count)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 text-dark-400 mb-1">
                <Download size={16} /> Downloads
              </div>
              <p className="text-xl font-bold text-white">
                {formatCompactNumber(project.download_count)}
              </p>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-6">
            <Avatar 
              src={project.user?.photo_url} 
              alt={project.user?.username}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-dark-400">Created by</p>
              <Link 
                to={`/user/${project.user?.username}`} 
                className="text-sm font-semibold text-white hover:text-neon-blue truncate block"
              >
                {project.user?.full_name || project.user?.username}
              </Link>
            </div>
          </div>

          <div className="text-xs text-dark-500 flex items-center gap-2 justify-center">
            <Calendar size={12} />
            Published on {formatProjectDate(project.created_at)}
          </div>
        </div>

        {/* Share */}
        <div className="bg-dark-800/30 border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Share2 size={16} className="text-neon-blue" /> Share Project
          </h3>
          <ShareButtons 
            title={project.title} 
            description={project.short_description}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
