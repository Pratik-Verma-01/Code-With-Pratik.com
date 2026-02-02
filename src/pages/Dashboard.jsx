import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../hooks/usePoints';
import { useFirestore } from '../hooks/useFirestore'; // Database Hook added
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProjectCard from '../components/projects/ProjectCard'; // Card Component
import { Plus, Trophy, Code2, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const { level, points, progressPercent } = usePoints();
  
  // Fetch User Projects
  const { getDocuments, loading } = useFirestore('projects');
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    async function fetchMyData() {
      if (currentUser?.uid) {
        // Sirf wahi projects laao jo maine banaye hain
        const docs = await getDocuments({ 
          field: 'created_by_user_id', 
          op: '==', 
          val: currentUser.uid 
        });
        setMyProjects(docs);
      }
    }
    fetchMyData();
  }, [currentUser, getDocuments]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Sidebar />
      
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userProfile?.fullName}</p>
          </div>
          <Link to="/upload">
            <Button>
              <Plus className="w-5 h-5" /> New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Points</p>
                <h3 className="text-3xl font-bold text-white mt-1">{points}</h3>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={level.color}>{level.name}</span>
                <span>Next Level</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Projects Uploaded</p>
                <h3 className="text-3xl font-bold text-white mt-1">{myProjects.length}</h3>
              </div>
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Code2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Credits</p>
                <h3 className="text-3xl font-bold text-white mt-1">Unlimited</h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity (Real Projects) */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your Projects</h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : myProjects.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-gray-500 mb-4">You haven't uploaded any projects yet.</p>
              <Link to="/upload"><Button variant="outline">Upload First Project</Button></Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
