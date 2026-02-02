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

  // Mobile Debugging Error Handler
  const onError = (formErrors) => {
    const firstErrorKey = Object.keys(formErrors)[0];
    const message = formErrors[firstErrorKey]?.message;
    alert(`FORM ERROR: ${message}`);
  };

  const onSubmit = async (data) => {
    if (!thumbnail) {
      alert("Please upload a Thumbnail Image!");
      return;
    }
    
    try {
      toast.loading("Uploading Project...", { id: "uploading" });

      const slug = generateSlug(data.title) + '-' + Date.now().toString().slice(-4);
      
      // 1. Upload Thumbnail
      let thumbUrl = null;
      try {
        thumbUrl = await uploadFile(thumbnail, `projects/${userProfile.uid}/${slug}/thumb`);
        if (!thumbUrl) throw new Error("Image Upload Failed");
      } catch (err) {
        toast.dismiss("uploading");
        alert("Image Upload Error: " + err.message);
        return;
      }

      // 2. Upload Zip
      let zipUrl = '';
      if (zipFile) {
        try {
          zipUrl = await uploadFile(zipFile, `projects/${userProfile.uid}/${slug}/archive.zip`);
        } catch (err) {
          console.warn("Zip upload failed, continuing...", err);
        }
      }

      // 3. Save to Database (No view_task)
      const projectData = {
        title: data.title,
        short_description: data.short_description,
        long_description: data.long_description,
        primary_language: data.primary_language,
        repo_url: data.repo_url || '',
        // view_task hata diya gaya hai
        visibility: 'public',
        ai_helpers: true,
        slug,
        thumbnail_url: thumbUrl,
        code_archive_url: zipUrl,
        created_by_user_id: userProfile.uid,
        author_name: userProfile.fullName || 'User',
        author_photo: userProfile.photoURL || '',
        likes: 0,
        views: 0,
        createdAt: new Date()
      };

      await addDocument(projectData);
      
      toast.success('Project Live!', { id: "uploading" });
      navigate(`/project/${slug}`);

    } catch (error) {
      console.error(error);
      toast.dismiss("uploading");
      alert("System Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <Input 
            label="Project Title" 
            placeholder="Amazing App"
            {...register('title')} 
            error={errors.title?.message}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Language</label>
            <select 
              {...register('primary_language')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Select Language</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="python">Python</option>
              <option value="html">HTML/CSS</option>
              <option value="nextjs">Next.js</option>
            </select>
            {errors.primary_language && <p className="text-xs text-red-400">{errors.primary_language.message}</p>}
          </div>

          <Input 
            label="Short Description" 
            placeholder="One line summary"
            {...register('short_description')} 
            error={errors.short_description?.message}
          />
          
          {/* YAHAN SE YOUTUBE INPUT HATA DIYA GAYA HAI */}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <Input 
            label="Repo URL (Optional)" 
            placeholder="https://github.com..."
            {...register('repo_url')} 
            error={errors.repo_url?.message}
          />

          {/* Thumbnail Input */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Thumbnail Image</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center active:bg-white/10">
               <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 w-full h-full z-50 cursor-pointer"
                  onChange={(e) => setThumbnail(e.target.files[0])}
               />
               <div>
                 {thumbnail ? (
                   <span className="text-primary font-bold">{thumbnail.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap here to select Image</span>
                 )}
               </div>
             </div>
          </div>
          
           {/* Zip Input */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Source Code (ZIP)</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center active:bg-white/10">
               <input 
                  type="file" 
                  accept=".zip,.rar" 
                  className="absolute inset-0 opacity-0 w-full h-full z-50 cursor-pointer"
                  onChange={(e) => setZipFile(e.target.files[0])}
               />
               <div>
                 {zipFile ? (
                   <span className="text-secondary font-bold">{zipFile.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap here to select ZIP</span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Detailed Description</label>
        <textarea
          {...register('long_description')}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Explain your project..."
        />
        {errors.long_description && <p className="text-xs text-red-400">{errors.long_description.message}</p>}
      </div>

      {isUploading && (
        <div className="space-y-2">
           <div className="flex justify-between text-xs text-gray-400">
             <span>Uploading...</span>
             <span>{Math.round(progress)}%</span>
           </div>
           <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
             <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
           </div>
        </div>
      )}

      <Button type="submit" isLoading={isUploading} className="w-full py-4 text-lg">
        Create Project
      </Button>
    </form>
  );
}
  return (
    // onError function yahan pass kiya hai
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      
      {/* FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input 
            label="Project Title" 
            placeholder="Amazing App"
            {...register('title')} 
            error={errors.title?.message}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Language</label>
            <select 
              {...register('primary_language')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="">Select Language</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="python">Python</option>
              <option value="html">HTML/CSS</option>
            </select>
            {errors.primary_language && <p className="text-xs text-red-400">{errors.primary_language.message}</p>}
          </div>

          <Input 
            label="Short Description" 
            placeholder="One line summary"
            {...register('short_description')} 
            error={errors.short_description?.message}
          />

          <Input 
            label="YouTube Video (Required)" 
            placeholder="https://youtu.be/..."
            {...register('view_task')} 
            error={errors.view_task?.message}
          />
        </div>

        <div className="space-y-4">
          <Input 
            label="Repo URL (Optional)" 
            placeholder="https://github.com..."
            {...register('repo_url')} 
            error={errors.repo_url?.message}
          />

          {/* Thumbnail Input - Fixed for Mobile Touch */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Thumbnail Image</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center active:bg-white/10">
               <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 w-full h-full z-50 cursor-pointer"
                  onChange={(e) => setThumbnail(e.target.files[0])}
               />
               <div>
                 {thumbnail ? (
                   <span className="text-primary font-bold">{thumbnail.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap here to select Image</span>
                 )}
               </div>
             </div>
          </div>
          
           {/* Zip Input */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-400">Source Code (ZIP)</label>
             <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center active:bg-white/10">
               <input 
                  type="file" 
                  accept=".zip,.rar" 
                  className="absolute inset-0 opacity-0 w-full h-full z-50 cursor-pointer"
                  onChange={(e) => setZipFile(e.target.files[0])}
               />
               <div>
                 {zipFile ? (
                   <span className="text-secondary font-bold">{zipFile.name}</span>
                 ) : (
                   <span className="text-gray-400">Tap here to select ZIP</span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Detailed Description</label>
        <textarea
          {...register('long_description')}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          placeholder="Explain your project..."
        />
        {errors.long_description && <p className="text-xs text-red-400">{errors.long_description.message}</p>}
      </div>

      {isUploading && (
        <div className="space-y-2">
           <div className="flex justify-between text-xs text-gray-400">
             <span>Uploading...</span>
             <span>{Math.round(progress)}%</span>
           </div>
           <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
             <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
           </div>
        </div>
      )}

      <Button type="submit" isLoading={isUploading} className="w-full py-4 text-lg">
        Create Project
      </Button>
    </form>
  );
}
