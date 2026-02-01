import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { useStorage } from '../hooks/useStorage';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Camera } from 'lucide-react';

export default function Profile() {
  const { userProfile } = useAuth();
  const { updateDocument } = useFirestore('users');
  const { uploadFile, isUploading } = useStorage();
  
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    username: userProfile?.username || '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDocument(userProfile.uid, formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadFile(file, `users/${userProfile.uid}/avatar`);
      if (url) {
        await updateDocument(userProfile.uid, { photoURL: url });
        window.location.reload(); // Quick refresh to update context
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Sidebar />
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        <Card>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                <img src={userProfile?.photoURL} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Camera className="w-6 h-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile?.fullName}</h2>
              <p className="text-gray-400">@{userProfile?.username}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <Input 
              label="Full Name" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <Input 
              label="Username" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <div className="pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
