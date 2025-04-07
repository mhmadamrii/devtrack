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
import { getStatusColor } from '~/lib/utils';

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

const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    description:
      'Redesign the company website with modern UI/UX principles. The new design should be responsive, accessible, and align with our updated brand guidelines. Key objectives include improving user engagement, reducing bounce rates, and increasing conversion rates.',
    startDate: '2023-03-15',
    endDate: '2023-06-30',
    progress: 65,
    members: [
      { id: '1', name: 'John Doe', role: 'Frontend Developer', avatar: 'JD' },
      { id: '2', name: 'Jane Smith', role: 'UI/UX Designer', avatar: 'JS' },
      { id: '3', name: 'Mike Johnson', role: 'Project Manager', avatar: 'MJ' },
      {
        id: '7',
        name: 'Robert Wilson',
        role: 'Frontend Developer',
        avatar: 'RW',
      },
    ],
    issues: [
      {
        id: '1',
        title: 'Login page not responsive',
        dateAssigned: '2023-04-01',
        assignedTo: 'John Doe',
        status: 'In Progress',
        priority: 'Medium',
      },
      {
        id: '3',
        title: 'Missing validation on form submission',
        dateAssigned: '2023-04-03',
        assignedTo: 'Mike Johnson',
        status: 'Resolved',
        priority: 'Low',
      },
      {
        id: '7',
        title: 'Payment gateway integration issue',
        dateAssigned: '2023-04-07',
        assignedTo: 'Mike Johnson',
        status: 'In Progress',
        priority: 'High',
      },
    ],
    activities: [
      {
        id: '1',
        user: 'Jane Smith',
        action: 'updated the design mockups',
        time: '2 days ago',
      },
      {
        id: '2',
        user: 'Mike Johnson',
        action: 'changed the project deadline',
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
        action: 'was assigned to the project',
        time: '1 week ago',
      },
      {
        id: '5',
        user: 'Jane Smith',
        action: 'created a new issue',
        time: '1 week ago',
      },
    ],
    status: 'In Progress',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description:
      'Develop a cross-platform mobile application for iOS and Android. The app will provide users with access to our core services, real-time notifications, and a personalized dashboard. We aim to deliver a seamless and intuitive user experience across all devices.',
    startDate: '2023-02-01',
    endDate: '2023-08-15',
    progress: 40,
    members: [
      { id: '2', name: 'Jane Smith', role: 'UI/UX Designer', avatar: 'JS' },
      { id: '4', name: 'Sarah Williams', role: 'QA Engineer', avatar: 'SW' },
      { id: '6', name: 'Emily Davis', role: 'Backend Developer', avatar: 'ED' },
      {
        id: '7',
        name: 'Robert Wilson',
        role: 'Frontend Developer',
        avatar: 'RW',
      },
    ],
    issues: [
      {
        id: '4',
        title: 'Performance issues on dashboard',
        dateAssigned: '2023-04-04',
        assignedTo: 'Sarah Williams',
        status: 'In Progress',
        priority: 'High',
      },
      {
        id: '6',
        title: 'User profile image upload fails',
        dateAssigned: '2023-04-06',
        assignedTo: 'Jane Smith',
        status: 'Open',
        priority: 'Medium',
      },
    ],
    activities: [
      {
        id: '1',
        user: 'Emily Davis',
        action: 'implemented user authentication',
        time: '1 day ago',
      },
      {
        id: '2',
        user: 'Sarah Williams',
        action: 'reported a new bug',
        time: '3 days ago',
      },
      {
        id: '3',
        user: 'Robert Wilson',
        action: 'updated the navigation component',
        time: '4 days ago',
      },
      {
        id: '4',
        user: 'Jane Smith',
        action: 'finalized the app icon design',
        time: '1 week ago',
      },
    ],
    status: 'In Progress',
  },
  {
    id: '3',
    name: 'API Integration',
    description:
      'Integrate third-party APIs into the platform to extend functionality and improve service offerings. This includes payment gateways, social media integrations, and data analytics services.',
    startDate: '2023-04-10',
    endDate: '2023-05-20',
    progress: 85,
    members: [
      { id: '1', name: 'John Doe', role: 'Frontend Developer', avatar: 'JD' },
      { id: '6', name: 'Emily Davis', role: 'Backend Developer', avatar: 'ED' },
    ],
    issues: [
      {
        id: '2',
        title: 'API endpoint returns 500 error',
        dateAssigned: '2023-04-02',
        assignedTo: 'Jane Smith',
        status: 'Open',
        priority: 'Critical',
      },
      {
        id: '8',
        title: 'Search functionality not working',
        dateAssigned: '2023-04-08',
        assignedTo: 'Sarah Williams',
        status: 'Resolved',
        priority: 'Medium',
      },
    ],
    activities: [
      {
        id: '1',
        user: 'Emily Davis',
        action: 'implemented the payment gateway API',
        time: '2 days ago',
      },
      {
        id: '2',
        user: 'John Doe',
        action: 'fixed the authentication token issue',
        time: '4 days ago',
      },
      {
        id: '3',
        user: 'Emily Davis',
        action: 'updated API documentation',
        time: '1 week ago',
      },
    ],
    status: 'In Progress',
  },
  {
    id: '4',
    name: 'Database Migration',
    description:
      'Migrate from SQL to NoSQL database to improve scalability and performance. This project involves data mapping, migration strategy development, testing, and deployment.',
    startDate: '2023-05-01',
    endDate: '2023-07-15',
    progress: 20,
    members: [
      { id: '3', name: 'Mike Johnson', role: 'Project Manager', avatar: 'MJ' },
      { id: '5', name: 'David Brown', role: 'DevOps Engineer', avatar: 'DB' },
      { id: '6', name: 'Emily Davis', role: 'Backend Developer', avatar: 'ED' },
    ],
    issues: [
      {
        id: '5',
        title: 'Database connection timeout',
        dateAssigned: '2023-04-05',
        assignedTo: 'John Doe',
        status: 'Open',
        priority: 'Critical',
      },
    ],
    activities: [
      {
        id: '1',
        user: 'David Brown',
        action: 'set up the new database cluster',
        time: '3 days ago',
      },
      {
        id: '2',
        user: 'Emily Davis',
        action: 'created data migration scripts',
        time: '5 days ago',
      },
      {
        id: '3',
        user: 'Mike Johnson',
        action: 'updated the project timeline',
        time: '1 week ago',
      },
    ],
    status: 'Planning',
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

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
        <h2 className='text-2xl font-bold mb-2'>Project Not Found</h2>
        <p className='text-muted-foreground mb-6'>
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href='/projects'>Back to Projects</Link>
        </Button>
      </div>
    );
  }

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
              {project.status}
            </Badge>
          </div>
          <p className='text-muted-foreground mt-1'>
            <Calendar className='inline-block h-4 w-4 mr-1' />
            {new Date(project.startDate).toLocaleDateString()} -{' '}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' className='gap-2' asChild>
            <Link href={`/projects/edit/${project.id}`}>
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
            Issues ({project.issues.length})
          </TabsTrigger>
          <TabsTrigger value='team'>
            Team ({project.members.length})
          </TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <Card className='border-border'>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Key information and progress about this project
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
                        {project.members.length}
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
                          project.issues.filter(
                            (issue) => issue.status !== 'Resolved',
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
                          project.issues.filter(
                            (issue) => issue.status === 'Resolved',
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
                  {project.members.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className='flex items-center gap-2 p-2 border rounded-md'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{member.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {member.role}
                        </div>
                      </div>
                    </div>
                  ))}
                  {project.members.length > 4 && (
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
                  {project.issues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className='flex items-center justify-between p-3 border rounded-md'
                    >
                      <div className='flex flex-col'>
                        <div className='font-medium'>{issue.title}</div>
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
                  {project.issues.length > 3 && (
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
                  {project.issues.length > 0 ? (
                    project.issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className='font-medium'>
                          {issue.title}
                        </TableCell>
                        <TableCell>
                          {new Date(issue.dateAssigned).toLocaleDateString()}
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
                        No issues found for this project.
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
                // Refresh the project data
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
                  This project doesn't have any team members assigned yet.
                </p>
                <AddTeamMemberDialog
                  projectId={parseInt(projectId)}
                  variant='outline'
                  onSuccess={() => {
                    // Refresh the project data
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
                Recent actions and updates on this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {project.activities.map((activity, index) => (
                  <div key={activity.id} className='relative pl-6'>
                    {index < project.activities.length - 1 && (
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
