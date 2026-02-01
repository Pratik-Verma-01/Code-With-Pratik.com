import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/ui/Loader';
import SEO from '../components/seo/SEO';
import { motion } from 'framer-motion';

export default function Home() {
  const { getDocuments, loading } = useFirestore('projects');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      // In production, add limit(20) and pagination
      const docs = await getDocuments({ field: 'visibility', op: '==', val: 'public' });
      setProjects(docs);
    }
    fetchProjects();
  }, [getDocuments]);

  return (
    <>
      <SEO title="Home | CodeWithPratik" />
      
      {/* Hero Section */}
      <section className="text-center py-20 relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Build. Share. <span className="text-gradient">Innovate.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Access premium source code, get AI assistance, and level up your development skills.
        </motion.p>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Latest Projects</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl">
            <p className="text-gray-400">No projects found. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
