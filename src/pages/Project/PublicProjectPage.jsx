import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import ProjectDetail from '@components/project/ProjectDetail';
import Loader from '@components/ui/Loader';
import Button from '@components/ui/Button';
import { useProject } from '@hooks/useProject';
import SEOHead from '@components/seo/SEOHead';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';

const PublicProjectPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthContext();
  const { project, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
          <Link to={ROUTES.EXPLORE}>
            <Button variant="outline">Back to Explore</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <SEOHead 
        title={project.title}
        description={project.short_description}
        image={project.thumbnail_url}
      />
      
      <PageContainer>
        {/* Banner for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-neon-blue/20 rounded-xl flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-white">
              Join <span className="font-bold">CODE-With-PRATIK</span> to chat with AI about this code!
            </p>
            <Link to={ROUTES.SIGNUP}>
              <Button size="sm" className="bg-white text-dark-900 hover:bg-gray-100 border-none">
                Sign Up Free
              </Button>
            </Link>
          </div>
        )}

        <ProjectDetail project={project} />
      </PageContainer>
    </>
  );
};

export default PublicProjectPage;
