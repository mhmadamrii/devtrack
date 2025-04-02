'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { NewIssueDialog } from '~/components/shared/new-issue-dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

import {
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Plus,
} from 'lucide-react';

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
import PaginationTable from '../ui/pagination-table';

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
];

export function DashboardContent() {
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const filteredIssues =
    selectedProject === 'all'
      ? issues
      : issues.filter((issue) => issue.project === selectedProject);

  const resolvedIssues = issues.filter(
    (issue) => issue.status === 'Resolved',
  ).length;
  const unresolvedIssues = issues.filter(
    (issue) => issue.status !== 'Resolved',
  ).length;
  const totalIssues = issues.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
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
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4' />
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className='w-[180px]'>
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
            <NewIssueDialog>
              <Button className='cursor-pointer'>
                <Plus className='mr-2 h-4 w-4' />
                New Issue
              </Button>
            </NewIssueDialog>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='text-2xl font-bold'>{totalIssues}</div>
                <AlertCircle className='h-6 w-6 text-muted-foreground' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Resolved Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='text-2xl font-bold'>{resolvedIssues}</div>
                <CheckCircle className='h-6 w-6 text-green-500' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-border'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Unresolved Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='text-2xl font-bold'>{unresolvedIssues}</div>
                <Clock className='h-6 w-6 text-orange-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Badge
                            variant='outline'
                            className={
                              getStatusColor(issue.status) +
                              'w-[100px] cursor-pointer rounded-4xl flex justify-center items-center'
                            }
                          >
                            {issue.status}
                          </Badge>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem>Open</ContextMenuItem>
                          <ContextMenuItem>In Progress</ContextMenuItem>
                          <ContextMenuItem>Resolved</ContextMenuItem>
                          <ContextMenuItem>Pending</ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
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
                          <DropdownMenuItem>Reassign</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
