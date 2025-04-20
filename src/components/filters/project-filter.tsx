'use client';

import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useQueryState } from 'nuqs';

export function ProjectFilter() {
  const [searchTerm, setSearchTerm] = useQueryState('q');
  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button asChild>
          <Link className='cursor-pointer' href='/projects/new'>
            <Plus className='mr-2 h-4 w-4' />
            New Project
          </Link>
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            type='search'
            placeholder='Search projects...'
            className='pl-8'
          />
        </div>
      </div>
    </>
  );
}
