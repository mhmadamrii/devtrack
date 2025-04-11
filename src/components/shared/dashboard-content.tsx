'use client';

import PaginationTable from '../ui/pagination-table';

import { useState } from 'react';
import { AssigneeBy } from './assignee-by';
import { api } from '~/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { NewIssueDialog } from '~/components/shared/new-issue-dialog';
import { getStatusColor } from '~/lib/utils';
import { StatusTable } from './status-table';
import { TableSkeleton } from '../skeletons/table-skeleton';

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

export function DashboardContent() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const { data: issues, isLoading } = api.issue.getAllIssues.useQuery();
  const totalIssues = issues?.length;

  const filteredIssues =
    selectedProject === 'all'
      ? issues
      : issues?.filter((issue) => issue.projectName === selectedProject);

  const resolvedIssues = issues?.filter(
    (issue) => issue.status === 'closed',
  ).length;

  const unresolvedIssues = issues?.filter(
    (issue) => issue.status !== 'closed',
  ).length;

  const getPriorityColor = (priority: string): string => {
    console.log('priority', priority);
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'high_':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'low':
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
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableSkeleton />}
                {filteredIssues?.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className='font-medium'>{issue.name}</TableCell>
                    <TableCell>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{issue.assignedTo}</TableCell>
                    <TableCell>
                      <AssigneeBy
                        teamId={issue.assignedTo ?? 0}
                        name={issue.assigneeName ?? ''}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getPriorityColor(issue.priority) + ''}
                      >
                        {issue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusTable
                        issueId={issue.id}
                        currentStatus={issue.status}
                      />
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
