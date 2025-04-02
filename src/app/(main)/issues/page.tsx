import { IssuesContent } from '~/components/shared/issue-content';
import { Navbar } from '~/components/shared/navbar';

export default function Issues() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <IssuesContent />
    </div>
  );
}
