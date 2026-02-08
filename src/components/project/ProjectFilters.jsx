import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import { PROGRAMMING_LANGUAGES, SORT_OPTIONS } from '@config/app.config';

const ProjectFilters = ({ filters, onChange, onReset }) => {
  const hasActiveFilters = filters.language || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <div className="flex-1 min-w-[200px]">
        <Select
          placeholder="Filter by Language"
          options={PROGRAMMING_LANGUAGES}
          value={filters.language}
          onChange={(value) => onChange({ ...filters, language: value })}
          className="bg-dark-800/50"
        />
      </div>
      
      <div className="w-[180px]">
        <Select
          placeholder="Sort By"
          options={SORT_OPTIONS}
          value={filters.sortBy}
          onChange={(value) => {
            const option = SORT_OPTIONS.find(opt => opt.value === value);
            onChange({ 
              ...filters, 
              sortBy: value, 
              sortOrder: option?.order || 'desc' 
            });
          }}
          className="bg-dark-800/50"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-red-400 hover:text-red-300"
          leftIcon={<X size={14} />}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default ProjectFilters;
