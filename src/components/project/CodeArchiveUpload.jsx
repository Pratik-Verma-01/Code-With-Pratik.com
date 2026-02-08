import React from 'react';
import FileUpload from '@components/ui/FileUpload';

const CodeArchiveUpload = ({ onFileSelect, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-200">
        Source Code
      </label>
      <FileUpload
        onFileSelect={onFileSelect}
        accept={{ 
          'application/zip': ['.zip'], 
          'application/x-gzip': ['.tar.gz', '.tgz'],
          'application/x-rar-compressed': ['.rar']
        }}
        maxSize={50 * 1024 * 1024} // 50MB
        label="Upload Code Archive"
        helperText="ZIP, TAR.GZ or RAR (Max 50MB)"
        error={error}
        className="bg-dark-800/30"
      />
    </div>
  );
};

export default CodeArchiveUpload;
