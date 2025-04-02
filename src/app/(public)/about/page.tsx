import { getServerSession } from '~/server/auth';

export default async function About() {
  const session = await getServerSession();
  console.log('session', session);

  return (
    <section>
      <h1>About page</h1>
    </section>
  );
}
