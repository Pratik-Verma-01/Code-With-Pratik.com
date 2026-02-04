import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';
import SEO from '../components/seo/SEO';
import FloatingAI from '../components/ai/FloatingAI'; 
import Button from '../components/ui/Button';
import { Download, Github, Calendar, Code2, AlertTriangle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

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
        if (isMounted) setError(err.message);
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
         <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2 justify-center">
               <AlertTriangle /> Project Not Found
            </h2>
            <Link to="/"><Button variant="outline" className="mt-6">Back to Home</Button></Link>
         </div>
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
            <img src={project.thumbnail_url} className="w-full h-full object-cover" loading="lazy" alt="thumbnail" />
          </div>

          <div className="glass-panel rounded-2xl p-6 prose prose-invert max-w-none">
            <ReactMarkdown>{project.long_description}</ReactMarkdown>
          </div>
        </div>

        {/* Right Column: Downloads */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.05)]">
            
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" /> Source Code
              </h3>
              <p className="text-sm text-gray-400">
                Direct access to project files.
              </p>
            </div>

            <div className="space-y-4">
              {project.code_archive_url ? (
                <a href={project.code_archive_url} target="_blank" rel="noopener noreferrer" className="block">
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
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full py-3">
                    <Github className="w-5 h-5 mr-2" /> GitHub Repo
                  </Button>
                </a>
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* Floating AI */}
      {project.ai_helpers && (
        <FloatingAI projectTitle={project.title} projectContext={contextForAI} />
      )}
    </>
  );
}
