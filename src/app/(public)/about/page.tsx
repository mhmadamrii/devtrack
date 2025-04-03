import { getServerSession } from '~/server/auth';

export default async function About() {
  const session = await getServerSession();

  return (
    <section>
      <h1>About page</h1>
    </section>
  );
}
