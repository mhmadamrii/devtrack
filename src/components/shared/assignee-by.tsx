'use client';

import Link from 'next/link';

import { CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card';

interface AssigneeByProps {
  name: string;
  teamId: string;
}

export function AssigneeBy({ name, teamId }: AssigneeByProps) {
  const { data: teamMember, refetch } = api.team.getTeamById.useQuery(
    {
      teamId,
    },
    {
      enabled: false, // Don't fetch on component mount
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    },
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          onMouseEnter={async () => {
            // Only fetch if we don't already have the data
            if (!teamMember) {
              await refetch();
            }
          }}
          className='text-blue-500 underline'
          variant='link'
          asChild
        >
          <Link className='text-blue-500 underline' href={`/profile/${teamId}`}>
            {name}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-96'>
        {teamMember && teamMember[0] ? (
          <div className='space-y-4'>
            <div className='flex justify-between space-x-4'>
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teamMember[0].name || 'Unknown')}&background=random`}
                />
                <AvatarFallback>
                  {getInitials(teamMember[0].name)}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-1 flex-1'>
                <h4 className='text-sm font-semibold'>{teamMember[0].name}</h4>
                <p className='text-sm'>
                  {teamMember[0].role}{' '}
                  {teamMember[0].department
                    ? `- ${teamMember[0].department}`
                    : ''}
                </p>
                <p className='text-sm'>{teamMember[0].email}</p>
                {teamMember[0].phone && (
                  <p className='text-sm'>{teamMember[0].phone}</p>
                )}
                <div className='flex items-center pt-2'>
                  <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
                  <span className='text-xs text-muted-foreground'>
                    Joined{' '}
                    {teamMember[0].createdAt
                      ? formatDate(new Date(teamMember[0].createdAt))
                      : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Projects section */}
            {teamMember[0].projects && teamMember[0].projects.length > 0 && (
              <div className='border-t pt-3'>
                <h5 className='text-xs font-medium mb-2'>Current Projects</h5>
                <div className='space-y-2'>
                  {teamMember[0].projects.map((project) => (
                    <div key={project.projectId} className='text-xs'>
                      <span className='font-medium'>{project.projectName}</span>
                      {project.projectRole && (
                        <span className='text-muted-foreground'>
                          {' '}
                          - {project.projectRole}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Issues section */}
            {teamMember[0].assignedIssues &&
              teamMember[0].assignedIssues.length > 0 && (
                <div className='border-t pt-3'>
                  <h5 className='text-xs font-medium mb-2'>Assigned Issues</h5>
                  <div className='space-y-2'>
                    {teamMember[0].assignedIssues.map((issue) => (
                      <div key={issue.id} className='text-xs flex items-center'>
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                        ></span>
                        <span className='font-medium'>{issue.name}</span>
                        <span className='text-muted-foreground ml-1'>
                          ({issue.projectName})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className='flex items-center justify-center h-20'>
            <p className='text-sm text-muted-foreground'>
              Loading team member details...
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
