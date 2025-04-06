'use client';

import Link from 'next/link';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  MessageSquare,
  User,
  Users,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

// Sample notification data
export const notifications = [
  {
    id: '1',
    title: 'New issue assigned',
    description:
      "John Doe assigned you to issue #123: 'Login page not responsive'",
    time: '10 minutes ago',
    read: false,
    type: 'issue',
    project: 'Website Redesign',
    user: {
      name: 'John Doe',
      avatar: 'JD',
    },
  },
  {
    id: '2',
    title: 'Project status updated',
    description:
      "Mobile App Development project status changed to 'In Progress'",
    time: '1 hour ago',
    read: false,
    type: 'project',
    project: 'Mobile App Development',
    user: {
      name: 'Jane Smith',
      avatar: 'JS',
    },
  },
  {
    id: '3',
    title: 'Comment on your issue',
    description:
      "Mike Johnson commented on issue #456: 'API endpoint returns 500 error'",
    time: '3 hours ago',
    read: false,
    type: 'comment',
    project: 'API Integration',
    user: {
      name: 'Mike Johnson',
      avatar: 'MJ',
    },
  },
  {
    id: '4',
    title: 'Team member added',
    description: 'Sarah Williams added to Database Migration project',
    time: '5 hours ago',
    read: true,
    type: 'team',
    project: 'Database Migration',
    user: {
      name: 'Sarah Williams',
      avatar: 'SW',
    },
  },
  {
    id: '5',
    title: 'Deadline approaching',
    description: 'Website Redesign project deadline is in 3 days',
    time: '1 day ago',
    read: true,
    type: 'deadline',
    project: 'Website Redesign',
  },
  {
    id: '6',
    title: 'Issue resolved',
    description:
      "Issue #789: 'Missing validation on form submission' was marked as resolved",
    time: '2 days ago',
    read: true,
    type: 'issue',
    project: 'Website Redesign',
    user: {
      name: 'Robert Wilson',
      avatar: 'RW',
    },
  },
  {
    id: '7',
    title: 'Mentioned in comment',
    description: 'Emily Davis mentioned you in a comment on issue #321',
    time: '3 days ago',
    read: true,
    type: 'mention',
    project: 'User Authentication System',
    user: {
      name: 'Emily Davis',
      avatar: 'ED',
    },
  },
];

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const unreadCount = localNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const markAllAsRead = () => {
    setLocalNotifications(
      localNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
          >
            !
          </Badge>
        );
      case 'project':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
          >
            <Clock className='h-4 w-4' />
          </Badge>
        );
      case 'comment':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
          >
            <MessageSquare className='h-4 w-4' />
          </Badge>
        );
      case 'team':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
          >
            <Users className='h-4 w-4' />
          </Badge>
        );
      case 'deadline':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300'
          >
            <Clock className='h-4 w-4' />
          </Badge>
        );
      case 'mention':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
          >
            <User className='h-4 w-4' />
          </Badge>
        );
      default:
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center'
          >
            <Bell className='h-4 w-4' />
          </Badge>
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[380px] p-0' align='end'>
        <div className='flex items-center justify-between p-4'>
          <h3 className='font-semibold'>Notifications</h3>
          {unreadCount > 0 && (
            <Button variant='ghost' size='sm' onClick={markAllAsRead}>
              <Check className='mr-2 h-4 w-4' />
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className='max-h-[60vh] overflow-auto'>
          {localNotifications.length > 0 ? (
            <div>
              {localNotifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex gap-3 p-4 hover:bg-muted/50 transition-colors',
                    !notification.read && 'bg-muted/30',
                  )}
                >
                  <div className='flex-shrink-0'>
                    {notification.user ? (
                      <Avatar>
                        <AvatarFallback>
                          {notification.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p
                      className={cn(
                        'text-sm',
                        !notification.read && 'font-medium',
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {notification.description}
                    </p>
                    <div className='flex items-center justify-between'>
                      <p className='text-xs text-muted-foreground'>
                        {notification.time}
                      </p>
                      <Badge variant='outline' className='text-xs'>
                        {notification.project}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Bell className='h-12 w-12 text-muted-foreground/50 mb-4' />
              <h3 className='font-medium mb-1'>No notifications</h3>
              <p className='text-sm text-muted-foreground'>
                You're all caught up!
              </p>
            </div>
          )}
        </div>
        <Separator />
        <div className='p-4'>
          <Button asChild variant='outline' className='w-full justify-between'>
            <Link href='/notifications'>
              See all notifications
              <ChevronRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
