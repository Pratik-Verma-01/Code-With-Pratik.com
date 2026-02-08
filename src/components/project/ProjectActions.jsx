import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import Dropdown, { DropdownItem, DropdownDivider } from '@components/ui/Dropdown';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import { useProjectMutations } from '@hooks/useProject';
import { ROUTES, getEditProjectUrl, getProjectUrl } from '@config/routes.config';

const ProjectActions = ({ project }) => {
  const navigate = useNavigate();
  const { deleteProject, isDeleting } = useProjectMutations();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    navigate(getEditProjectUrl(project.slug));
  };

  const handleView = () => {
    navigate(getProjectUrl(project.slug));
  };

  const handleDelete = async () => {
    const result = await deleteProject(project.id);
    if (result.success) {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Dropdown
        trigger={
          <button className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors">
            <MoreVertical size={18} />
          </button>
        }
      >
        <DropdownItem icon={<Eye size={16} />} onClick={handleView}>
          View Details
        </DropdownItem>
        <DropdownItem icon={<Edit size={16} />} onClick={handleEdit}>
          Edit Project
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem 
          icon={<Trash2 size={16} />} 
          onClick={() => setShowDeleteConfirm(true)}
          danger
        >
          Delete
        </DropdownItem>
      </Dropdown>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProjectActions;
