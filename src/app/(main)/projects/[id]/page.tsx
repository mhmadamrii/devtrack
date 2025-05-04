import { api } from '~/trpc/server';
import { ProjectDetails } from '~/components/shared/project-details';
import { Suspense } from 'react';
import { ProjectSkeleton } from '~/components/skeletons/project-skeleton';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProjectWithData({ projectId }: { projectId: string }) {
  const projectById = await api.project.getDetailProjectById({
    projectId: Number(projectId),
  });

  console.log('project by id', projectById);
  return <ProjectDetails projectDetails={projectById} projectId={projectId} />;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const id = (await params).id;
  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6 max-w-6xl mx-auto'>
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectWithData projectId={id} />
        </Suspense>
      </div>
    </main>
  );
}
