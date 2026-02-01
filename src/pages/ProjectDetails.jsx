import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';
import Loader from '../components/ui/Loader';
import YouTubeGate from '../components/projects/YouTubeGate';
import AIChat from '../components/ai/AIChat';
import Button from '../components/ui/Button';
import { Download, Github, Calendar, Eye } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetails() {
  const { slug } = useParams();
  const { userProfile } = useAuth();
  
  // Hooks
  const { getDocuments: getProjects, loading: loadingProject } = useFirestore('projects');
  const { getDocuments: getUnlocks } = useFirestore('unlocks');
  
  // State
  const [project, setProject] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Project by Slug
      const docs = await getProjects({ field: 'slug', op: '==', val: slug });
      if (docs.length > 0) {
        const p = docs[0];
        setProject(p);

        // 2. Check Gate Status (Only if logged in)
        if (userProfile) {
          // If I am the creator, I own it
          if (p.created_by_user_id === userProfile.uid) {
            setIsUnlocked(true);
            setCheckingUnlock(false);
            return;
          }

          // Check DB for unlock record
          // Note: Firestore requires composite index for query (userId + projectId)
          // Simple client-side filter for this demo to avoid complex index setup requirement prompt
          const unlocks = await getUnlocks({ field: 'userId', op: '==', val: userProfile.uid });
          const hasUnlocked = unlocks.some(u => u.projectId === p.id);
          setIsUnlocked(hasUnlocked);
        } else {
          setIsUnlocked(false);
        }
      }
      setCheckingUnlock(false);
    }
    loadData();
  }, [slug, userProfile, getProjects, getUnlocks]);

  if (loadingProject || checkingUnlock) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (!project) return <div className="text-center py-20">Project not found</div>;

  const contextForAI = `Project Title: ${project.title}. Language: ${project.primary_language}. Description: ${project.short_description}. \n\n Code Context: ${project.long_description}`;

  return (
    <>
      <SEO title={`${project.title} | CodeWithPratik`} description={project.short_description} image={project.thumbnail_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
             <div className="flex flex-wrap gap-4 mb-4">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-mono">{project.primary_language}</span>
                <span className="flex items-center gap-1 text-gray-400 text-sm"><Calendar className="w-4 h-4"/> {formatDate(project.createdAt)}</span>
                <span className="flex items-center gap-1 text-gray-400 text-sm"><Eye className="w-4 h-4"/> {project.views} Views</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-bold mb-4">{project.title}</h1>
             <p className="text-lg text-gray-300">{project.short_description}</p>
          </div>

          {/* Thumbnail */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={project.thumbnail_url} alt="Thumbnail" className="w-full object-cover" />
          </div>

          {/* Description */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 prose prose-invert max-w-none">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* RIGHT COLUMN: Gate & Tools */}
        <div className="space-y-6">
          
          {/* ACTION CARD */}
          <div className="glass-panel rounded-2xl p-6 sticky top-24">
            {!isUnlocked ? (
              <YouTubeGate 
                videoUrl={project.view_task} 
                projectId={project.id} 
                onUnlock={() => setIsUnlocked(true)} 
              />
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <Unlock className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400">Access Granted</h3>
                    <p className="text-xs text-green-300/80">You can now download files and use AI.</p>
                  </div>
                </div>

                {project.code_archive_url && (
                  <a href={project.code_archive_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full">
                      <Download className="w-5 h-5" /> Download Source Code
                    </Button>
                  </a>
                )}

                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full">
                      <Github className="w-5 h-5" /> View GitHub Repo
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* AI CHAT (Only visible if unlocked) */}
          {isUnlocked && project.ai_helpers && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">✦</span> AI Copilot
              </h3>
              <AIChat projectContext={contextForAI} />
            </div>
          )}
        </div>

      </div>
    </>
  );
}
