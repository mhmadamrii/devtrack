import Link from 'next/link';

import { Suspense } from 'react';
import { Calendar, MoreHorizontal, Users } from 'lucide-react';
import { ProjectFilter } from '../filters/project-filter';
import { api } from '~/trpc/server';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { getLabelStatus } from '~/lib/utils';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

async function ProjectCards() {
  const projects = await api.project.getAllProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  return projects.map((project) => (
    <Card key={project.id} className='overflow-hidden border-border'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-lg'>{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Link href={`/projects/${project.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/projects/edit/${project.id}`}>Edit Project</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Manage Team</DropdownMenuItem>
              <DropdownMenuItem>View Issues</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge variant='outline' className={getStatusColor(project.status)}>
          {getLabelStatus(project.status)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground min-h-[40px] mb-4'>
          {project.description}
        </p>
        <div className='space-y-4'>
          <div className='flex justify-between items-center text-sm'>
            <span>Progress</span>
            <span className='font-medium'>{project.progress}%</span>
          </div>
          <Progress
            value={project.progress}
            className='w-full [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-sky-500 [&>div]:to-indigo-500 [&>div]:rounded-l-full'
          />
          <div className='flex justify-between text-sm'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span>
                {new Date(project.createdAt).toLocaleDateString()} -{' '}
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-t pt-4 flex justify-between'>
        <div className='flex items-center gap-1'>
          <Users className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>
            {project?.teamMembers?.length} members
          </span>
        </div>
        <div className='text-sm'>
          <span>12 issues</span>
        </div>
      </CardFooter>
    </Card>
  ));
}

export function ProjectsContent() {
  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <ProjectFilter />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectCards />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
