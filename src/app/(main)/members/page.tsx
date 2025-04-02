import { Navbar } from '~/components/shared/navbar';
import { TeamsContent } from '~/components/shared/teams-content';

export default function Members() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <TeamsContent />
    </div>
  );
}
