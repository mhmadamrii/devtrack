'use client';

import Link from 'next/link';
import { Logo } from '~/components/shared/logo';

const menuItems = [
  {
    name: 'Features',
    href: '/features',
  },
  {
    name: 'Solution',
    href: '/solution',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'About',
    href: '/about',
  },
] as const;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className='absolute z-20 h-[60px] flex justify-between items-center top-0 right-0 left-0 container mx-auto'>
        <div>
          <Link href='/' className='flex items-center'>
            <Logo />
            <span className='font-bold text-xl'>DevTrack</span>
          </Link>
        </div>

        <div className='lg:pr-4'>
          <ul className='space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm'>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className='text-muted-foreground hover:text-accent-foreground block duration-150'
                >
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <main className='pt-[60px]'>{children}</main>
    </>
  );
}
