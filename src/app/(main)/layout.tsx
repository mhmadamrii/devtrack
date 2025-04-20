import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { redirect } from 'next/navigation';
import { Navbar } from '~/components/shared/navbar';
import { getServerSession } from '~/server/auth';
import { OnboardingDialog } from '~/components/shared/onboarding-dialog';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) {
    redirect('/hi');
  }

  console.log('session', session);
  return (
    <div className='flex min-h-screen scroll-smooth flex-col'>
      <Navbar />
      <NuqsAdapter>{children}</NuqsAdapter>
      {!session?.user?.emailVerified && (
        <OnboardingDialog userEmail={session?.user?.email} />
      )}
    </div>
  );
}
