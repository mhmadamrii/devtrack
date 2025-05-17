'use client';

import type React from 'react';
import * as z from 'zod';

import { roleOptions, purposeOptions } from '~/lib/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { NewCompanyForm } from './new-company-form';

import {
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

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
    .min(1, { message: 'Company name must be at least 1 characters' })
    .max(100),
  purpose: z.string({ required_error: 'Please select a purpose' }),
  role: z.string({ required_error: 'Please select your role' }),
  additionalInfo: z.string().optional(),
  company_password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [isCreateCompanyForm, setIsCreateCompanyForm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'John Doe',
      email: userEmail || '',
      company: '',
      purpose: '',
      additionalInfo: '',
      company_password: '',
    },
  });

  const { data: companyList, refetch: getCompany } =
    api.company.getAvailableCompanies.useQuery(undefined, {
      enabled: false,
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

  const { mutateAsync: verifyCompany } = api.company.verifyCompany.useMutation({
    onSuccess: (res: any) => {
      console.log('Company registered:', res);
      if (res.error) {
        return toast.error(res.message);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error('Invalid company password');
    },
  });

  async function onSubmit(data: FormValues) {
    verifyCompany({
      companyId: parseInt(data.company),
      company_password: data.company_password,
    }).then((res: any) => {
      if (res.company_password)
        updateOnboarding({
          onboarded: true,
          name: data.name,
          role: data.role,
          companyId: parseInt(data.company),
        });
    });
  }

  return (
    <Dialog open onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full sm:max-w-[820px]'>
        {!isCompleted ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription asChild>
                <div className='flex items-center justify-between'>
                  <div className='w-full'>
                    Please provide some information to help us personalize your
                    experience.
                  </div>
                  <div>
                    <Button
                      size='icon'
                      variant='outline'
                      className='cursor-pointer'
                      onClick={() =>
                        setIsCreateCompanyForm(!isCreateCompanyForm)
                      }
                    >
                      {isCreateCompanyForm ? <ChevronLeft /> : <ChevronRight />}
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            {isCreateCompanyForm ? (
              <NewCompanyForm
                onRefetchCompany={() => getCompany()}
                onClose={() => setIsCreateCompanyForm(false)}
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='pt-4'>
                  <div className='flex flex-col md:flex-row gap-6'>
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
                            <FormDescription>
                              Provide your fullname
                            </FormDescription>
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
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='company'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Company Name</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              onOpenChange={(open) => {
                                if (open && !companyList) {
                                  getCompany();
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select your role' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {companyList ? (
                                  companyList.map((comp) => (
                                    <SelectItem
                                      className='flex justify-between items-center w-full'
                                      key={comp.id}
                                      value={comp.id.toString()}
                                    >
                                      <span className='w-full'>
                                        {comp.name}
                                      </span>
                                      {comp.isVerified && (
                                        <span>
                                          <BadgeCheck className='text-blue-500' />
                                        </span>
                                      )}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled value='not_found'>
                                    No Company found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select your company, make{' '}
                              <span
                                onClick={() => setIsCreateCompanyForm(true)}
                                className='text-blue-500 underline cursor-pointer'
                              >
                                one if doesn't exist{' '}
                              </span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='company_password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Company password'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide company password
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                              This helps us tailor the experience to your
                              specific needs.
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
            )}
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
