import Link from 'next/link';

import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { EditProjectForm } from '~/components/shared/edit-project-form';
import { EditProjectSkeleton } from '~/components/skeletons/edit-project-skeleton';

async function ProjectWithData({ projectId }: { projectId: string }) {
  try {
    const projectById = await api.project.getProjectById({
      projectId: Number(projectId),
    });

    if (!projectById || !projectById) {
      return (
        <div className='p-8 text-center'>
          <h2 className='text-2xl font-bold mb-4'>Project Not Found</h2>
          <p className='text-muted-foreground mb-6'>
            The project you're trying to edit doesn't exist or has been removed.
          </p>
          <Link href='/projects' className='text-primary hover:underline'>
            View all projects
          </Link>
        </div>
      );
    }

    return <EditProjectForm initialProject={projectById} />;
  } catch (error) {
    console.error('Error fetching project for editing:', error);
    return (
      <div className='p-8 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Error Loading Project</h2>
        <p className='text-muted-foreground mb-6'>
          There was a problem loading this project for editing. Please try again
          later.
        </p>
        <Link href='/projects' className='text-primary hover:underline'>
          View all projects
        </Link>
      </div>
    );
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const id = await params;

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6 max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold'>Edit Project</h1>
        <p className='text-muted-foreground'>
          Fill in the details below to edit project. All fields marked with an
          asterisk (*) are required.
        </p>

        <Suspense fallback={<EditProjectSkeleton />}>
          <ProjectWithData projectId={id.projectId} />
        </Suspense>
      </div>
    </main>
  );
}
