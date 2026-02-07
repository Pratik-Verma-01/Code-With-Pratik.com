import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const FileUpload = ({
  onFileSelect,
  accept,
  maxSize, // in bytes
  label = "Upload File",
  helperText = "Drag & drop or click to upload",
  className,
  error,
  preview = false,
}) => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setFileError(`File is too large. Max size: ${maxSize / 1024 / 1024}MB`);
      } else if (error.code === 'file-invalid-type') {
        setFileError('Invalid file type');
      } else {
        setFileError(error.message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileError(null);
      onFileSelect(selectedFile);
    }
  }, [maxSize, onFileSelect]);

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setFileError(null);
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center h-48",
          isDragActive 
            ? "border-neon-blue bg-neon-blue/5" 
            : error || fileError
              ? "border-red-500 bg-red-500/5"
              : "border-dark-600 hover:border-dark-400 hover:bg-dark-800/50",
          file && "border-solid border-neon-blue/30 bg-dark-800/30"
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              {preview && file.type.startsWith('image/') ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                  <File size={32} />
                </div>
              )}
              
              <div className="max-w-full overflow-hidden">
                <p className="text-sm font-medium text-white truncate px-4">{file.name}</p>
                <p className="text-xs text-dark-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-2"
                onClick={removeFile}
                leftIcon={<X size={14} />}
              >
                Remove
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isDragActive ? "bg-neon-blue text-white" : "bg-dark-700 text-dark-300"
              )}>
                <Upload size={24} />
              </div>
              
              <div>
                <p className="text-base font-medium text-white">{label}</p>
                <p className="text-sm text-dark-400 mt-1">{helperText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(error || fileError) && (
        <div className="flex items-center mt-2 text-xs text-red-500">
          <AlertCircle size={14} className="mr-1" />
          {error || fileError}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
