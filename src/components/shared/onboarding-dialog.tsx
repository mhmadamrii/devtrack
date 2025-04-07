'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import * as z from 'zod';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';

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
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const purposeOptions = [
  { value: 'project_management', label: 'Project Management' },
  { value: 'issue_tracking', label: 'Issue Tracking' },
  { value: 'team_collaboration', label: 'Team Collaboration' },
  { value: 'resource_planning', label: 'Resource Planning' },
  { value: 'client_management', label: 'Client Management' },
  { value: 'other', label: 'Other' },
];

interface OnboardingDialogProps {
  children?: React.ReactNode;
}

export function OnboardingDialog({ children }: OnboardingDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe~example.com',
      company: '',
      purpose: '',
      additionalInfo: '',
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitting(false);
      setIsCompleted(true);

      // Close dialog after showing success message
      setTimeout(() => {
        setOpen(false);
        setIsCompleted(false);
        form.reset();
      }, 2000);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
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
