import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';
import YouTubeGate from '../components/projects/YouTubeGate';
import AIChat from '../components/ai/AIChat';
import Button from '../components/ui/Button';
import { Download, Github, Calendar, Eye, AlertTriangle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

// Fast Loading Skeleton Component
function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-8">
        <div className="h-48 bg-white/5 rounded-2xl"></div>
        <div className="h-96 bg-white/5 rounded-2xl"></div>
      </div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
    </div>
  );
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const { userProfile } = useAuth();
  
  // Hooks
  const { getDocuments: getProjects } = useFirestore('projects');
  const { getDocuments: getUnlocks } = useFirestore('unlocks');
  
  // State
  const [project, setProject] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true); // Single loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDataFast() {
      try {
        setLoading(true);
        
        // 1. Start fetching Project
        const projectPromise = getProjects({ field: 'slug', op: '==', val: slug });
        
        // 2. Start fetching Unlocks (Parallel - if logged in)
        let unlocksPromise = Promise.resolve([]);
        if (userProfile?.uid) {
          unlocksPromise = getUnlocks({ field: 'userId', op: '==', val: userProfile.uid });
        }

        // 3. Wait for both together (Faster!)
        const [projectDocs, unlockDocs] = await Promise.all([projectPromise, unlocksPromise]);

        if (!isMounted) return;

        if (projectDocs && projectDocs.length > 0) {
          const p = projectDocs[0];
          setProject(p);

          // Check Unlock Status
          if (userProfile) {
            if (p.created_by_user_id === userProfile.uid) {
              setIsUnlocked(true); // Owner is always unlocked
            } else {
              const hasUnlocked = unlockDocs.some(u => u.projectId === p.id);
              setIsUnlocked(hasUnlocked);
            }
          }
        } else {
          setError("Project not found in database.");
        }

      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDataFast();

    return () => { isMounted = false; };
  }, [slug, userProfile?.uid]); // Reduced dependencies to avoid re-loops

  // --- LOADING STATE ---
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProjectSkeleton />
    </div>
  );

  // --- ERROR STATE ---
  if (error || !project) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || "Check the URL or try again."}</p>
          <Link to="/"><Button variant="outline">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  // --- SUCCESS CONTENT ---
  const contextForAI = `Project: ${project.title}. Lang: ${project.primary_language}. Desc: ${project.short_description}. \n\n Code: ${project.long_description}`;

  return (
    <>
      <SEO title={`${project.title} | CodeWithPratik`} description={project.short_description} image={project.thumbnail_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8">
             <div className="flex flex-wrap gap-4 mb-4">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-mono border border-primary/20">
                  {project.primary_language}
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4"/> {formatDate(project.createdAt)}
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               {project.title}
             </h1>
             <p className="text-lg text-gray-300 leading-relaxed">{project.short_description}</p>
          </div>

          {/* Optimized Thumbnail */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 aspect-video relative">
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              loading="lazy"
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Description */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-primary/10 shadow-[0_0_30px_rgba(0,243,255,0.05)]">
            {!isUnlocked ? (
              <YouTubeGate 
                videoUrl={project.view_task} 
                projectId={project.id} 
                onUnlock={() => setIsUnlocked(true)} 
              />
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <Eye className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400">Unlocked</h3>
                    <p className="text-xs text-green-300/80">Access granted to all resources.</p>
                  </div>
                </div>

                {project.code_archive_url && (
                  <a href={project.code_archive_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                      <Download className="w-5 h-5" /> Download Source
                    </Button>
                  </a>
                )}

                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full">
                      <Github className="w-5 h-5" /> GitHub Repository
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* AI CHAT */}
          {isUnlocked && project.ai_helpers && (
            <div className="mt-8 animate-in fade-in duration-700 delay-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary animate-pulse">✦</span> AI Assistant
              </h3>
              <AIChat projectContext={contextForAI} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
