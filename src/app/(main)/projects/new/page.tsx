import Link from 'next/link';

import { Navbar } from '~/components/shared/navbar';
import { NewProjectForm } from '~/components/shared/new-project-form';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export default function NewProjectPage() {
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

          <h1 className='text-3xl font-bold'>Create New Project</h1>
          <p className='text-muted-foreground'>
            Fill in the details below to create a new project. All fields marked
            with an asterisk (*) are required.
          </p>

          <NewProjectForm />
        </div>
      </main>
    </div>
  );
}
