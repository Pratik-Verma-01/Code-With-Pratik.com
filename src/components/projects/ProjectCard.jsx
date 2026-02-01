import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, User } from 'lucide-react';
import { truncate } from '../../lib/utils';

export default function ProjectCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60 z-10" />
        <img 
          src={project.thumbnail_url} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-mono border border-white/10">
          {project.primary_language}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {truncate(project.short_description, 80)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
              {project.author_photo ? (
                <img src={project.author_photo} alt="" className="w-full h-full" />
              ) : (
                <User className="w-4 h-4 m-1 text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-300">{project.author_name}</span>
          </div>
          
          <Link to={`/project/${project.slug}`}>
            <span className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View <ExternalLink className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
