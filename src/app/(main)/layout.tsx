import { redirect } from 'next/navigation';
import { getServerSession } from '~/server/auth';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  console.log('session', session);
  if (!session) {
    redirect('/hi');
  }

  return <>{children}</>;
}
