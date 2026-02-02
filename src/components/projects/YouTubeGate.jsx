import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import { Youtube, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function YouTubeGate({ videoUrl, projectId, onUnlock }) {
  const { userProfile } = useAuth();
  const { addDocument } = useFirestore('unlocks');
  
  const [state, setState] = useState('locked'); // locked | verifying
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    // 1. YouTube link kholo
    if (videoUrl) {
        window.open(videoUrl, '_blank');
    } else {
        toast.error("Channel link missing, bypassing...");
    }
    // 2. Button badal do
    setState('verifying');
  };

  const handleVerify = async () => {
    if (!userProfile) {
        toast.error("Please Login to Unlock");
        return;
    }

    setLoading(true);

    try {
      // 3. Database mein Permanent Entry Karo
      await addDocument({
        userId: userProfile.uid,
        projectId: projectId,
        method: 'youtube_subscribe',
        unlockedAt: new Date() // Timestamp
      });
      
      toast.success("Subscription Verified!");
      
      // 4. Parent component ko bolo ki khol de
      if (onUnlock) onUnlock();

    } catch (error) {
      console.error("Unlock Error:", error);
      // Agar pehle se unlock hai to bhi success maano (Duplicate error fix)
      if (onUnlock) onUnlock();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-8 text-center border-2 border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400" />
      
      <div className="mb-6">
        <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30"
        >
          <Lock className="w-8 h-8 text-red-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 text-white">Project Locked</h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Subscribe to <span className="text-white font-bold">CodeWithPratik</span> to get access to source code, files, and AI.
        </p>
      </div>

      {state === 'locked' ? (
        <Button 
          onClick={handleSubscribe}
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white border-none shadow-lg shadow-red-900/40 w-full md:w-auto py-3 px-8 text-lg"
        >
          <Youtube className="w-6 h-6 mr-2" />
          Subscribe Channel
        </Button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/20 max-w-xs mx-auto">
            ⚠ Please subscribe in the opened tab, then click below.
          </div>
          <Button 
            onClick={handleVerify}
            isLoading={loading}
            variant="secondary"
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white border-none"
          >
            {loading ? "Verifying..." : "I Have Subscribed ✅"}
          </Button>
        </motion.div>
      )}

      <p className="text-xs text-gray-600 mt-6">
        One-time verification. Forever access.
      </p>
    </div>
  );
}
