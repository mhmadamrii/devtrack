import Link from 'next/link';

import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { Navbar } from '~/components/shared/navbar';
import { EditProjectForm } from '~/components/shared/edit-project-form';
import { ChevronRight, Home } from 'lucide-react';
import { EditProjectSkeleton } from '~/components/skeletons/edit-project-skeleton';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export const revalidate = 3600; // seconds
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await api.project.getAllProjects();

  return projects
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 20)
    .map((project) => ({
      projectId: project.id.toString(),
    }));
}

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
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className='w-[70px] flex items-center gap-2'
                asChild
              >
                <Link href='/'>
                  <Home className='h-4 w-4 mr-1' />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/projects'>Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>New Project</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className='text-3xl font-bold'>Edit Project</h1>
        <p className='text-muted-foreground'>
          Fill in the details below to create a new project. All fields marked
          with an asterisk (*) are required.
        </p>

        <Suspense fallback={<EditProjectSkeleton />}>
          <ProjectWithData projectId={id.projectId} />
        </Suspense>
      </div>
    </main>
  );
}
