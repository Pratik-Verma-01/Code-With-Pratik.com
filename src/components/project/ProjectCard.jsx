import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';
import { formatCompactNumber, formatProjectDate } from '@utils/formatters';
import { getProjectUrl } from '@config/routes.config';
import LanguageBadge from './LanguageBadge';
import Avatar from '@components/ui/Avatar';

const ProjectCard = ({ project, layout = 'grid' }) => {
  const {
    title,
    slug,
    short_description,
    thumbnail_url,
    primary_language,
    view_count,
    download_count,
    created_at,
    user,
  } = project;

  const projectUrl = getProjectUrl(slug, true);

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="group relative flex flex-col sm:flex-row bg-dark-800/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-lg"
      >
        <div className="sm:w-48 h-32 sm:h-auto relative overflow-hidden">
          <img
            src={thumbnail_url || '/default-project.png'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <Link to={projectUrl}>
                <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors line-clamp-1">
                  {title}
                </h3>
              </Link>
              <LanguageBadge language={primary_language} size="sm" />
            </div>
            <p className="text-sm text-dark-300 line-clamp-2 mb-3">
              {short_description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-xs text-dark-400">
              <span className="flex items-center gap-1">
                <Eye size={14} /> {formatCompactNumber(view_count)}
              </span>
              <span className="flex items-center gap-1">
                <Download size={14} /> {formatCompactNumber(download_count)}
              </span>
              <span>{formatProjectDate(created_at)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar src={user?.photo_url} alt={user?.username} size="xs" />
              <span className="text-xs text-dark-300">{user?.username}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-dark-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-neon-sm"
    >
      {/* Thumbnail */}
      <Link to={projectUrl} className="block relative aspect-project overflow-hidden">
        <img
          src={thumbnail_url || '/default-project.png'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-3 right-3">
          <LanguageBadge language={primary_language} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={projectUrl}>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-neon-blue transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-dark-300 line-clamp-2 mb-4 h-10">
          {short_description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <Avatar src={user?.photo_url} alt={user?.username} size="xs" />
            <span className="text-xs font-medium text-dark-300 truncate max-w-[80px]">
              {user?.username}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-dark-400">
            <span className="flex items-center gap-1" title="Views">
              <Eye size={14} /> {formatCompactNumber(view_count)}
            </span>
            <span className="flex items-center gap-1" title="Downloads">
              <Download size={14} /> {formatCompactNumber(download_count)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
