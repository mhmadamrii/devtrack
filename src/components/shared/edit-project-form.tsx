'use client';

import * as z from 'zod';

import { Label } from '../ui/label';
import { Calendar } from '~/components/ui/calendar';
import { cn } from '~/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '~/components/ui/checkbox';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { SliderWithHoverLabel } from '../ui/slider-with-hover-label';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { Spinner } from './spinner';

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

const statuses = [
  {
    value: 'planning',
    label: 'Planning',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
];

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Project name must be at least 3 characters' })
      .max(100),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .max(500),
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date({ required_error: 'End date is required' }),
    status: z
      .string({ required_error: 'Please select a status' })
      .min(1, { message: 'Status must be filled' }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type FormValues = z.infer<typeof formSchema>;

export function EditProjectForm({ initialProject }: { initialProject: any }) {
  const router = useRouter();
  const [progress, setProgress] = useState([10]);
  const [teamMembersVal, setTeamMembersVal] = useState<string[]>([]);
  const memoizedProgress = useMemo(() => progress, [progress]);

  const { mutate: editProject, isPending: isSubmitting } =
    api.project.editProject.useMutation({
      onSuccess: async () => {
        toast.success('Successfully edited project 🚀');
        router.push('/projects');
      },
      onError: (error) => {
        console.error('Error editing project:', error);
        toast.error('Failed to edit project');
      },
    });

  const { data: teamData } = api.team.getAllTeams.useQuery({ source: '' });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Planning',
    },
  });

  function onSubmit(data: FormValues) {
    // @ts-expect-error
    const diff = data.endDate - data.startDate;
    const diffInDays = diff / (1000 * 60 * 60 * 24);

    editProject({
      projectId: initialProject?.id as number,
      name: data.name,
      description: data.description,
      status: data.status as
        | 'planning'
        | 'in_progress'
        | 'completed'
        | 'pending',
      progress: progress[0],
      dueDate: Math.round(diffInDays),
      teamMembers: teamMembersVal,
    });
  }

  console.log('initial projects', initialProject);
  console.log('form data', form.formState.errors);

  useEffect(() => {
    if (initialProject) {
      form.setValue('name', initialProject.name);
      form.setValue('description', initialProject.description ?? '');
      form.setValue('status', initialProject.status.toString());
      form.setValue('startDate', initialProject.createdAt);
      setProgress([initialProject.progress ?? 0]);
    }
  }, [initialProject]);

  return (
    <Card className='border-border'>
      <CardContent className='pt-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Enter project name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder='Describe the project and its goals'
                      className='min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the project, its
                    objectives, and expected outcomes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isSubmitting}
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>End Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isSubmitting}
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
                          // initialFocus prop is deprecated
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
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value.toString()}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='w-full flex-col flex items-start gap-2 justify-start'>
              <Label>Progress*</Label>
              <SliderWithHoverLabel
                currentProgress={memoizedProgress}
                onProgressChange={setProgress}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              {teamData?.map((member, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex border rounded px-2 cursor-pointer hover:bg-gray-900 py-1 items-center gap-2',
                    {
                      'bg-slate-900 border-green-500': teamMembersVal.includes(
                        member.id,
                      ),
                    },
                  )}
                  onClick={() => {
                    if (teamMembersVal.includes(member.id)) {
                      const newVal = teamMembersVal.filter(
                        (i) => i !== member.id,
                      );
                      setTeamMembersVal(newVal);
                    } else {
                      setTeamMembersVal((prev) => [...prev, member.id]);
                    }
                  }}
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='font-normal'>{member.name}</FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end gap-4 pt-4'>
              <Button
                className='cursor-pointer'
                type='button'
                variant='outline'
                onClick={() => router.push('/projects')}
              >
                Cancel
              </Button>
              <Button
                className='w-full sm:w-[120px] cursor-pointer'
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : 'Edit Project'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
