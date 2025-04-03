'use client';

import type React from 'react';

import * as z from 'zod';
import { useState } from 'react';
import { api } from '~/trpc/react';
import { Checkbox } from '~/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const projects = [
  {
    id: '1',
    name: 'Website Redesign',
  },
  {
    id: '2',
    name: 'Mobile App Development',
  },
  {
    id: '3',
    name: 'API Integration',
  },
  {
    id: '4',
    name: 'Database Migration',
  },
  {
    id: '5',
    name: 'Security Audit',
  },
  {
    id: '6',
    name: 'User Authentication System',
  },
];

const departments = [
  {
    value: 'Engineering',
    label: 'Engineering',
  },
  {
    value: 'Design',
    label: 'Design',
  },
  {
    value: 'Management',
    label: 'Management',
  },
  {
    value: 'Quality Assurance',
    label: 'Quality Assurance',
  },
  {
    value: 'Operations',
    label: 'Operations',
  },
  {
    value: 'Marketing',
    label: 'Marketing',
  },
  {
    value: 'Sales',
    label: 'Sales',
  },
];

const roles = [
  {
    value: 'Developer',
    label: 'Developer',
  },
  {
    value: 'Designer',
    label: 'Designer',
  },
  {
    value: 'Project Manager',
    label: 'Project Manager',
  },
  {
    value: 'QA Engineer',
    label: 'QA Engineer',
  },
  {
    value: 'DevOps Engineer',
    label: 'DevOps Engineer',
  },
  {
    value: 'Backend Developer',
    label: 'Backend Developer',
  },
  {
    value: 'Frontend Developer',
    label: 'Frontend Developer',
  },
  {
    value: 'UX Researcher',
    label: 'UX Researcher',
  },
];

const statuses = [
  {
    value: 'Active',
    label: 'Active',
  },
  {
    value: 'On Leave',
    label: 'On Leave',
  },
  {
    value: 'Inactive',
    label: 'Inactive',
  },
];

const phoneRegex = new RegExp(/^\+?[1-9]\d{1,14}$/);

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .regex(phoneRegex, { message: 'Please enter a valid phone number' }),
  role: z.string({ required_error: 'Please select a role' }),
  status: z.string({ required_error: 'Please select a status' }),
  department: z.string({ required_error: 'Please select a department' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeamDialogProps {
  children?: React.ReactNode;
}

export function AddTeamDialog({ children }: AddTeamDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'Active',
      department: '',
    },
  });

  const { mutate: createTeam, isPending } = api.team.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast.success('Team member added successfully');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: FormValues) {
    createTeam({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'Developer',
      status: data.status,
      department: data.department,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new team member. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder='Enter full name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='email~example.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='+1 (555) 123-4567'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select department' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.value}
                            value={department.value}
                          >
                            {department.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name='projects'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-base'>
                      Assigned Projects
                    </FormLabel>
                    <FormDescription>
                      Select projects to assign to this team member.
                    </FormDescription>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {projects.map((project) => (
                      <FormField
                        key={project.id}
                        control={form.control}
                        name='projects'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={project.id}
                              className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(project.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          project.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== project.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className='space-y-1 leading-none'>
                                <FormLabel className='font-normal'>
                                  {project.name}
                                </FormLabel>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Add Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
