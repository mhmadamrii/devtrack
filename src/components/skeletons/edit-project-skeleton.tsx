import { Skeleton } from '../ui/skeleton';

export function EditProjectSkeleton() {
  return (
    <div className='p-8 space-y-4'>
      <Skeleton className='h-8 w-1/4' />

      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-10' />
        <Skeleton className='h-20' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
        <Skeleton className='h-10' />
      </div>

      <div className='pt-4'>
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  );
}
