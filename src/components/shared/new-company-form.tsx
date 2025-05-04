'use client';

import { Input } from '~/components/ui/input';
import { Spinner } from './spinner';
import { toast } from 'sonner';
import { api } from '~/trpc/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '~/components/ui/button';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

const formSchema = z.object({
  company_name: z
    .string()
    .min(3, { message: 'Company name must be at least 3 characters' })
    .max(100),
  company_password: z
    .string()
    .min(1, {
      message: 'Company password is required',
    })
    .min(0)
    .optional(),
});

export function NewCompanyForm({
  onClose,
  onRefetchCompany,
}: {
  onClose: () => void;
  onRefetchCompany: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      company_password: '',
    },
  });

  const { mutate, isPending } = api.company.create.useMutation({
    onSuccess: () => {
      toast.success('Company created successfully');
      onRefetchCompany();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      mutate({
        name: values.company_name,
        company_password: values.company_password || '',
      });
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  console.log(form.getValues('company_password'));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 w-full mx-auto py-10'
      >
        <FormField
          control={form.control}
          name='company_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder='Acme Inc'
                  type='text'
                  {...field}
                />
              </FormControl>

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
              <div className='flex items-center space-x-2'>
                <FormControl className='flex-grow'>
                  <Input
                    disabled={isPending}
                    placeholder='shadcn'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <Button
                  type='button'
                  disabled={isPending}
                  onClick={() => {
                    const randomPassword = Math.random()
                      .toString(36)
                      .slice(-10);
                    form.setValue('company_password', randomPassword);
                  }}
                >
                  Generate
                </Button>
              </div>
              <FormDescription>
                Please note that this password is appearing only once.{' '}
                <span className='text-red-500 font-semibold'>
                  If you lose it, you will not be able to access your company.
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full sm:w-[100px]'
          disabled={isPending}
          type='submit'
        >
          {isPending ? <Spinner /> : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
