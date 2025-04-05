import { Suspense } from 'react';
import { NewIssueDialog } from './new-issue-dialog';
import { FilterIssues } from './filter-issues';
import { MoreHorizontal, Plus } from 'lucide-react';
import { api } from '~/trpc/server';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

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

async function IssuesCard() {
  const issues = await api.issue.getAllIssues();

  const getPriorityColor = (priority: string) => {
    console.log('priority', priority);
    switch (priority) {
      case 'critical':
        return 'bg-red-100 animate-pulse text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  return (
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
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className='font-medium'>{issue.name}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
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
  );
}

export function IssuesContent() {
  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Issues</h1>
          <NewIssueDialog>
            <Button className='cursor-pointer'>
              <Plus className='mr-2 h-4 w-4' />
              New Issue
            </Button>
          </NewIssueDialog>
        </div>

        <FilterIssues />
        <Suspense fallback={<div>Loading...</div>}>
          <IssuesCard />
        </Suspense>
      </div>
    </main>
  );
}
