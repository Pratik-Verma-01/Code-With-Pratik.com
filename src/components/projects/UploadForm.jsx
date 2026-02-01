import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useStorage } from '../../hooks/useStorage';
import { useFirestore } from '../../hooks/useFirestore';
import { projectSchema } from '../../lib/validators';
import { generateSlug } from '../../lib/utils';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UploadCloud, X } from 'lucide-react';

export default function UploadForm() {
  const { userProfile } = useAuth();
  const { uploadFile, progress, isUploading } = useStorage();
  const { addDocument } = useFirestore('projects');
  const navigate = useNavigate();
  
  const [thumbnail, setThumbnail] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit = async (data) => {
    if (!thumbnail) return toast.error('Thumbnail is required');
    
    try {
      const slug = generateSlug(data.title) + '-' + Date.now().toString().slice(-4);
      
      // Upload Files
      const thumbUrl = await uploadFile(thumbnail, `projects/${userProfile.uid}/${slug}/thumb`);
      let zipUrl = '';
      if (zipFile) {
        zipUrl = await uploadFile(zipFile, `projects/${userProfile.uid}/${slug}/archive.zip`);
      }

      const projectData = {
        ...data,
        slug,
        thumbnail_url: thumbUrl,
        code_archive_url: zipUrl,
        created_by_user_id: userProfile.uid,
        author_name: userProfile.fullName,
        author_photo: userProfile.photoURL,
        likes: 0,
        views: 0
      };

      await addDocument(projectData);
      toast.success('Project uploaded successfully!');
      navigate(`/project/${slug}`);

    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Check console.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <Input 
            label="Project Title" 
            placeholder="e.g. AI SaaS Platform"
            {...register('title')} 
            error={errors.title?.message}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Primary Language</label>
            <select 
              {...register('primary_language')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
            >
              <option value="">Select Language</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="python">Python</option>
              <option value="nextjs">Next.js</option>
            </select>
            {errors.primary_language && <p className="text-xs text-red-400">{errors.primary_language.message}</p>}
          </div>

          <Input 
            label="Short Description" 
            placeholder="One sentence summary..."
            {...register('short_description')} 
            error={errors.short_description?.message}
          />

          <Input 
            label="YouTube Video URL (For Gate)" 
            placeholder="https://youtube.com/watch?v=..."
            {...register('view_task')} 
            error={errors.view_task?.message}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input 
            label="Git Repo URL (Optional)" 
            placeholder="https://github.com/..."
            {...register('repo_url')} 
            error={errors.repo_url?.message}
          />

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Thumbnail</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition text-center cursor-pointer">
               <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setThumbnail(e.target.files[0])}
               />
               {thumbnail ? (
                 <div className="flex items-center justify-center gap-2 text-primary">
                    <span>{thumbnail.name}</span>
                    <button onClick={(e) => {e.preventDefault(); setThumbnail(null);}}><X className="w-4 h-4" /></button>
                 </div>
               ) : (
                 <div className="flex flex-col items-center text-gray-400">
                   <UploadCloud className="w-8 h-8 mb-2" />
                   <span>Click to upload image</span>
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Project ZIP (Optional)</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition text-center cursor-pointer">
               <input 
                  type="file" 
                  accept=".zip,.rar" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setZipFile(e.target.files[0])}
               />
               {zipFile ? (
                 <div className="flex items-center justify-center gap-2 text-secondary">
                    <span>{zipFile.name}</span>
                    <button onClick={(e) => {e.preventDefault(); setZipFile(null);}}><X className="w-4 h-4" /></button>
                 </div>
               ) : (
                 <div className="flex flex-col items-center text-gray-400">
                   <UploadCloud className="w-8 h-8 mb-2" />
                   <span>Click to upload ZIP</span>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Long Description (Markdown)</label>
        <textarea
          {...register('long_description')}
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 resize-y"
          placeholder="# Project Details..."
        />
        {errors.long_description && <p className="text-xs text-red-400">{errors.long_description.message}</p>}
      </div>

      {isUploading && (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isUploading} className="w-full md:w-auto">
          Create Project
        </Button>
      </div>
    </form>
  );
}
