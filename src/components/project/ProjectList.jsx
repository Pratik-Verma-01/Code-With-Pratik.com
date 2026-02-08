import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectSkeleton from './ProjectSkeleton';
import EmptyState from '@components/ui/EmptyState';
import { FolderOpen } from 'lucide-react';

const ProjectList = ({
  projects = [],
  isLoading = false,
  emptyMessage = "No projects available.",
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectSkeleton key={i} layout="list" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="No projects found"
        description={emptyMessage}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="space-y-4"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} layout="list" />
      ))}
    </motion.div>
  );
};

export default ProjectList;
