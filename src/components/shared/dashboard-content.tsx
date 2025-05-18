'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { ProjectChart } from '../charts/project-chart';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { NewIssueDialog } from '~/components/shared/new-issue-dialog';
import { StatusTable } from './status-table';
import { TableSkeleton } from '../skeletons/table-skeleton';
import { AssigneeBy } from './assignee-by';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';

import {
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Plus,
  Bug,
  Activity,
  Zap,
  Users,
  LineChart,
  Target,
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
  const [timeRange, setTimeRange] = useState<string>('week');
  const { data: issues, isLoading } = api.issue.getAllIssues.useQuery();
  const { data: allProjects } = api.project.getAllProjects.useQuery();

  const totalIssues = issues?.length || 0;

  const filteredIssues =
    selectedProject === 'all'
      ? issues
      : issues?.filter((issue) => issue.projectName === selectedProject);

  const resolvedIssues =
    issues?.filter((issue) => issue.status === 'closed').length || 0;

  const unresolvedIssues =
    issues?.filter((issue) => issue.status !== 'closed').length || 0;

  const highPriorityIssues =
    issues?.filter((issue) => issue.priority === 'high').length || 0;

  const completionRate = totalIssues
    ? Math.round((resolvedIssues / totalIssues) * 100)
    : 0;

  // Group issues by priority for metrics
  const issuesByPriority =
    issues?.reduce(
      (acc, issue) => {
        acc[issue.priority] = (acc[issue.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  const getProgressColor = (value: number): string => {
    if (value < 30) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              Monitor and manage your project issues from one place
            </p>
          </div>
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

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            <TabsTrigger value='issues'>Issues</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card className='border-border'>
                <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Total Issues
                  </CardTitle>
                  <AlertCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalIssues}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Across all projects
                  </p>
                </CardContent>
              </Card>

              <Card className='border-border'>
                <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Resolved Issues
                  </CardTitle>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{resolvedIssues}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {completionRate}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card className='border-border'>
                <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Open Issues
                  </CardTitle>
                  <Clock className='h-4 w-4 text-orange-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{unresolvedIssues}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Need attention
                  </p>
                </CardContent>
              </Card>

              <Card className='border-border'>
                <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    High Priority
                  </CardTitle>
                  <Zap className='h-4 w-4 text-red-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{highPriorityIssues}</div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Require immediate action
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='w-full h-[500px] flex flex-col gap-3 sm:flex-row'>
              <ProjectChart projects={allProjects} />
              <ProjectChart projects={allProjects} />
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='border-border'>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Issues by priority level</CardDescription>
                </CardHeader>
                <CardContent className='flex items-center justify-center pt-6'>
                  <div className='grid grid-cols-2 gap-4 w-full'>
                    {Object.entries(issuesByPriority).map(
                      ([priority, count]) => (
                        <Card key={priority} className='border-border'>
                          <CardContent className='p-4 flex flex-col items-center justify-center text-center'>
                            <Badge
                              variant='outline'
                              className={
                                getPriorityColor(priority) + ' mb-2 capitalize'
                              }
                            >
                              {priority}
                            </Badge>
                            <div className='text-2xl font-bold'>{count}</div>
                            <p className='text-xs text-muted-foreground mt-1'>
                              {totalIssues
                                ? Math.round((count / totalIssues) * 100)
                                : 0}
                              % of total
                            </p>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className='border-border'>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions on issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {filteredIssues?.slice(0, 5).map((issue, index) => (
                      <div key={index} className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-full ${getPriorityColor(issue.priority)}`}
                        >
                          <Activity className='h-4 w-4' />
                        </div>
                        <div>
                          <p className='font-medium'>{issue.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            Status changed to {issue.status.replace('_', ' ')}
                          </p>
                        </div>
                        <div className='ml-auto text-xs text-muted-foreground'>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='issues'>
            <Card className='rounded-sm'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>All Issues</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className='w-[160px]'>
                    <SelectValue placeholder='Filter by time' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='day'>Last 24 hours</SelectItem>
                    <SelectItem value='week'>Last 7 days</SelectItem>
                    <SelectItem value='month'>Last 30 days</SelectItem>
                    <SelectItem value='year'>Last year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className='min-h-[500px]'>
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
                        <TableCell className='font-medium'>
                          {issue.name}
                        </TableCell>
                        <TableCell>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{issue.assignedTo}</TableCell>
                        <TableCell>
                          <AssigneeBy
                            teamId={
                              parseInt(
                                issue.assignedTo
                                  .toString()
                                  .replace(/[^0-9]/g, '')
                                  .slice(0, 9),
                              ) || 0
                            }
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
