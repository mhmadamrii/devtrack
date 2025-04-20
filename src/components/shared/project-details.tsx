'use client';

import Link from 'next/link';

import type { ProjectDetailsType } from '~/server/db/types';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { NewIssueDialog } from '../shared/new-issue-dialog';
import { AddTeamMemberDialog } from '../shared/add-team-member-dialog';

import {
  Calendar,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  History,
  Mail,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const dummyActivities = [
  {
    id: '1',
    user: 'Jane Smith',
    action: 'updated the design mockups',
    time: '2 days ago',
  },
  {
    id: '2',
    user: 'Mike Johnson',
    action: 'changed the projectDetails deadline',
    time: '3 days ago',
  },
  {
    id: '3',
    user: 'John Doe',
    action: 'resolved issue #3',
    time: '5 days ago',
  },
  {
    id: '4',
    user: 'Robert Wilson',
    action: 'was assigned to the projectDetails',
    time: '1 week ago',
  },
  {
    id: '5',
    user: 'Jane Smith',
    action: 'created a new issue',
    time: '1 week ago',
  },
];

interface ProjectDetailsProps {
  projectId: string;
  projectDetails: ProjectDetailsType;
}

export function ProjectDetails({
  projectId,
  projectDetails,
}: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };
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

  const getIssueStatusColor = (status: string) => {
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

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='text-3xl font-bold'>{projectDetails.name}</h1>
            <Badge
              variant='outline'
              className={getStatusColor(projectDetails.status as string)}
            >
              {projectDetails.status}
            </Badge>
          </div>
          <p className='text-muted-foreground mt-1'>
            <Calendar className='inline-block h-4 w-4 mr-1' />
            {new Date().toLocaleDateString()} -{' '}
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' className='gap-2' asChild>
            <Link href={`/projects/edit/${projectDetails.id}`}>
              <Edit className='h-4 w-4' />
              Edit Project
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuItem>Export Details</DropdownMenuItem>
              <DropdownMenuItem>Archive Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        defaultValue='overview'
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='issues'>
            Issues ({projectDetails.issues.length})
          </TabsTrigger>
          <TabsTrigger value='team'>
            Team ({projectDetails.teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <Card className='border-border'>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Key information and progress about this projectDetails
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium mb-2'>Description</h3>
                <p className='text-muted-foreground'>
                  {projectDetails.description}
                </p>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2'>Progress</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span>Overall Completion</span>
                    <span className='font-medium'>
                      {projectDetails.progress}%
                    </span>
                  </div>
                  <Progress
                    value={projectDetails.progress}
                    className={getProgressColor(projectDetails.progress!)}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='border-border'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center justify-between'>
                      <div className='text-2xl font-bold'>
                        {projectDetails.teamMembers.length}
                      </div>
                      <Users className='h-6 w-6 text-muted-foreground' />
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-border'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Open Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center justify-between'>
                      <div className='text-2xl font-bold'>
                        {
                          projectDetails.issues.filter(
                            (issue) => issue.status !== 'closed',
                          ).length
                        }
                      </div>
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
                      <div className='text-2xl font-bold'>
                        {
                          projectDetails.issues.filter(
                            (issue) => issue.status === 'closed',
                          ).length
                        }
                      </div>
                      <CheckCircle2 className='h-6 w-6 text-green-500' />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-4'>
                  Recent Team Members
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {projectDetails.teamMembers.slice(0, 4).map((member) => (
                    <div
                      key={member.teamId}
                      className='flex items-center gap-2 p-2 border rounded-md'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{member.teamName}</div>
                        <div className='text-xs text-muted-foreground'>
                          {member.teamRole}
                        </div>
                      </div>
                    </div>
                  ))}
                  {projectDetails.teamMembers.length > 4 && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-auto'
                      onClick={() => setActiveTab('team')}
                    >
                      View All
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-4'>Recent Issues</h3>
                <div className='space-y-3'>
                  {projectDetails.issues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className='flex items-center justify-between p-3 border rounded-md'
                    >
                      <div className='flex flex-col'>
                        <div className='font-medium'>{issue.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          Assigned to {issue.assignedTo}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={getIssueStatusColor(issue.status)}
                        >
                          {issue.status}
                        </Badge>
                        <Badge
                          variant='outline'
                          className={getPriorityColor(issue.priority)}
                        >
                          {issue.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {projectDetails.issues.length > 3 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setActiveTab('issues')}
                    >
                      View All Issues
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='issues' className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Project Issues</h2>
            <NewIssueDialog>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New Issue
              </Button>
            </NewIssueDialog>
          </div>

          <Card className='border-border'>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date Assigned</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectDetails.issues.length > 0 ? (
                    projectDetails.issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className='font-medium'>
                          {issue.name}
                        </TableCell>
                        <TableCell>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{issue.assignedTo}</TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={getIssueStatusColor(issue.status)}
                          >
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={getPriorityColor(issue.priority)}
                          >
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='sm' className='gap-1'>
                            View Details
                            <ArrowUpRight className='h-3 w-3' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='text-center py-6 text-muted-foreground'
                      >
                        No issues found for this projectDetails.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='team' className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Team Members</h2>
            <AddTeamMemberDialog
              projectId={parseInt(projectId)}
              onSuccess={() => {
                // Refresh the projectDetails data
                window.location.reload();
              }}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {projectDetails.teamMembers &&
            projectDetails.teamMembers.length > 0 ? (
              projectDetails.teamMembers.map((member) => (
                <Card key={member.teamId} className='border-border'>
                  <CardHeader className='pb-2'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback>
                            {member.teamName
                              ?.split(' ')
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase() || 'TM'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className='text-base'>
                            {member.teamName}
                          </CardTitle>
                          <CardDescription>
                            {member.projectRole || member.teamRole}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem asChild>
                            <Link href={`/profile/${member.teamId}`}>
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className='text-red-500'>
                            Remove from Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Clock className='h-4 w-4' />
                      <span>{member.teamDepartment || 'Team Member'}</span>
                    </div>
                    {member.teamEmail && (
                      <div className='flex items-center gap-2 text-sm text-muted-foreground mt-1'>
                        <Mail className='h-4 w-4' />
                        <span>{member.teamEmail}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className='border-t pt-4 flex justify-between'>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/profile/${member.teamId}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant='outline' size='sm'>
                      View Tasks
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className='col-span-3 p-8 text-center border rounded-lg'>
                <Users className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2'>
                  No Team Members Yet
                </h3>
                <p className='text-muted-foreground mb-4'>
                  This projectDetails doesn't have any team members assigned
                  yet.
                </p>
                <AddTeamMemberDialog
                  projectId={parseInt(projectId)}
                  variant='outline'
                  onSuccess={() => {
                    // Refresh the projectDetails data
                    window.location.reload();
                  }}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='activity' className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Activity History</h2>
          </div>

          <Card className='border-border'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <History className='h-5 w-5' />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Recent actions and updates on this projectDetails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {dummyActivities.map((activity, index) => (
                  <div key={activity.id} className='relative pl-6'>
                    {index < dummyActivities.length - 1 && (
                      <div className='absolute top-6 bottom-0 left-[9px] w-[2px] bg-muted' />
                    )}
                    <div className='absolute top-1 left-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center'>
                      <div className='w-2 h-2 rounded-full bg-foreground' />
                    </div>
                    <div className='space-y-1'>
                      <p className='font-medium'>
                        <span className='font-semibold'>{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
