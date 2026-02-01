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
    setProgress(10); // Start progress

    try {
      // Supabase mein path clean hona chahiye (no double slashes)
      // Example Path: users/123/avatar.jpg
      const cleanPath = path.replace(/^\/+/, '');

      // 1. Upload File
      const { data, error: uploadError } = await supabase
        .storage
        .from('uploads') // Bucket Name: 'uploads'
        .upload(cleanPath, file, {
          cacheControl: '3600',
          upsert: true // Overwrite if exists
        });

      if (uploadError) throw uploadError;

      setProgress(80);

      // 2. Get Public URL
      const { data: urlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(cleanPath);

      if (!urlData.publicUrl) throw new Error("Failed to get public URL");

      const finalUrl = urlData.publicUrl;
      
      setUrl(finalUrl);
      setProgress(100);
      setIsUploading(false);
      
      return finalUrl;

    } catch (err) {
      console.error("Supabase Upload Error:", err);
      setError(err);
      setIsUploading(false);
      toast.error('Upload failed: ' + err.message);
      return null;
    }
  };

  return { progress, error, url, isUploading, uploadFile };
}
