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
    // 1. Validation Check
    if (!thumbnail) {
      alert("Error: Thumbnail image select karna zaroori hai!");
      return;
    }
    
    try {
      toast.loading("Uploading...", { id: "upload" });

      const slug = generateSlug(data.title) + '-' + Date.now().toString().slice(-4);
      
      // 2. Image Upload Logic
      let thumbUrl = null;
      try {
        thumbUrl = await uploadFile(thumbnail, `projects/${userProfile.uid}/${slug}/thumb`);
        if (!thumbUrl) throw new Error("Image upload returned empty URL");
      } catch (storageErr) {
        alert("Storage Error (Image): " + storageErr.message);
        toast.dismiss("upload");
        return; // Stop here
      }

      // 3. Zip Upload Logic (Optional)
      let zipUrl = '';
      if (zipFile) {
        try {
          zipUrl = await uploadFile(zipFile, `projects/${userProfile.uid}/${slug}/archive.zip`);
        } catch (storageErr) {
          alert("Storage Error (ZIP): " + storageErr.message);
          // Zip fail hone par hum rukte nahi hain, aage badhte hain
        }
      }

      // 4. Firestore Save Logic
      const projectData = {
        ...data,
        slug,
        thumbnail_url: thumbUrl,
        code_archive_url: zipUrl,
        created_by_user_id: userProfile.uid, // Ownership check
        author_name: userProfile.fullName || 'Unknown',
        author_photo: userProfile.photoURL || '',
        likes: 0,
        views: 0,
        createdAt: new Date() // Server timestamp ki jagah Date use karein mobile fix ke liye
      };

      try {
        await addDocument(projectData);
        toast.success('Project Created!', { id: "upload" });
        navigate(`/project/${slug}`);
      } catch (dbErr) {
        alert("Database Error (Firestore): " + dbErr.message + "\nCheck Rules!");
        toast.dismiss("upload");
      }

    } catch (error) {
      console.error(error);
      alert("Unknown Error: " + error.message);
      toast.dismiss("upload");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* --- FORM UI SAME AS BEFORE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-4">
          <Input 
            label="Git Repo URL (Optional)" 
            placeholder="https://github.com/..."
            {...register('repo_url')} 
            error={errors.repo_url?.message}
          />

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Thumbnail (Required)</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center">
               <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 w-full h-full z-10" // Mobile touch fix
                  onChange={(e) => setThumbnail(e.target.files[0])}
               />
               <div className="py-4">
                 {thumbnail ? (
                   <span className="text-primary font-bold">{thumbnail.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap to upload Image</span>
                 )}
               </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Project ZIP (Optional)</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center">
               <input 
                  type="file" 
                  accept=".zip,.rar" 
                  className="absolute inset-0 opacity-0 w-full h-full z-10" // Mobile touch fix
                  onChange={(e) => setZipFile(e.target.files[0])}
               />
               <div className="py-4">
                 {zipFile ? (
                   <span className="text-secondary font-bold">{zipFile.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap to upload ZIP</span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Long Description</label>
        <textarea
          {...register('long_description')}
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
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
