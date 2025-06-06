import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, type ChangeEvent } from 'react';
import { Input } from '~/components/ui/input';
import { Separator } from '../ui/separator';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '~/server/auth/client';
import { Spinner } from './spinner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

export function DialogRegister({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsRedirecting(true);
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: (res) => {
          router.refresh();
          console.log('pushing to dashboard');
          if (res.data.token) {
            router.push('/');
          }
        },
        onError: (err) => {
          console.log('error', err);
          toast.error('Failed to register');
          setIsLoading(false);
          setIsRedirecting(false);
        },
      },
    );
  };

  const handleRegister = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    await authClient.signUp.email(
      {
        email,
        password,
        name: 'John Doe',
      },
      {
        onSuccess: () => {
          toast.success('Successfully registered');
          handleLogin({
            email,
            password,
          });
        },
        onError: (err: any) => {
          setIsLoading(false);
          if (err?.error?.code == 'USER_ALREADY_EXISTS') {
            toast.error('User already exists');
          } else {
            toast.error('Failed to register');
          }
        },
      },
    );
  };

  const onSubmit = (data: FormData) => {
    handleRegister({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-[350px] rounded-4xl flex justify-center items-center flex-col p-0'>
        <DialogHeader className='hidden'>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle className='text-'>Create an account</CardTitle>
            <CardDescription>
              Start your free 30 days trials. Cancel at anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRedirecting ? (
              <div className='flex flex-col items-center justify-center py-8 space-y-4'>
                <Spinner />
                <p className='text-center text-muted-foreground'>
                  Hold tight, redirecting to dashboard...
                </p>
              </div>
            ) : (
              <>
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
                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='cursor-pointer'
                    >
                      {isLoading ? <Spinner /> : 'Get Started'}
                    </Button>
                  </form>
                </Form>
                <div className='relative my-4 flex items-center justify-center overflow-hidden'>
                  <Separator />
                  <div className='px-2 text-center bg-transparent text-sm'>
                    OR
                  </div>
                  <Separator />
                </div>
                <div className='grid w-full gap-2'>
                  <Button
                    onClick={() => toast.error('Not implemented yet')}
                    className='cursor-pointer'
                    variant='outline'
                  >
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 488 512'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                    >
                      <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
                    </svg>
                    Sign up with Google
                  </Button>
                  <Button
                    onClick={() => toast.error('Not implemented yet')}
                    className='cursor-pointer'
                    variant='outline'
                  >
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 512 512'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z'></path>
                    </svg>
                    Sign up with Twitch
                  </Button>
                  <Button
                    onClick={() => toast.error('Not implemented yet')}
                    className='cursor-pointer'
                    variant='outline'
                  >
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 512 512'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'></path>
                    </svg>
                    Sign up with Twitter
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
