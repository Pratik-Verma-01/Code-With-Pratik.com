import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import { Youtube, Lock, Unlock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function YouTubeGate({ videoUrl, projectId, onUnlock }) {
  const { userProfile } = useAuth();
  const { addDocument } = useFirestore('unlocks');
  
  const [state, setState] = useState('locked'); // locked | verifying | unlocked
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    // 1. Open YouTube in new tab
    window.open(videoUrl, '_blank');
    
    // 2. Change UI to verification mode
    setState('verifying');
  };

  const handleVerify = async () => {
    setLoading(true);
    
    // Simulate API check or simply trust the user flow with a delay
    // In a real strict app, you'd use YouTube Data API with OAuth
    setTimeout(async () => {
      // 3. Record unlock in DB
      try {
        await addDocument({
          userId: userProfile.uid,
          projectId: projectId,
          method: 'youtube_subscribe',
          timestamp: new Date()
        });
        
        setState('unlocked');
        if (onUnlock) onUnlock();
      } catch (error) {
        console.error("Unlock save failed", error);
      } finally {
        setLoading(false);
      }
    }, 1500); // 1.5s delay for effect
  };

  if (state === 'unlocked') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-green-400">Content Unlocked</h3>
        <p className="text-gray-400 text-sm">Access granted. Enjoy the code!</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-8 text-center border-2 border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
      
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Locked Content</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Support <span className="text-white font-bold">CodeWithPratik</span> to access the source code, download links, and AI chat.
        </p>
      </div>

      {state === 'locked' && (
        <Button 
          onClick={handleSubscribe}
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white border-none shadow-lg shadow-red-900/20 w-full md:w-auto"
        >
          <Youtube className="w-5 h-5 mr-2" />
          Subscribe to Unlock
        </Button>
      )}

      {state === 'verifying' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-sm text-yellow-400 bg-yellow-400/10 p-2 rounded-lg border border-yellow-400/20">
            ⚠ Please subscribe to the channel in the opened tab.
          </p>
          <Button 
            onClick={handleVerify}
            isLoading={loading}
            variant="secondary"
            className="w-full md:w-auto"
          >
            I have Subscribed
          </Button>
        </motion.div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        Checking status automatically...
      </p>
    </div>
  );
}
