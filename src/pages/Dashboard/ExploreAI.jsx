import React, { useEffect } from 'react';
import PageContainer from '@components/layout/PageContainer';
import AISidebar from '@components/ai/AISidebar';
import AIFullscreenChat from '@components/ai/AIFullscreenChat';
import { useIsMobile } from '@hooks/useMediaQuery';
import { useAIContext } from '@contexts/AIContext';

const ExploreAI = () => {
  const isMobile = useIsMobile();
  const { openSidebar } = useAIContext();

  // Auto-open sidebar on desktop when visiting this page
  useEffect(() => {
    if (!isMobile) {
      openSidebar();
    }
  }, [isMobile, openSidebar]);

  if (isMobile) {
    return <AIFullscreenChat />;
  }

  return (
    <PageContainer maxWidth="max-w-full" padding="p-0" className="h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        {/* Main Content Area - Could show suggested prompts or AI capabilities */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-2xl space-y-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-neon-blue/20 blur-3xl rounded-full" />
              <img 
                src="/ai-nova-avatar.png" 
                alt="Nova AI" 
                className="relative w-32 h-32 rounded-full border-4 border-dark-800 shadow-neon-lg"
              />
            </div>
            
            <h1 className="text-4xl font-bold font-display gradient-text">
              Chat with Nova AI
            </h1>
            
            <p className="text-lg text-dark-300 leading-relaxed">
              Nova is your personal AI coding assistant powered by Claude 3.5 Sonnet. 
              Ask questions, debug code, generate snippets, or get explanations for complex concepts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <FeatureCard 
                icon="⚡" 
                title="Instant Answers" 
                desc="Get real-time responses to your coding queries."
              />
              <FeatureCard 
                icon="🐛" 
                title="Smart Debugging" 
                desc="Paste your error logs and get fixes instantly."
              />
              <FeatureCard 
                icon="📝" 
                title="Code Generation" 
                desc="Generate clean, optimized code snippets in any language."
              />
              <FeatureCard 
                icon="🧠" 
                title="Context Aware" 
                desc="Nova understands the context of your current project."
              />
            </div>
          </div>
        </div>

        {/* AI Sidebar is rendered by layout, but we ensure it's open */}
      </div>
    </PageContainer>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-dark-400">{desc}</p>
  </div>
);

export default ExploreAI;
