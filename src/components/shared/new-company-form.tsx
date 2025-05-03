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
  company_name: z.string().min(1).min(3).max(100),
  refferal: z.string().min(1).min(0).optional(),
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
      refferal: ''
    }
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
        referral: values.refferal || '',
      });
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

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
          name='refferal'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Refferal (optional)</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder='shadcn'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormDescription>Your refferal verification</FormDescription>
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
