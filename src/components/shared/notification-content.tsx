'use client';

import type React from 'react';

import { useState } from 'react';
import { Bell, Check, CheckCheck, Filter, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { notifications } from '~/components/shared/notification-popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export function NotificationsContent() {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const unreadCount = localNotifications.filter(
    (notification) => !notification.read,
  ).length;
  const readCount = localNotifications.filter(
    (notification) => notification.read,
  ).length;

  const markAllAsRead = () => {
    setLocalNotifications(
      localNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const clearAllRead = () => {
    setLocalNotifications(
      localNotifications.filter((notification) => !notification.read),
    );
  };

  const toggleRead = (id: string) => {
    setLocalNotifications(
      localNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification,
      ),
    );
  };

  const filteredNotifications = localNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      notification.project.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'all' || notification.type === typeFilter;

    return matchesSearch && matchesType;
  });

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
            <Bell className='h-4 w-4' />
          </Badge>
        );
      case 'comment':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
          >
            <Bell className='h-4 w-4' />
          </Badge>
        );
      case 'team':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
          >
            <Bell className='h-4 w-4' />
          </Badge>
        );
      case 'deadline':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300'
          >
            <Bell className='h-4 w-4' />
          </Badge>
        );
      case 'mention':
        return (
          <Badge
            variant='outline'
            className='h-8 w-8 rounded-full p-0 flex items-center justify-center bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
          >
            <Bell className='h-4 w-4' />
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
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6 max-w-4xl mx-auto'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Notifications</h1>
          <div className='flex items-center gap-2'>
            {unreadCount > 0 && (
              <Button variant='outline' onClick={markAllAsRead}>
                <CheckCheck className='mr-2 h-4 w-4' />
                Mark all as read
              </Button>
            )}
            {readCount > 0 && (
              <Button variant='outline' onClick={clearAllRead}>
                <Trash2 className='mr-2 h-4 w-4' />
                Clear read
              </Button>
            )}
          </div>
        </div>

        <Card className='border-border'>
          <CardHeader>
            <CardTitle>Filter Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>Search</label>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='search'
                    placeholder='Search notifications...'
                    className='pl-8'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium'>Type</label>
                <div className='flex items-center gap-2'>
                  <Filter className='h-4 w-4 text-muted-foreground' />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Filter by type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='issue'>Issues</SelectItem>
                      <SelectItem value='project'>Projects</SelectItem>
                      <SelectItem value='comment'>Comments</SelectItem>
                      <SelectItem value='team'>Team</SelectItem>
                      <SelectItem value='deadline'>Deadlines</SelectItem>
                      <SelectItem value='mention'>Mentions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue='all' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='all'>
              All
              <Badge variant='secondary' className='ml-2'>
                {localNotifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='unread'>
              Unread
              <Badge variant='secondary' className='ml-2'>
                {unreadCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='read'>
              Read
              <Badge variant='secondary' className='ml-2'>
                {readCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='space-y-4'>
            <NotificationList
              notifications={filteredNotifications}
              toggleRead={toggleRead}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>

          <TabsContent value='unread' className='space-y-4'>
            <NotificationList
              notifications={filteredNotifications.filter((n) => !n.read)}
              toggleRead={toggleRead}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>

          <TabsContent value='read' className='space-y-4'>
            <NotificationList
              notifications={filteredNotifications.filter((n) => n.read)}
              toggleRead={toggleRead}
              getNotificationIcon={getNotificationIcon}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

interface NotificationListProps {
  notifications: typeof notifications;
  toggleRead: (id: string) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
}

function NotificationList({
  notifications,
  toggleRead,
  getNotificationIcon,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <Bell className='h-12 w-12 text-muted-foreground/50 mb-4' />
        <h3 className='font-medium mb-1'>No notifications</h3>
        <p className='text-sm text-muted-foreground'>You're all caught up!</p>
      </div>
    );
  }

  return (
    <Card className='border-border'>
      <CardContent className='p-0'>
        <div className='divide-y'>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'flex gap-4 p-4 hover:bg-muted/50 transition-colors',
                !notification.read && 'bg-muted/30',
              )}
            >
              <div className='flex-shrink-0'>
                {notification.user ? (
                  <Avatar>
                    <AvatarFallback>{notification.user.avatar}</AvatarFallback>
                  </Avatar>
                ) : (
                  getNotificationIcon(notification.type)
                )}
              </div>
              <div className='flex-1 space-y-1'>
                <p
                  className={cn('text-sm', !notification.read && 'font-medium')}
                >
                  {notification.title}
                </p>
                <p className='text-sm text-muted-foreground'>
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
              <div className='flex-shrink-0'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleRead(notification.id)}
                  title={notification.read ? 'Mark as unread' : 'Mark as read'}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      notification.read
                        ? 'text-muted-foreground/50'
                        : 'text-green-500',
                    )}
                  />
                  <span className='sr-only'>
                    {notification.read ? 'Mark as unread' : 'Mark as read'}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
