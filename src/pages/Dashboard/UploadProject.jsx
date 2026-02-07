import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import ProjectForm from '@components/project/ProjectForm';
import { useProjectMutations } from '@hooks/useProject';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';
import EmailVerificationBanner from '@components/auth/EmailVerificationBanner';

const UploadProject = () => {
  const navigate = useNavigate();
  const { createProject, isCreating } = useProjectMutations();
  const { isEmailVerified } = useAuthContext();

  const handleSubmit = async (data) => {
    const result = await createProject(data);
    if (result.success) {
      navigate(`${ROUTES.DASHBOARD}/project/${result.data.slug}`);
    }
  };

  if (!isEmailVerified) {
    return (
      <PageContainer>
        <PageHeader 
          title="Upload Project" 
          description="Share your code with the world."
        />
        <div className="flex flex-col items-center justify-center py-20 text-center bg-dark-800/30 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Email Verification Required</h3>
          <p className="text-dark-400 mb-6 max-w-md">
            Please verify your email address to upload projects. Check your inbox for the verification link.
          </p>
          <EmailVerificationBanner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-4xl">
      <PageHeader
        title="Upload Project"
        description="Share your latest creation with the community."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'Upload Project' },
        ]}
      />

      <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
        <ProjectForm 
          onSubmit={handleSubmit} 
          isLoading={isCreating} 
          mode="create"
        />
      </div>
    </PageContainer>
  );
};

export default UploadProject;
