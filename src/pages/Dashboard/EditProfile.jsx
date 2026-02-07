import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import ProfileForm from '@components/profile/ProfileForm';
import { ROUTES } from '@config/routes.config';
import { useAuthContext } from '@contexts/AuthContext';

const EditProfile = () => {
  const { userData } = useAuthContext();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <PageHeader
        title="Edit Profile"
        description="Update your personal information and public profile."
        breadcrumbs={[
          { label: 'Profile', href: ROUTES.PROFILE },
          { label: 'Edit' },
        ]}
      />

      <div className="bg-dark-900/50 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
        <ProfileForm 
          initialData={userData} 
          onSuccess={handleSuccess} 
        />
      </div>
    </PageContainer>
  );
};

export default EditProfile;
