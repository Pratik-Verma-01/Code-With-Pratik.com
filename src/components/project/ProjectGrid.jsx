import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';
import ProjectCard from './ProjectCard';
import ProjectSkeleton from './ProjectSkeleton';
import EmptyState from '@components/ui/EmptyState';
import { Search } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProjectGrid = ({
  projects = [],
  isLoading = false,
  columns = 3,
  className,
  emptyMessage = "No projects found.",
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-6", gridCols[columns], className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Search />}
        title="No projects found"
        description={emptyMessage}
        className="min-h-[300px]"
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid gap-6", gridCols[columns], className)}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} layout="grid" />
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
