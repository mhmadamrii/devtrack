'use client';

import { api } from '~/trpc/react';
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Mail, Building2, CalendarDays, UserCircle2 } from 'lucide-react';
import { authClient } from '~/server/auth/client';

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();

  if (status === 'loading' || isPending) {
    return <ProfileSkeleton />;
  }

  if (!session) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>
        <p className='text-muted-foreground'>
          Please sign in to view your profile
        </p>
      </div>
    );
  }

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold'>Profile</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={session?.user.image ?? ''}
                    alt={session?.user.name ?? ''}
                  />
                  <AvatarFallback>
                    {session?.user.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-xl font-semibold'>
                    {session?.user.name}
                  </h2>
                  <p className='text-muted-foreground'>
                    {session?.user.role || 'No role set'}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center space-x-2'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <span>{session?.user?.email}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Building2 className='h-4 w-4 text-muted-foreground' />
                  <span>{session?.user.name || 'No company set'}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CalendarDays className='h-4 w-4 text-muted-foreground' />
                  <span>
                    Joined{' '}
                    {new Date(session?.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <UserCircle2 className='h-4 w-4 text-muted-foreground' />
                  <span>
                    Account Status: {session?.user.banned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Email Verification
                </p>
                <div className='flex items-center space-x-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${session?.user.emailVerified ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span>
                    {session?.user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Onboarding Status
                </p>
                <div className='flex items-center space-x-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${session?.user.onboarded ? 'bg-green-500' : 'bg-yellow-500'}`}
                  />
                  <span>
                    {session?.user?.onboarded ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              {session?.user.banned && (
                <div className='mt-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg'>
                  <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                    Account Restricted
                  </p>
                  <p className='text-sm text-red-600 dark:text-red-300 mt-1'>
                    {session?.user.banReason}
                  </p>
                  {session?.user.banExpires && (
                    <p className='text-sm text-red-600 dark:text-red-300 mt-1'>
                      Expires:{' '}
                      {new Date(session?.user.banExpires).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <div className='p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6'>
      <Skeleton className='h-10 w-32' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Skeleton className='h-[300px] rounded-lg' />
        <Skeleton className='h-[300px] rounded-lg' />
      </div>
    </div>
  );
}
