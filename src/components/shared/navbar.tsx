'use client';

import Link from 'next/link';

import { useRouter } from 'nextjs-toploader/app';
import { useState, useEffect } from 'react';
import { Bell, Menu, Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';
import { usePathname } from 'next/navigation';
import { authClient } from '~/server/auth/client';
import { NotificationPopover } from './notification-popover';
import { toast } from 'sonner';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

const NAV_LINKS = [
  {
    name: 'Dashboard',
    link: '/',
  },
  {
    name: 'Issues',
    link: '/issues',
  },
  {
    name: 'Projects',
    link: '/projects',
  },
  {
    name: 'Team',
    link: '/members',
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-200',
        scrolled ? 'bg-background/10 backdrop-blur-3xl' : 'bg-background',
      )}
    >
      <div className='flex h-16 items-center w-full justify-between border px-4 md:px-6'>
        <div className='flex items-center gap-5'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[240px] sm:w-[300px]'>
              <nav className='flex flex-col gap-4 mt-6'>
                {NAV_LINKS.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className='text-lg font-semibold'
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href='/' className={cn('flex items-center gap-2', {})}>
            <span className='font-bold text-xl'>DevTrack</span>
          </Link>
          <nav className='hidden md:flex items-center gap-6'>
            {NAV_LINKS.map((item, idx) => (
              <Link
                prefetch={true}
                key={idx}
                href={item.link}
                className={cn('font-medium', {
                  'pointer-events-none opacity-60': pathname === item.link,
                })}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden md:flex relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search...'
              className='w-[200px] lg:w-[300px] pl-8'
            />
          </div>

          <ThemeToggle />
          <NotificationPopover />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full h-8 w-8 border cursor-pointer'
              >
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='https://github.com/shadcn.png' alt='User' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='end'>
              <div className='flex items-center cursor-pointer gap-4 pb-4'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src='/placeholder-user.jpg' alt='User' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                  <h4 className='font-semibold'>{session?.user?.name}</h4>
                  <p className='text-sm text-muted-foreground'>
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <Separator className='my-2' />

              <div className='space-y-1 py-2'>
                <div className='text-xs font-semibold text-muted-foreground py-1'>
                  ACCOUNT
                </div>
                <Button
                  onClick={() => router.prefetch('/profile')}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start gap-2'
                >
                  <User className='h-4 w-4' />
                  Profile
                </Button>
                <Button
                  onClick={() => router.prefetch('/settings')}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start gap-2'
                >
                  <Settings className='h-4 w-4' />
                  Settings
                </Button>
              </div>

              <Separator className='my-2' />

              <Button
                variant='ghost'
                size='sm'
                className='w-full cursor-pointer justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                onClick={async () =>
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        toast.success('Successfully logged out');
                        router.push('/hi');
                      },
                    },
                  })
                }
              >
                <LogOut className='h-4 w-4' />
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
