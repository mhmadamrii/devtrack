'use client';

import { Calendar, MoreHorizontal, Plus, Search, Users } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Progress } from '~/components/ui/progress';

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

// Sample data
const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX',
    startDate: '2023-03-15',
    endDate: '2023-06-30',
    progress: 65,
    members: 4,
    issues: 8,
    status: 'In Progress',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile application',
    startDate: '2023-02-01',
    endDate: '2023-08-15',
    progress: 40,
    members: 6,
    issues: 12,
    status: 'In Progress',
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integrate third-party APIs into the platform',
    startDate: '2023-04-10',
    endDate: '2023-05-20',
    progress: 85,
    members: 3,
    issues: 5,
    status: 'In Progress',
  },
  {
    id: '4',
    name: 'Database Migration',
    description: 'Migrate from SQL to NoSQL database',
    startDate: '2023-05-01',
    endDate: '2023-07-15',
    progress: 20,
    members: 4,
    issues: 7,
    status: 'Planning',
  },
  {
    id: '5',
    name: 'Security Audit',
    description: 'Perform security audit and implement fixes',
    startDate: '2023-03-01',
    endDate: '2023-04-15',
    progress: 100,
    members: 2,
    issues: 3,
    status: 'Completed',
  },
  {
    id: '6',
    name: 'User Authentication System',
    description: 'Implement OAuth and two-factor authentication',
    startDate: '2023-04-15',
    endDate: '2023-06-01',
    progress: 50,
    members: 3,
    issues: 6,
    status: 'In Progress',
  },
];

export function ProjectsContent() {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Projects</h1>
          <Button
            className='cursor-pointer'
            onClick={() => router.push('/projects/new')}
          >
            <Plus className='mr-2 h-4 w-4' />
            New Project
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search projects...'
              className='pl-8'
            />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Manage Team</DropdownMenuItem>
                      <DropdownMenuItem>View Issues</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge
                  variant='outline'
                  className={getStatusColor(project.status)}
                >
                  {project.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-4'>
                  {project.description}
                </p>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center text-sm'>
                    <span>Progress</span>
                    <span className='font-medium'>{project.progress}%</span>
                  </div>
                  <Progress
                    value={project.progress}
                    className={getProgressColor(project.progress)}
                  />
                  <div className='flex justify-between text-sm'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span>
                        {new Date(project.startDate).toLocaleDateString()} -{' '}
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='border-t pt-4 flex justify-between'>
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{project.members} members</span>
                </div>
                <div className='text-sm'>
                  <span>{project.issues} issues</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
