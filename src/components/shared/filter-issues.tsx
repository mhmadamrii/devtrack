'use client';

// import necessary components and hooks
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Search } from 'lucide-react';

// Sample data
const projects = [
  {
    id: '1',
    name: 'Website Redesign',
  },
  {
    id: '2',
    name: 'Mobile App Development',
  },
  {
    id: '3',
    name: 'API Integration',
  },
  {
    id: '4',
    name: 'Database Migration',
  },
];

export function FilterIssues() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  return (
    <Card className='border-border'>
      <CardHeader>
        <CardTitle>Filter Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Search</label>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search issues...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Project</label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Filter by project' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='Open'>Open</SelectItem>
                <SelectItem value='In Progress'>In Progress</SelectItem>
                <SelectItem value='Resolved'>Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Filter by priority' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Priorities</SelectItem>
                <SelectItem value='Critical'>Critical</SelectItem>
                <SelectItem value='High'>High</SelectItem>
                <SelectItem value='Medium'>Medium</SelectItem>
                <SelectItem value='Low'>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
