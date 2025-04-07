import { Skeleton } from '../ui/skeleton';

export function ProjectSkeleton() {
  return (
    <div className='p-8 space-y-6'>
      {/* Project title */}
      <Skeleton className='h-8 w-1/3 mx-auto' />

      {/* Project description */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-3/4 mx-auto' />
        <Skeleton className='h-4 w-1/2 mx-auto' />
      </div>

      {/* Project details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Skeleton className='h-32' />
        <Skeleton className='h-32' />
      </div>

      {/* Project issues */}
      <div className='space-y-3'>
        <Skeleton className='h-6 w-1/4' />
        <div className='space-y-2'>
          <Skeleton className='h-12' />
          <Skeleton className='h-12' />
          <Skeleton className='h-12' />
        </div>
      </div>

      {/* Project team */}
      <div className='space-y-3'>
        <Skeleton className='h-6 w-1/4' />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
        </div>
      </div>
    </div>
  );
}
