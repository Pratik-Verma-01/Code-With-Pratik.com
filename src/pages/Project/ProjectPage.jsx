import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import ProjectDetail from '@components/project/ProjectDetail';
import Loader from '@components/ui/Loader';
import { useProject } from '@hooks/useProject';
import { useAIProjectContext, useAISidebar } from '@hooks/useAIChat';
import SEOHead from '@components/seo/SEOHead';
import { ROUTES } from '@config/routes.config';

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { project, isLoading, isError } = useProject(slug);
  const { setContext } = useAIProjectContext(project);
  const { open } = useAISidebar();

  // Set AI context when project loads
  useEffect(() => {
    if (project) {
      setContext();
      // Auto-open AI sidebar for logged-in users to encourage interaction
      // open(); 
    }
  }, [project, setContext, open]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading project..." />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
          <p className="text-dark-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="text-neon-blue hover:underline"
          >
            Back to Dashboard
          </button>
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
        type="article"
      />
      
      <PageContainer>
        <ProjectDetail project={project} />
      </PageContainer>
    </>
  );
};

export default ProjectPage;
