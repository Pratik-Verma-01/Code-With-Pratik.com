import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PROJECT_CATEGORIES, PROGRAMMING_LANGUAGES, VISIBILITY_OPTIONS } from '@config/app.config';
import Input from '@components/ui/Input';
import TextArea from '@components/ui/TextArea';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import ImageUpload from '@components/ui/ImageUpload';
import FileUpload from '@components/ui/FileUpload';
import MarkdownEditor from './MarkdownEditor';
import { Save, ArrowRight } from 'lucide-react';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  short_description: z.string().min(10, 'Short description must be at least 10 characters').max(160),
  long_description: z.string().optional(),
  primary_language: z.string().min(1, 'Please select a primary language'),
  visibility: z.enum(['public', 'private']),
  git_repo_url: z.string().url().optional().or(z.literal('')),
});

const ProjectForm = ({ initialData, onSubmit, isLoading, mode = 'create' }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: '',
      short_description: '',
      long_description: '',
      primary_language: '',
      visibility: 'public',
      git_repo_url: '',
    },
    mode: 'onChange',
  });

  const handleNextStep = async () => {
    const isStepValid = await trigger([
      'title', 
      'short_description', 
      'primary_language',
      'visibility'
    ]);
    
    if (isStepValid) {
      setActiveStep(2);
    }
  };

  const onFormSubmit = (data) => {
    // Combine form data with files
    const formData = {
      ...data,
      thumbnailFile,
      codeArchiveFile: codeFile,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        <StepIndicator step={1} currentStep={activeStep} label="Details" />
        <div className={`flex-1 h-0.5 mx-4 ${activeStep >= 2 ? 'bg-neon-blue' : 'bg-dark-700'}`} />
        <StepIndicator step={2} currentStep={activeStep} label="Content & Files" />
      </div>

      {/* Step 1: Basic Details */}
      <div className={activeStep === 1 ? 'block' : 'hidden'}>
        <div className="grid gap-6">
          <Input
            label="Project Title"
            placeholder="e.g., Amazing AI Chatbot"
            error={errors.title?.message}
            {...register('title')}
          />

          <TextArea
            label="Short Description"
            placeholder="Briefly describe your project (max 160 chars)"
            maxLength={160}
            showCount
            error={errors.short_description?.message}
            {...register('short_description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="primary_language"
              control={control}
              render={({ field }) => (
                <Select
                  label="Primary Language"
                  options={PROGRAMMING_LANGUAGES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.primary_language?.message}
                />
              )}
            />

            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select
                  label="Visibility"
                  options={VISIBILITY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.visibility?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={handleNextStep}
              rightIcon={<ArrowRight size={18} />}
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2: Content & Files */}
      <div className={activeStep === 2 ? 'block' : 'hidden'}>
        <div className="space-y-8">
          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Project Thumbnail"
              value={initialData?.thumbnail_url}
              onChange={setThumbnailFile}
              className="h-full"
            />
            
            <div className="space-y-4">
              <Input
                label="Git Repository URL (Optional)"
                placeholder="https://github.com/username/repo"
                error={errors.git_repo_url?.message}
                {...register('git_repo_url')}
              />
              
              <FileUpload
                label="Upload Code Archive"
                accept={{ 'application/zip': ['.zip'], 'application/x-gzip': ['.tar.gz'] }}
                maxSize={50 * 1024 * 1024} // 50MB
                onFileSelect={setCodeFile}
                helperText="ZIP or TAR.GZ (Max 50MB)"
              />
            </div>
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Detailed Description (Markdown)
            </label>
            <Controller
              name="long_description"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  minHeight="300px"
                />
              )}
            />
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setActiveStep(1)}
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              isLoading={isLoading}
              leftIcon={<Save size={18} />}
              className="bg-gradient-to-r from-neon-blue to-neon-purple"
            >
              {mode === 'create' ? 'Publish Project' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

const StepIndicator = ({ step, currentStep, label }) => {
  const isActive = currentStep >= step;
  const isCurrent = currentStep === step;

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
          ${isActive 
            ? 'bg-neon-blue text-white shadow-neon-sm' 
            : 'bg-dark-800 text-dark-400 border border-dark-700'}
        `}
      >
        {step}
      </div>
      <span 
        className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-dark-400'}`}
      >
        {label}
      </span>
    </div>
  );
};

export default ProjectForm;
