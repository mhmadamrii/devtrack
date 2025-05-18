'use client';

import type React from 'react';
import * as z from 'zod';

import { useState } from 'react';
import { Spinner } from './spinner';
import { Calendar } from '~/components/ui/calendar';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '~/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

const priorities = [
  {
    value: 'low',
    label: 'Low',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'high',
    label: 'High',
  },
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100),
  project: z.string({ required_error: 'Please select a project' }),
  assignedTo: z.string({ required_error: 'Please select a team member' }),
  priority: z.string({ required_error: 'Please select a priority' }),
  dueDate: z.date({ required_error: 'Please select a due date' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewIssueDialogProps {
  children?: React.ReactNode;
}

export function NewIssueDialog({ children }: NewIssueDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: projectsData, refetch: getProjects } =
    api.project.getAllProjects.useQuery(undefined, {
      enabled: false,
    });

  const { data: teamData, refetch: getTeam } = api.team.getAllTeams.useQuery(
    {
      source: '',
    },
    {
      enabled: false,
    },
  );

  const { mutate: createIssue, isPending } = api.issue.create.useMutation({
    onSuccess: () => {
      toast.success('Issue created successfully');
      router.refresh();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log('error', error);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  function onSubmit(data: FormValues) {
    console.log('Form submitted:', data);
    createIssue({
      name: data.title,
      description: data.description ?? '',
      projectId: parseInt(data.project),
      assignedTo: data.assignedTo,
      priority: data.priority as 'low' | 'medium' | 'high',
      status: 'open',
    });

    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>New Issue</Button>}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new issue. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter issue title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='project'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      onOpenChange={(open) => {
                        if (open && !projectsData) {
                          getProjects();
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select project' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectsData ? (
                          projectsData.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id.toString()}
                            >
                              {project.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value='not_found'>
                            No projects found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='assignedTo'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Assigned To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      onOpenChange={(open) => {
                        if (open && !teamData) {
                          getTeam();
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select team member' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamData ? (
                          teamData.map((member) => (
                            <SelectItem
                              key={member.id}
                              value={member.id.toString()}
                            >
                              {member.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value={'not_found'}>
                            No team members found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select priority' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                          >
                            {priority.label}
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
                name='dueDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the issue in detail'
                      className='min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide any additional details that might help resolve the
                    issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className='cursor-pointer'
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='cursor-pointer w-[100px]'
                type='submit'
                disabled={isPending}
              >
                {isPending ? <Spinner /> : 'Create Issue'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
