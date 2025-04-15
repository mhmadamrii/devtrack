import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
    case 'In Progress':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
  }
};

export const getLabelStatus = (currentStatus: string) => {
  switch (currentStatus) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    case 'pending':
      return 'Pending';
    case 'completed':
      return 'Completed';

    default:
      return 'Planning';
  }
};
