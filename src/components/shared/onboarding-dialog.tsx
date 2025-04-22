'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import * as z from 'zod';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';
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

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' })
    .max(100),
  purpose: z.string({ required_error: 'Please select a purpose' }),
  role: z.string({ required_error: 'Please select your role' }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const purposeOptions = [
  {
    value: 'project_management',
    label: 'Project Management',
  },
  {
    value: 'issue_tracking',
    label: 'Issue Tracking',
  },
  {
    value: 'team_collaboration',
    label: 'Team Collaboration',
  },
  {
    value: 'resource_planning',
    label: 'Resource Planning',
  },
  {
    value: 'client_management',
    label: 'Client Management',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const roleOptions = [
  {
    value: 'developer',
    label: 'Developer',
  },
  {
    value: 'designer',
    label: 'Designer',
  },
  {
    value: 'qa_engineer',
    label: 'QA Engineer',
  },
  {
    value: 'project_manager',
    label: 'Project Manager',
  },
  {
    value: 'frontend_developer',
    label: 'Frontend Developer',
  },
  {
    value: 'backend_developer',
    label: 'Backend Developer',
  },
  {
    value: 'fullstack_developer',
    label: 'Fullstack Developer',
  },
  {
    value: 'mobile_developer',
    label: 'Mobile Developer',
  },
  {
    value: 'devops_engineer',
    label: 'DevOps Engineer',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

interface OnboardingDialogProps {
  children?: React.ReactNode;
  userEmail?: string;
}

export function OnboardingDialog({
  children,
  userEmail,
}: OnboardingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'John Doe',
      email: userEmail || '',
      company: '',
      purpose: '',
      additionalInfo: '',
    },
  });

  const { mutate: updateOnboarding, isPending } =
    api.user.updateOnboardingStatus.useMutation({
      onSuccess: () => {
        toast.success('Profile completed!');
        setIsCompleted(true);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to complete profile');
      },
    });

  function onSubmit(data: FormValues) {
    console.log('Form submitted:', data);

    updateOnboarding({
      onboarded: true,
      name: data.name,
      role: data.role,
      company: data.company,
    });
  }

  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[800px]'>
        {!isCompleted ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription>
                Please provide some information to help us personalize your
                experience.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='pt-4'>
                <div className='flex flex-col md:flex-row gap-6'>
                  {/* Left column */}
                  <div className='flex-1 space-y-6'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your full name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your email'
                              {...field}
                              disabled
                              className='bg-muted/50 cursor-not-allowed'
                            />
                          </FormControl>
                          <FormDescription>
                            Your email address is associated with your account
                            and cannot be changed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='company'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your company name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right column */}
                  <div className='flex-1 space-y-6'>
                    <FormField
                      control={form.control}
                      name='role'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>Your Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select your role' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roleOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the role that best describes your position
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='purpose'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Purpose</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select your primary purpose for using DevTrack' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {purposeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us tailor the experience to your specific
                            needs.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='additionalInfo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Additional Information (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Tell us more about how you plan to use DevTrack'
                              className='min-h-[140px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className='mt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <div className='rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4'>
              <CheckCircle2 className='h-8 w-8 text-green-600 dark:text-green-400' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Profile Completed!</h2>
            <p className='text-muted-foreground mb-6'>
              Thank you for completing your profile. Your experience has been
              personalized.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
