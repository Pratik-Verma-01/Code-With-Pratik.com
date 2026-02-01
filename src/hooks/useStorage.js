import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useStorage() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file, path) => {
    if (!file) return null;

    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      // 1. Sanitize Filename (Spaces aur Special chars hatao)
      // Path example: projects/123/my-slug/thumb/
      // File example: "My Photo (1).jpg" -> "my-photo-1.jpg"
      
      const fileExt = file.name.split('.').pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const cleanFileName = `${Date.now()}-${randomId}.${fileExt}`;
      
      // Full Path: projects/123/slug/thumb/1709999-abc.jpg
      // Note: Hum path ke end mein filename jod rahe hain
      const fullPath = `${path}/${cleanFileName}`.replace(/\/+/g, '/'); // Remove double slashes

      // 2. Upload to Supabase
      const { data, error: uploadError } = await supabase
        .storage
        .from('uploads')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Error Log:", uploadError);
        throw new Error(uploadError.message);
      }

      setProgress(90);

      // 3. Get Public URL
      const { data: urlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(fullPath);

      const publicUrl = urlData.publicUrl;
      
      setUrl(publicUrl);
      setProgress(100);
      setIsUploading(false);
      
      return publicUrl;

    } catch (err) {
      console.error("Upload Catch:", err);
      setError(err.message);
      setIsUploading(false);
      // Alert user directly
      throw new Error(err.message || "Upload Failed");
    }
  };

  return { progress, error, url, isUploading, uploadFile };
}
