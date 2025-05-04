import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

export function DialogRegisterShadcn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    // Simulate registration process
    setTimeout(() => {
      console.log('Registered with data:', data);
      setIsLoading(false);
      // You can add toast or redirect logic here
    }, 1500);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid w-full items-center gap-4'
      >
        <div className='w-full max-w-xs space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className='relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2'>
                  <MailIcon className='h-5 w-5 text-muted-foreground' />
                  <FormControl>
                    <Input
                      placeholder='Email'
                      {...field}
                      disabled={isLoading}
                      className='border-0 focus-visible:ring-0 shadow-none'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className='relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring px-2'>
                  <LockIcon className='h-5 w-5 text-muted-foreground' />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      {...field}
                      disabled={isLoading}
                      className='border-0 focus-visible:ring-0 shadow-none'
                    />
                  </FormControl>
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='ml-2'
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className='h-5 w-5 text-muted-foreground' />
                    ) : (
                      <EyeIcon className='h-5 w-5 text-muted-foreground' />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isLoading} className='cursor-pointer'>
          {isLoading ? <Spinner /> : 'Get Started'}
        </Button>
      </form>
    </Form>
  );
}
