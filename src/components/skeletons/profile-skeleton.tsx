import { Skeleton } from '../ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-24 w-24 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='h-4 w-60' />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Skeleton className='h-40 rounded-lg' />
        <Skeleton className='h-40 rounded-lg' />
      </div>
      <Skeleton className='h-60 rounded-lg' />
    </div>
  );
}
