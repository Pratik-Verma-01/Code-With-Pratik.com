import { useState } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
    setProgress(0);

    return new Promise((resolve, reject) => {
      // Create storage ref: e.g., projects/uid/filename
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
          setIsUploading(false);
          toast.error('Upload failed');
          reject(err);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadUrl);
          setIsUploading(false);
          setProgress(100);
          resolve(downloadUrl);
        }
      );
    });
  };

  return { progress, error, url, isUploading, uploadFile };
}
