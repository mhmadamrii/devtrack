'use client';

import { useState } from 'react';
import { NewIssueDialog } from './new-issue-dialog';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

// Sample data
const projects = [
  { id: '1', name: 'Website Redesign' },
  { id: '2', name: 'Mobile App Development' },
  { id: '3', name: 'API Integration' },
  { id: '4', name: 'Database Migration' },
];

const issues = [
  {
    id: '1',
    title: 'Login page not responsive',
    dateAssigned: '2023-04-01',
    assignedTo: 'John Doe',
    status: 'In Progress',
    priority: 'Medium',
    project: '1',
  },
  {
    id: '2',
    title: 'API endpoint returns 500 error',
    dateAssigned: '2023-04-02',
    assignedTo: 'Jane Smith',
    status: 'Open',
    priority: 'Critical',
    project: '3',
  },
  {
    id: '3',
    title: 'Missing validation on form submission',
    dateAssigned: '2023-04-03',
    assignedTo: 'Mike Johnson',
    status: 'Resolved',
    priority: 'Low',
    project: '1',
  },
  {
    id: '4',
    title: 'Performance issues on dashboard',
    dateAssigned: '2023-04-04',
    assignedTo: 'Sarah Williams',
    status: 'In Progress',
    priority: 'High',
    project: '2',
  },
  {
    id: '5',
    title: 'Database connection timeout',
    dateAssigned: '2023-04-05',
    assignedTo: 'John Doe',
    status: 'Open',
    priority: 'Critical',
    project: '4',
  },
  {
    id: '6',
    title: 'User profile image upload fails',
    dateAssigned: '2023-04-06',
    assignedTo: 'Jane Smith',
    status: 'Open',
    priority: 'Medium',
    project: '2',
  },
  {
    id: '7',
    title: 'Payment gateway integration issue',
    dateAssigned: '2023-04-07',
    assignedTo: 'Mike Johnson',
    status: 'In Progress',
    priority: 'High',
    project: '1',
  },
  {
    id: '8',
    title: 'Search functionality not working',
    dateAssigned: '2023-04-08',
    assignedTo: 'Sarah Williams',
    status: 'Resolved',
    priority: 'Medium',
    project: '3',
  },
];

export function IssuesContent() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredIssues = issues.filter((issue) => {
    const matchesProject =
      selectedProject === 'all' || issue.project === selectedProject;
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || issue.priority === priorityFilter;

    return matchesProject && matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 animate-pulse text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Issues</h1>
          <NewIssueDialog>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              New Issue
            </Button>
          </NewIssueDialog>
        </div>

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
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
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
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
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

        <Card className='border-border'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className='font-medium'>{issue.title}</TableCell>
                    <TableCell>
                      {new Date(issue.dateAssigned).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{issue.assignedTo}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getPriorityColor(issue.priority)}
                      >
                        {issue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={
                          getStatusColor(issue.status) +
                          'rounded-4xl flex w-full justify-center items-center'
                        }
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Issue</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuItem>Reassign</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
