'use client';

import { MoreHorizontal, Plus, Search, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
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

// Sample data
const members = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe~example.com',
    phone: '+1 (555) 123-4567',
    role: 'Developer',
    department: 'Engineering',
    projects: ['Website Redesign', 'API Integration'],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith~example.com',
    phone: '+1 (555) 987-6543',
    role: 'Designer',
    department: 'Design',
    projects: ['Website Redesign', 'Mobile App Development'],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson~example.com',
    phone: '+1 (555) 456-7890',
    role: 'Project Manager',
    department: 'Management',
    projects: ['Website Redesign', 'Database Migration'],
    status: 'Active',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams~example.com',
    phone: '+1 (555) 789-0123',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    projects: ['Mobile App Development', 'API Integration'],
    status: 'Active',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown~example.com',
    phone: '+1 (555) 234-5678',
    role: 'DevOps Engineer',
    department: 'Operations',
    projects: ['Database Migration'],
    status: 'On Leave',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis~example.com',
    phone: '+1 (555) 345-6789',
    role: 'Backend Developer',
    department: 'Engineering',
    projects: ['API Integration', 'User Authentication System'],
    status: 'Active',
  },
  {
    id: '7',
    name: 'Robert Wilson',
    email: 'robert.wilson~example.com',
    phone: '+1 (555) 567-8901',
    role: 'Frontend Developer',
    department: 'Engineering',
    projects: ['Website Redesign', 'Mobile App Development'],
    status: 'Active',
  },
  {
    id: '8',
    name: 'Lisa Taylor',
    email: 'lisa.taylor~example.com',
    phone: '+1 (555) 678-9012',
    role: 'UX Researcher',
    department: 'Design',
    projects: ['Website Redesign'],
    status: 'Inactive',
  },
];

export function TeamsContent() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
    }
  };

  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Team Members</h1>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Member
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search members...'
              className='pl-8'
            />
          </div>
        </div>

        <Card className='border-border'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarFallback>
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='font-medium'>{member.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-1'>
                        {member.projects.map((project, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='bg-muted'
                          >
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={getStatusColor(member.status)}
                      >
                        {member.status}
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
                          <a href={`tel:${member.phone}`}>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
