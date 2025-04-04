import Link from 'next/link';

import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { Navbar } from '~/components/shared/navbar';
import { EditProjectForm } from '~/components/shared/edit-project-form';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

async function ProjectWithData({ projectId }: { projectId: string }) {
  const projectById = await api.project.getProjectById({
    projectId: Number(projectId),
  });

  console.log('projectById', projectById);
  return <EditProjectForm initialProject={projectById[0]} />;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const id = await params;

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
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

          <Suspense fallback={<p>Loading..</p>}>
            <ProjectWithData projectId={id.projectId} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
