import UploadForm from '../components/projects/UploadForm';
import Card from '../components/ui/Card';

export default function UploadProject() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload New Project</h1>
        <p className="text-gray-400">Share your code with the community and earn points.</p>
      </div>
      
      <Card>
        <UploadForm />
      </Card>
    </div>
  );
}
