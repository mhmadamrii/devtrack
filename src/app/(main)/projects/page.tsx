import { Navbar } from '~/components/shared/navbar';
import { ProjectsContent } from '~/components/shared/project-content';

export default function Projects() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <ProjectsContent />
    </div>
  );
}
