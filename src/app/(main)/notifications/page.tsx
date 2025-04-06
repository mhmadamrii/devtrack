import { Navbar } from '~/components/shared/navbar';
import { NotificationsContent } from '~/components/shared/notification-content';

export default function NotificationPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <NotificationsContent />
    </div>
  );
}
