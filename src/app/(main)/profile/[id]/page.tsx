import { api } from '~/trpc/server';
import { Navbar } from '~/components/shared/navbar';
import { Suspense } from 'react';
import { ProfileSkeleton } from '~/components/skeletons/profile-skeleton';

import {
  ChevronRight,
  Home,
  Mail,
  Phone,
  Calendar,
  Briefcase,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const teams = await api.team.getAllTeams();

  return teams
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 20)
    .map((team) => ({
      id: team.id.toString(),
    }));
}

async function TeamMemberProfile({ teamId }: { teamId: string }) {
  const teamMember = await api.team.getTeamById({
    teamId: Number(teamId),
  });

  if (!teamMember || !teamMember[0]) {
    return <div className='p-4 text-center'>Team member not found</div>;
  }

  const member = teamMember[0];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
        <div className='h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold'>
          {member.name
            ?.split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase() || 'N/A'}
        </div>
        <div>
          <h1 className='text-2xl font-bold'>{member.name}</h1>
          <p className='text-muted-foreground'>
            {member.role} {member.department ? `- ${member.department}` : ''}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='border rounded-lg p-4 space-y-3'>
          <h2 className='text-lg font-semibold'>Contact Information</h2>

          <div className='flex items-center space-x-2'>
            <Mail className='h-4 w-4 text-muted-foreground' />
            <span>{member.email}</span>
          </div>

          {member.phone && (
            <div className='flex items-center space-x-2'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <span>{member.phone}</span>
            </div>
          )}

          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
            <span>
              Joined {member.createdAt ? formatDate(member.createdAt) : 'N/A'}
            </span>
          </div>
        </div>

        {member.projects && member.projects.length > 0 && (
          <div className='border rounded-lg p-4 space-y-3'>
            <h2 className='text-lg font-semibold'>Current Projects</h2>
            <div className='space-y-2'>
              {member.projects.map((project) => (
                <div
                  key={project.projectId}
                  className='flex items-center space-x-2'
                >
                  <Briefcase className='h-4 w-4 text-muted-foreground' />
                  <span>{project.projectName}</span>
                  {project.projectRole && (
                    <span className='text-sm text-muted-foreground'>
                      ({project.projectRole})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {member.assignedIssues && member.assignedIssues.length > 0 && (
        <div className='border rounded-lg p-4 space-y-3'>
          <h2 className='text-lg font-semibold'>Assigned Issues</h2>
          <div className='space-y-2'>
            {member.assignedIssues.map((issue) => (
              <div key={issue.id} className='flex items-center space-x-2'>
                <span
                  className={`w-2 h-2 rounded-full ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                ></span>
                <span>{issue.name}</span>
                <span className='text-sm text-muted-foreground'>
                  ({issue.projectName})
                </span>
                <span className='text-xs px-2 py-1 rounded-full bg-gray-100'>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ProfileId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = await params;

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6 max-w-4xl mx-auto'>
        <Breadcrumb className='mb-2'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className='w-[70px] flex items-center gap-2'
                href='/'
              >
                <Home className='h-4 w-4 mr-1' />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Team Member Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense fallback={<ProfileSkeleton />}>
          <TeamMemberProfile teamId={id.id} />
        </Suspense>
      </div>
    </main>
  );
}
