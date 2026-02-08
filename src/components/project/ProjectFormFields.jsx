import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '@components/ui/Input';
import TextArea from '@components/ui/TextArea';
import Select from '@components/ui/Select';
import { PROGRAMMING_LANGUAGES, VISIBILITY_OPTIONS } from '@config/app.config';

export const BasicInfoFields = () => {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <Input
        label="Project Title"
        placeholder="e.g. AI-Powered Chat Application"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label="Short Description"
        placeholder="Brief summary of your project (max 160 chars)"
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
    </div>
  );
};

export default BasicInfoFields;
