import { DashboardContent } from '~/components/shared/dashboard-content';
import { Navbar } from '~/components/shared/navbar';

export default function Dashboard() {
  return (
    <div className='flex min-h-screen scroll-smooth flex-col'>
      <Navbar />
      <DashboardContent />
    </div>
  );
}
