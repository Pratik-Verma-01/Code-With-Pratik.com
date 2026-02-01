import AuthForms from '../components/auth/AuthForms';
import { motion } from 'framer-motion';

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px]" 
         />
      </div>

      <div className="w-full relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-gradient">CodeWithPratik</span>
          </h1>
          <p className="text-gray-400">Access premium projects and AI assistance.</p>
        </div>
        <AuthForms />
      </div>
    </div>
  );
}
