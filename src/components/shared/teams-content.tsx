import { MoreHorizontal, Plus, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { api } from '~/trpc/server';
import { FilterMembers } from './filter-members';
import { Suspense } from 'react';
import { AddTeamDialog } from './new-team-dialog';
import { TableSkeleton } from '../skeletons/table-skeleton';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

type Searches = {
  source: string;
};

async function TableMembers({ source }: Searches) {
  const allTeams = await api.team.getAllTeams({
    source,
  });
  console.log('allteams', allTeams);

  const getStatusMemberColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  return allTeams.map((member: any) => (
    <TableRow key={member.id}>
      <TableCell>
        <div className='flex items-center gap-3'>
          <div className='font-medium'>{member.name}</div>
        </div>
      </TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>{member?.department ?? '-'}</TableCell>
      <TableCell>
        <Badge variant='outline' className={getStatusMemberColor('Active')}>
          Active
        </Badge>
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' asChild>
            <a href={`mailto:${member.email}`}>
              <Mail className='h-4 w-4' />
              <span className='sr-only'>Email</span>
            </a>
          </Button>
          <Button variant='ghost' size='icon' asChild>
            <a href={`tel:${member.phone ?? '-'}`}>
              <Phone className='h-4 w-4' />
              <span className='sr-only'>Call</span>
            </a>
          </Button>
        </div>
      </TableCell>
      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Member</DropdownMenuItem>
            <DropdownMenuItem>Assign to Project</DropdownMenuItem>
            <DropdownMenuItem>Change Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));
}

export function TeamsContent({ source }: Searches) {
  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Team Members</h1>
          <AddTeamDialog>
            <Button className='cursor-pointer'>
              <Plus className='mr-2 h-4 w-4' />
              Add Member
            </Button>
          </AddTeamDialog>
        </div>
        <FilterMembers />
        <Card className='border-border rounded-sm min-h-[60vh]'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Suspense fallback={<TableSkeleton />}>
                  <TableMembers source={source} />
                </Suspense>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
