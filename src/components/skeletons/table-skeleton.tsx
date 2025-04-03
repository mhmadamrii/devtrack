import { Skeleton } from '../ui/skeleton';

export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {/* Name (flex with gap) */}
          <td>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-32" />
            </div>
          </td>
          {/* Role */}
          <td>
            <Skeleton className="h-4 w-20" />
          </td>
          {/* Department */}
          <td>
            <Skeleton className="h-4 w-28" />
          </td>
          {/* Projects (badge-like) */}
          <td>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </td>
          {/* Status (badge-like) */}
          <td>
            <Skeleton className="h-6 w-16 rounded-full" />
          </td>
          {/* Contact (two buttons) */}
          <td>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </td>
          {/* Actions (right-aligned button) */}
          <td className="text-right">
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}