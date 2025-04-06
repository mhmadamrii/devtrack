'use client';

import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Spinner } from '~/components/shared/spinner';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

export function StatusTable({
  currentStatus,
  issueId,
}: {
  currentStatus: string;
  issueId: number;
}) {
  console.log('currentStatus', currentStatus);
  const router = useRouter();
  const { mutate: updateStatus, isPending } =
    api.issue.updateStatus.useMutation({
      onSuccess: () => {
        toast.success('Successfuly update status');
        router.refresh();
      },
    });

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  const getLabelStatus = () => {
    switch (currentStatus) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'closed':
        return 'Closed';

      default:
        return 'Open';
    }
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Badge
          variant='outline'
          className={
            getStatusColor() +
            'rounded-4xl flex w-full justify-center items-center cursor-pointer'
          }
        >
          {isPending ? <Spinner /> : getLabelStatus()}
        </Badge>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => updateStatus({ issueId, status: 'open' })}
        >
          Open
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => updateStatus({ issueId, status: 'in_progress' })}
        >
          In Progress
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => updateStatus({ issueId, status: 'closed' })}
        >
          Closed
        </ContextMenuItem>
        <ContextMenuItem>Pending</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
