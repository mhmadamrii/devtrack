import { api } from '~/trpc/server';
import { ProjectDetails } from '~/components/shared/project-details';
import { ChevronRight, Home } from 'lucide-react';
import { Suspense } from 'react';
import { ProjectSkeleton } from '~/components/skeletons/project-skeleton';

export const revalidate = 3600;
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
      id: project.id.toString(),
    }));
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

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
        <Breadcrumb className='mb-2'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className='w-[70px] flex items-center gap-2'
                href='/'
              >
                <Home className='h-4 w-4 mr-1' />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/projects'>Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Project Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectWithData projectId={id} />
        </Suspense>
      </div>
    </main>
  );
}
