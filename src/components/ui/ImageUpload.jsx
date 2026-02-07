import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Camera } from 'lucide-react';
import { cn } from '@utils/cn';

const ImageUpload = ({ 
  value, 
  onChange, 
  label = "Upload Image",
  className,
  variant = "rectangle", // rectangle, circle
  ...props 
}) => {
  const [preview, setPreview] = useState(value);

  const handleFileSelect = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  if (variant === 'circle') {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative group cursor-pointer">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dark-600 bg-dark-800 relative">
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-400">
                <Camera size={32} />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium text-white">Change</span>
            </div>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>
        <span className="text-sm text-dark-300">{label}</span>
      </div>
    );
  }

  return (
    <FileUpload
      onFileSelect={handleFileSelect}
      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
      label={label}
      preview={true}
      className={className}
      {...props}
    />
  );
};

export default ImageUpload;
