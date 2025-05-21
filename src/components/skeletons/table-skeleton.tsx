import { Skeleton } from '../ui/skeleton';

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse">
          {/* Issue name */}
          <td>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-5 w-40' />
            </div>
          </td>
          {/* Date Assigned */}
          <td>
            <Skeleton className='h-4 w-24' />
          </td>
          {/* Assigned To */}
          <td>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-4 w-28' />
            </div>
          </td>
          {/* Assigned By */}
          <td>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-4 w-24' />
            </div>
          </td>
          {/* Priority (badge-like) */}
          <td>
            <Skeleton className='h-6 w-16 rounded-full' />
          </td>
          {/* Status (badge-like) */}
          <td>
            <Skeleton className='h-6 w-20 rounded-md' />
          </td>
          {/* Actions (right-aligned button) */}
          <td className='text-right'>
            <Skeleton className='h-8 w-8 rounded-md ml-auto' />
          </td>
        </tr>
      ))}
    </>
  );
}
