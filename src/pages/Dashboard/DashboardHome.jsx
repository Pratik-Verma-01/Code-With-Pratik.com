import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import ProjectGrid from '@components/project/ProjectGrid';
import ProjectSearch from '@components/project/ProjectSearch';
import Button from '@components/ui/Button';
import { useProjects, useTrendingProjects, useRecentProjects } from '@hooks/useProjects';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import { createStaggerContainer, fadeIn } from '@utils/animations';

const DashboardHome = () => {
  const { displayName } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    projects: trendingProjects, 
    isLoading: loadingTrending 
  } = useTrendingProjects(3);
  
  const { 
    projects: recentProjects, 
    isLoading: loadingRecent 
  } = useRecentProjects(6);

  const containerVariants = createStaggerContainer(0.1);

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${displayName.split(' ')[0]}! 👋`}
        description="Here's what's happening in the developer community."
        actions={
          <Link to={ROUTES.UPLOAD_PROJECT}>
            <Button leftIcon={<Plus size={18} />} className="shadow-neon-sm">
              New Project
            </Button>
          </Link>
        }
      />

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        {/* Search Section */}
        <motion.div variants={fadeIn}>
          <ProjectSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            className="max-w-2xl"
          />
        </motion.div>

        {/* Trending Projects */}
        <motion.section variants={fadeIn}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-white">Trending Now 🔥</h2>
            <Link 
              to={`${ROUTES.EXPLORE}?sort=trending`} 
              className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
            >
              View all
            </Link>
          </div>
          <ProjectGrid 
            projects={trendingProjects} 
            isLoading={loadingTrending} 
            columns={3}
          />
        </motion.section>

        {/* Recent Uploads */}
        <motion.section variants={fadeIn}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-white">Fresh Updates 🚀</h2>
            <Link 
              to={ROUTES.EXPLORE} 
              className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
            >
              View all
            </Link>
          </div>
          <ProjectGrid 
            projects={recentProjects} 
            isLoading={loadingRecent} 
            columns={3} 
          />
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};

export default DashboardHome;
