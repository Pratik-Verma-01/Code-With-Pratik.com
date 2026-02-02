import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import SEO from '../components/seo/SEO';
import FloatingAI from '../components/ai/FloatingAI'; 
import Button from '../components/ui/Button';
import { Download, Github, Calendar, Eye, AlertTriangle, Code2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

// Skeleton
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
  
  // Database Hook (Sirf Project lana hai, Unlock check nahi karna)
  const { getDocuments: getProjects } = useFirestore('projects');
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const projectDocs = await getProjects({ field: 'slug', op: '==', val: slug });
        
        if (!isMounted) return;

        if (projectDocs && projectDocs.length > 0) {
          setProject(projectDocs[0]);
        } else {
          setError("Project Not Found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto"><ProjectSkeleton /></div>;

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
         <h2 className="text-2xl font-bold text-red-500">Project Not Found</h2>
         <Link to="/"><Button variant="outline" className="mt-4">Home</Button></Link>
      </div>
    );
  }

  const contextForAI = `Project: ${project.title}. Lang: ${project.primary_language}. Desc: ${project.short_description}. Code: ${project.long_description}`;

  return (
    <>
      <SEO title={`${project.title} | CodeWithPratik`} description={project.short_description} image={project.thumbnail_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in pb-24">
        
        {/* Left Column: Project Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-2xl p-6 relative">
             <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
             <div className="flex gap-4 text-sm text-gray-400">
                <span className="bg-white/10 px-2 py-1 rounded border border-white/10">
                  {project.primary_language}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4"/> {formatDate(project.createdAt)}
                </span>
             </div>
             <p className="mt-4 text-gray-300">{project.short_description}</p>
          </div>

          <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={project.thumbnail_url} className="w-full h-full object-cover" loading="lazy" />
          </div>

          <div className="glass-panel rounded-2xl p-6 prose prose-invert max-w-none">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* Right Column: Downloads (DIRECT ACCESS) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.05)]">
            
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" /> Source Code
              </h3>
              <p className="text-sm text-gray-400">
                Direct access to project files and repository.
              </p>
            </div>

            <div className="space-y-4">
              {project.code_archive_url ? (
                <a href={project.code_archive_url} target="_blank" className="block">
                  <Button className="w-full bg-white text-black hover:bg-gray-200 border-none shadow-lg shadow-white/10 py-3">
                    <Download className="w-5 h-5 mr-2" /> Download Zip
                  </Button>
                </a>
              ) : (
                <Button disabled variant="ghost" className="w-full text-gray-500 border-dashed border-gray-600">
                  No Zip File
                </Button>
              )}
              
              {project.repo_url ? (
                <a href={project.repo_url} target="_blank" className="block">
                  <Button variant="outline" className="w-full py-3">
                    <Github className="w-5 h-5 mr-2" /> GitHub Repo
                  </Button>
                </a>
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* AI Assistant Always Visible */}
      {project.ai_helpers && (
        <FloatingAI projectTitle={project.title} projectContext={contextForAI} />
      )}
    </>
  );
}
  return (
    <>
      <SEO title={`${project.title} | CodeWithPratik`} description={project.short_description} image={project.thumbnail_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in pb-24">
        
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-2xl p-6 relative">
             <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
             <div className="flex gap-4 text-sm text-gray-400">
                <span className="bg-white/10 px-2 py-1 rounded">{project.primary_language}</span>
                <span>{formatDate(project.createdAt)}</span>
             </div>
             <p className="mt-4 text-gray-300">{project.short_description}</p>
          </div>

          <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/10">
            <img src={project.thumbnail_url} className="w-full h-full object-cover" loading="lazy" />
          </div>

          <div className="glass-panel rounded-2xl p-6 prose prose-invert max-w-none">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* Right: Gate or Download */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-white/10">
            
            {!isUnlocked ? (
              // LOCKED STATE: YouTube Gate Component
              <YouTubeGate 
                videoUrl={project.view_task} 
                projectId={project.id} // Important for DB
                onUnlock={() => setIsUnlocked(true)} 
              />
            ) : (
              // UNLOCKED STATE: Downloads
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
                  <Eye className="w-5 h-5 text-green-500" />
                  <div>
                    <h3 className="font-bold text-green-400">Unlocked</h3>
                    <p className="text-xs text-gray-400">Access granted forever.</p>
                  </div>
                </div>

                {project.code_archive_url && (
                  <a href={project.code_archive_url} target="_blank" className="block">
                    <Button className="w-full bg-white text-black hover:bg-gray-200">
                      <Download className="w-5 h-5" /> Download Source
                    </Button>
                  </a>
                )}
                
                {project.repo_url && (
                  <a href={project.repo_url} target="_blank" className="block">
                    <Button variant="outline" className="w-full">
                      <Github className="w-5 h-5" /> GitHub Repo
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isUnlocked && project.ai_helpers && (
        <FloatingAI projectTitle={project.title} projectContext={contextForAI} />
      )}
    </>
  );
        }          <p className="text-gray-400 mb-6">{error || "This project may have been deleted."}</p>
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  const contextForAI = `Project: ${project.title}. Lang: ${project.primary_language}. Desc: ${project.short_description}. \n\n Code Context: ${project.long_description}`;

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
                    <p className="text-xs text-green-300/80">Access granted permanently.</p>
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
}          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
