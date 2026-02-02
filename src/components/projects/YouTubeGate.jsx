import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import { Youtube, Lock, Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function YouTubeGate({ videoUrl, projectId, onUnlock }) {
  const { userProfile } = useAuth();
  const { addDocument } = useFirestore('unlocks');
  
  // States: 'idle' | 'timer' | 'ready' | 'verifying'
  const [status, setStatus] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(5);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (status === 'timer' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'timer') {
      setStatus('ready'); // Timer khatam, ab verify button dikhao
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const handleSubscribeClick = () => {
    if (!videoUrl) {
        toast.error("Channel link missing");
        setStatus('ready');
        return;
    }
    // 1. YouTube kholo
    window.open(videoUrl, '_blank');
    
    // 2. Timer shuru karo
    setStatus('timer');
    setTimeLeft(5); 
  };

  const handleVerifyClick = async () => {
    if (!userProfile) {
        toast.error("Please Login first!");
        return;
    }

    setStatus('verifying');

    try {
      // 3. Database mein Permanent Entry
      await addDocument({
        userId: userProfile.uid,
        projectId: projectId, // Project ID link kar rahe hain
        method: 'youtube_gate',
        unlockedAt: new Date()
      });

      toast.success("Project Unlocked Successfully!");
      
      // 4. Parent ko batao ki unlock ho gaya
      if (onUnlock) onUnlock();

    } catch (error) {
      console.error("Unlock DB Error:", error);
      // Agar error aaye (network issue), tab bhi user ke liye khol do
      if (onUnlock) onUnlock();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-8 text-center border-2 border-red-500/30">
      
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Source Code Locked</h2>
        <p className="text-gray-400 text-sm">
          Complete the task to unlock files & AI Assistant forever.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* STEP 1: SUBSCRIBE BUTTON */}
        {status === 'idle' && (
          <Button 
            onClick={handleSubscribeClick}
            className="w-full bg-[#FF0000] hover:bg-[#cc0000] text-white border-none py-4 text-lg shadow-lg shadow-red-900/40"
          >
            <Youtube className="w-6 h-6 mr-2" />
            Subscribe Channel
          </Button>
        )}

        {/* STEP 2: TIMER */}
        {status === 'timer' && (
          <Button disabled className="w-full bg-gray-700 text-gray-300 border-none cursor-wait">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Checking... {timeLeft}s
          </Button>
        )}

        {/* STEP 3: VERIFY BUTTON */}
        {(status === 'ready' || status === 'verifying') && (
          <div className="space-y-2 animate-in fade-in zoom-in">
             <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded">
                ✅ Task Detected
             </div>
             <Button 
              onClick={handleVerifyClick}
              isLoading={status === 'verifying'}
              className="w-full bg-green-600 hover:bg-green-700 text-white border-none py-4"
            >
              <Check className="w-5 h-5 mr-2" />
              I Have Subscribed
            </Button>
          </div>
        )}

      </div>
      
      <p className="text-xs text-gray-500 mt-6">
        Unlock once, access anytime.
      </p>
    </div>
  );
}            {loading ? "Verifying..." : "I Have Subscribed ✅"}
          </Button>
        </motion.div>
      )}

      <p className="text-xs text-gray-600 mt-6">
        One-time verification. Forever access.
      </p>
    </div>
  );
}
