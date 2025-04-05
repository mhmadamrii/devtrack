'use client';

import * as z from 'zod';

import { PinWheelLoader } from '../ui/pinwheel';
import { Label } from '../ui/label';
import { Calendar } from '~/components/ui/calendar';
import { cn } from '~/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '~/components/ui/checkbox';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { SliderWithHoverLabel } from '../ui/slider-with-hover-label';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

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

// Sample data
const members = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Designer',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Project Manager',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    role: 'QA Engineer',
  },
  {
    id: '5',
    name: 'David Brown',
    role: 'DevOps Engineer',
  },
  {
    id: '6',
    name: 'Emily Davis',
    role: 'Backend Developer',
  },
];

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
    value: 'on_hold',
    label: 'On Hold',
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
    status: z.string({ required_error: 'Please select a status' }),
    teamMembers: z
      .array(z.string())
      .min(1, { message: 'Select at least one team member' }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type FormValues = z.infer<typeof formSchema>;

export function NewProjectForm() {
  const router = useRouter();
  const [progress, setProgress] = useState([10]);
  const memoizedProgress = useMemo(() => progress, [progress]);

  const { mutate: createProject, isPending: isSubmitting } =
    api.project.create.useMutation({
      onSuccess: async () => {
        toast.success('Successfully created project 🚀');
        router.push('/projects');
        await new Promise((res) => setTimeout(res, 2000));
        toast.success('Good luck! 💪');
      },
      onError: (error) => {
        console.error('Error creating project:', error);
        toast.error('Failed to create project');
      },
    });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: '',
      teamMembers: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log('Form submitted:', data);
    console.log('progress:', progress);
    createProject({
      name: data.name,
      description: data.description,
      status: data.status as
        | 'planning'
        | 'in_progress'
        | 'completed'
        | 'pending',
      progress: progress[0],
      dueDate: data.endDate,
    });
  }

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
                          initialFocus
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
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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

            <div className='w-full flex-col flex items-start gap-2 justify-start'>
              <Label>Progress*</Label>
              <SliderWithHoverLabel
                currentProgress={memoizedProgress}
                onProgressChange={setProgress}
              />
            </div>

            <FormField
              control={form.control}
              name='teamMembers'
              render={() => (
                <FormItem>
                  <div className='mb-4'>
                    <FormLabel className='text-base'>Team Members *</FormLabel>
                    <FormDescription>
                      Select team members to assign to this project.
                    </FormDescription>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {members.map((member) => (
                      <FormField
                        key={member.id}
                        control={form.control}
                        name='teamMembers'
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={member.id}
                              className='flex flex-row items-center space-x-3 space-y-0'
                            >
                              <FormControl>
                                <Checkbox
                                  disabled={isSubmitting}
                                  checked={field.value?.includes(member.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          member.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== member.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className='flex items-center gap-2'>
                                <Avatar className='h-8 w-8'>
                                  <AvatarFallback>
                                    {member.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel className='font-normal'>
                                    {member.name}
                                  </FormLabel>
                                  <p className='text-xs text-muted-foreground'>
                                    {member.role}
                                  </p>
                                </div>
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
            />

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
                {isSubmitting ? <PinWheelLoader /> : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
