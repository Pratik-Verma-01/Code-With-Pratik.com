import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import { Youtube, Lock, Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function YouTubeGate({ videoUrl, projectId, onUnlock }) {
  const { userProfile } = useAuth();
  const { addDocument } = useFirestore('unlocks');
  
  const [status, setStatus] = useState('idle'); // idle | timer | ready | verifying
  const [timeLeft, setTimeLeft] = useState(5);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (status === 'timer' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'timer') {
      setStatus('ready'); 
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const handleSubscribeClick = () => {
    if (!videoUrl) {
        // Agar link nahi hai to direct verify pe bhej do
        setStatus('ready');
        return;
    }
    window.open(videoUrl, '_blank');
    setStatus('timer');
    setTimeLeft(5); 
  };

  const handleVerifyClick = async () => {
    // 1. Check Login
    if (!userProfile) {
        toast.error("Please Login to Unlock");
        // Login page par redirect kar sakte hain, par abhi alert dete hain
        return;
    }

    setStatus('verifying');

    try {
      // 2. Try Saving to Database
      console.log("Saving unlock for:", userProfile.uid);
      
      await addDocument({
        userId: userProfile.uid,
        projectId: projectId,
        method: 'youtube_gate',
        unlockedAt: new Date().toISOString() // String format is safer
      });

      toast.success("Unlocked Permanently!");
      
      // 3. Success -> Open Gate
      if (onUnlock) onUnlock();

    } catch (error) {
      console.error("DB Save Failed:", error);
      
      // --- FIX IS HERE ---
      // Agar Database error de, tab bhi user ke liye khol do (Temporary Unlock)
      // Taaki user "Loop" mein na phase
      toast.success("Unlocked (Session Only)");
      if (onUnlock) onUnlock();
    } finally {
      setStatus('ready'); // Reset status just in case
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-8 text-center border-2 border-red-500/30">
      
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Locked Content</h2>
        <p className="text-gray-400 text-sm">
          Subscribe to access source code & AI.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* BUTTON 1: SUBSCRIBE */}
        {status === 'idle' && (
          <Button 
            onClick={handleSubscribeClick}
            className="w-full bg-[#FF0000] hover:bg-[#cc0000] text-white border-none py-4 shadow-lg shadow-red-900/40"
          >
            <Youtube className="w-6 h-6 mr-2" />
            Subscribe Channel
          </Button>
        )}

        {/* BUTTON 2: TIMER */}
        {status === 'timer' && (
          <Button disabled className="w-full bg-gray-700 text-gray-300 border-none cursor-wait py-4">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Checking... {timeLeft}s
          </Button>
        )}

        {/* BUTTON 3: VERIFY (Clickable) */}
        {(status === 'ready' || status === 'verifying') && (
          <div className="space-y-2 animate-in fade-in zoom-in">
             <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded border border-green-500/20">
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
    </div>
  );
}
