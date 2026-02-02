import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';
import YouTubeGate from '../components/projects/YouTubeGate';
import FloatingAI from '../components/ai/FloatingAI'; // Naya Fullscreen AI
import Button from '../components/ui/Button';
import { Download, Github, Calendar, Eye, AlertTriangle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

// --- SKELETON LOADER (Fast UX) ---
function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse p-4">
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
  
  // Database Hooks
  const { getDocuments: getProjects } = useFirestore('projects');
  const { getDocuments: getUnlocks } = useFirestore('unlocks');
  
  // Local State
  const [project, setProject] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING (Parallel & Fast) ---
  useEffect(() => {
    let isMounted = true;

    async function loadDataFast() {
      try {
        setLoading(true);
        
        // 1. Fetch Project
        const projectPromise = getProjects({ field: 'slug', op: '==', val: slug });
        
        // 2. Fetch Unlocks (If logged in)
        let unlocksPromise = Promise.resolve([]);
        if (userProfile?.uid) {
          unlocksPromise = getUnlocks({ field: 'userId', op: '==', val: userProfile.uid });
        }

        // Wait for both
        const [projectDocs, unlockDocs] = await Promise.all([projectPromise, unlocksPromise]);

        if (!isMounted) return;

        if (projectDocs && projectDocs.length > 0) {
          const p = projectDocs[0];
          setProject(p);

          // Check Permission
          if (userProfile) {
            // Owner is always unlocked
            if (p.created_by_user_id === userProfile.uid) {
              setIsUnlocked(true); 
            } else {
              // Check DB record
              const hasUnlocked = unlockDocs.some(u => u.projectId === p.id);
              setIsUnlocked(hasUnlocked);
            }
          }
        } else {
          setError("Project not found. Check the URL.");
        }

      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDataFast();

    return () => { isMounted = false; };
  }, [slug, userProfile?.uid]);

  // --- RENDER STATES ---

  if (loading) return <div className="max-w-7xl mx-auto"><ProjectSkeleton /></div>;

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "This project may have been deleted."}</p>
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  const contextForAI = `Project: ${project.title}. Lang: ${project.primary_language}. Description: ${project.short_description}. \n\n Code Context: ${project.long_description}`;

  return (
    <>
      <SEO title={`${project.title} | CodeWithPratik`} description={project.short_description} image={project.thumbnail_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in pb-24">
        
        {/* LEFT COLUMN: Project Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10">
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
          </div>

          {/* Thumbnail */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 aspect-video">
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>

          {/* Long Description (Markdown) */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 prose prose-invert max-w-none prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Gate */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-primary/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
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
                    <h3 className="font-bold text-green-400">Content Unlocked</h3>
                    <p className="text-xs text-green-300/80">Access granted to source code & AI.</p>
                  </div>
                </div>

                {project.code_archive_url && (
                  <a href={project.code_archive_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 border-none shadow-lg shadow-white/10">
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
        </div>

      </div>

      {/* --- FLOATING AI ASSISTANT (Only visible if Unlocked) --- */}
      {isUnlocked && project.ai_helpers && (
        <FloatingAI 
          projectTitle={project.title} 
          projectContext={contextForAI} 
        />
      )}
    </>
  );
                      }
