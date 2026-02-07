import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PageContainer from '@components/layout/PageContainer';
import PageHeader from '@components/layout/PageHeader';
import ProjectList from '@components/project/ProjectList';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import EmptyState from '@components/ui/EmptyState';
import { useUserProjects } from '@hooks/useUserProjects';
import { ROUTES } from '@config/routes.config';
import { FolderOpen } from 'lucide-react';

const MyProjects = () => {
  const [filters, setFilters] = useState({
    search: '',
    visibility: 'all',
    sort: 'newest',
  });

  const { projects, isLoading, isEmpty } = useUserProjects({
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesVisibility = filters.visibility === 'all' || project.visibility === filters.visibility;
    return matchesSearch && matchesVisibility;
  });

  const hasProjects = !isEmpty || isLoading;

  return (
    <PageContainer>
      <PageHeader
        title="My Projects"
        description="Manage and track your coding projects."
        actions={
          <Link to={ROUTES.UPLOAD_PROJECT}>
            <Button leftIcon={<Plus size={18} />}>New Project</Button>
          </Link>
        }
      />

      {hasProjects ? (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-dark-800/30 p-4 rounded-xl border border-white/5">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                leftIcon={<Search size={18} />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-dark-900 border-white/10"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Select
                value={filters.visibility}
                onChange={(value) => setFilters({ ...filters, visibility: value })}
                options={[
                  { value: 'all', label: 'All Visibility' },
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                ]}
                className="w-40"
              />
              <Select
                value={filters.sort}
                onChange={(value) => setFilters({ ...filters, sort: value })}
                options={[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'views', label: 'Most Viewed' },
                ]}
                className="w-40"
              />
            </div>
          </div>

          {/* Project List */}
          <ProjectList 
            projects={filteredProjects} 
            isLoading={isLoading} 
            view="list" 
            showActions
          />
        </div>
      ) : (
        <EmptyState
          icon={<FolderOpen />}
          title="No projects yet"
          description="You haven't uploaded any projects yet. Start sharing your code with the world!"
          action={
            <Link to={ROUTES.UPLOAD_PROJECT}>
              <Button leftIcon={<Plus size={18} />} className="mt-4">
                Create First Project
              </Button>
            </Link>
          }
        />
      )}
    </PageContainer>
  );
};

export default MyProjects;
