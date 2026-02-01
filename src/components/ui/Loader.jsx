import { Loader2 } from 'lucide-react';

export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] bg-opacity-90 backdrop-blur-sm">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-secondary/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-primary font-mono tracking-widest animate-pulse">LOADING...</p>
      </div>
    );
  }

  return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
}
