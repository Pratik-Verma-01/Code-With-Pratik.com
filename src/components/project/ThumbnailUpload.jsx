import React from 'react';
import ImageUpload from '@components/ui/ImageUpload';

const ThumbnailUpload = ({ value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-200">
        Project Thumbnail
      </label>
      <div className="aspect-video w-full max-w-md overflow-hidden rounded-xl bg-dark-800/50 border border-white/10">
        <ImageUpload
          value={value}
          onChange={onChange}
          label="Click or drag image to upload"
          className="h-full w-full"
          error={error}
        />
      </div>
      <p className="text-xs text-dark-400">
        Recommended: 1200x675px (16:9 ratio). Max size 5MB.
      </p>
    </div>
  );
};

export default ThumbnailUpload;
