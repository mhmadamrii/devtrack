'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '~/components/ui/button';
import { authClient } from '~/server/auth/client';

export default function Auth() {
  const { data: session } = authClient.useSession();

  const [isLogin, setIsLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChangeCredentials = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    await authClient.signUp.email(
      {
        email: credentials.email,
        password: credentials.password,
        name: 'John Doe',
      },
      {
        onSuccess: () => window.alert('Success bro'),
        onError: (err) => console.log('error', err),
      },
    );
  };

  const handleLogin = async () => {
    console.log('logiinn cuyy');
    await authClient.signIn.email(
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        onSuccess: () => window.alert('Success bro'),
        onError: (err) => console.log('error', err),
      },
    );
  };

  return (
    <section className='flex bg-slate-500 h-screen container mx-auto items-center justify-center'>
      <Button onClick={() => setIsLogin(!isLogin)}>Change toggle</Button>
      {isLogin ? (
        <div className='h-[500px] border w-[500px] flex flex-col gap-1.5 items-center justify-center'>
          <input
            className='border border-red-500'
            onChange={handleChangeCredentials}
            name='email'
          />
          <input
            className='border border-red-500'
            onChange={handleChangeCredentials}
            name='password'
          />
          <button
            onClick={handleLogin}
            className='bg-blue-500 text-white cursor-pointer px-1 py-0.5 rounded-md'
          >
            Login bro
          </button>
        </div>
      ) : (
        <div className='h-[500px] border w-[500px] flex flex-col gap-1.5 items-center justify-center'>
          <input
            className='border border-red-500'
            onChange={handleChangeCredentials}
            name='email'
          />
          <input
            className='border border-red-500'
            onChange={handleChangeCredentials}
            name='password'
          />
          <button
            onClick={handleRegister}
            className='bg-blue-500 text-white cursor-pointer px-1 py-0.5 rounded-md'
          >
            Register bro
          </button>
        </div>
      )}
    </section>
  );
}
