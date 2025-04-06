import { api } from '~/trpc/server';
import { Navbar } from '~/components/shared/navbar';
import { ProjectDetails } from '~/components/shared/project-details';
import { ChevronRight, Home } from 'lucide-react';
import { Suspense } from 'react';

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
    <div className='flex min-h-screen flex-col'>
      <Navbar />
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

          <Suspense fallback={<p>Loading..</p>}>
            <ProjectWithData projectId={id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
