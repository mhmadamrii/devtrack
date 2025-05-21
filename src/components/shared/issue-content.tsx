import { Suspense } from 'react';
import { NewIssueDialog } from './new-issue-dialog';
import { FilterIssues } from './filter-issues';
import { MoreHorizontal, Plus } from 'lucide-react';
import { api } from '~/trpc/server';
import { TableSkeleton } from '../skeletons/table-skeleton';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { StatusTable } from './status-table';
import { AssigneeBy } from './assignee-by';

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

async function IssuesCard() {
  const issues = await api.issue.getAllIssues();

  const getPriorityColor = (priority: string) => {
    console.log('priority', priority);
    switch (priority) {
      case 'high':
        return 'bg-red-500 animate-pulse text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'medium':
        return 'bg-orange-500 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };
  return issues.map((issue) => (
    <TableRow key={issue.id}>
      <TableCell className='font-medium'>{issue.name}</TableCell>
      <TableCell>{new Date().toLocaleDateString()}</TableCell>
      <TableCell>
        <AssigneeBy
          teamId={issue.assignedTo ?? 0}
          name={issue.assigneeName ?? ''}
        />
      </TableCell>
      <TableCell>{issue.projectName}</TableCell>
      <TableCell>
        <Badge variant='outline' className={getPriorityColor(issue.priority)}>
          {issue.priority}
        </Badge>
      </TableCell>
      <TableCell>
        <StatusTable
          assignedTo={issue.assignedTo}
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
            <DropdownMenuItem>Change Status</DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
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
        <Card className='border-border rounded-sm'>
          <CardContent className='p-0 min-h-[500px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Suspense fallback={<TableSkeleton />}>
                  <IssuesCard />
                </Suspense>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
