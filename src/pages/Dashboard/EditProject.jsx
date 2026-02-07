import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import ProjectForm from '@components/project/ProjectForm';
import Loader from '@components/ui/Loader';
import { useProject, useProjectMutations } from '@hooks/useProject';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';

const EditProject = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const { project, isLoading, isError, isOwner } = useProject(slug, { trackView: false });
  const { updateProject, isUpdating } = useProjectMutations();

  // Redirect if not owner
  useEffect(() => {
    if (project && !isOwner) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [project, isOwner, navigate]);

  const handleSubmit = async (data) => {
    const result = await updateProject({ projectId: project.id, data });
    if (result.success) {
      navigate(`${ROUTES.DASHBOARD}/project/${result.data.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading project..." />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-dark-400">The project you are trying to edit does not exist or you don't have permission.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-4xl">
      <PageHeader
        title="Edit Project"
        description={`Updating "${project.title}"`}
        breadcrumbs={[
          { label: 'My Projects', href: ROUTES.MY_PROJECTS },
          { label: project.title, href: `${ROUTES.DASHBOARD}/project/${project.slug}` },
          { label: 'Edit' },
        ]}
      />

      <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
        <ProjectForm 
          initialData={project} 
          onSubmit={handleSubmit} 
          isLoading={isUpdating} 
          mode="edit"
        />
      </div>
    </PageContainer>
  );
};

export default EditProject;
