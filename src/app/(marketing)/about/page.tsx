import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | DevTrack',
  description:
    'Learn more about DevTrack and our mission to revolutionize project management.',
};

export default function AboutPage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      {/* Hero Section */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl mb-6'>
          About DevTrack
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          We're on a mission to transform how development teams collaborate,
          track progress, and deliver exceptional results.
        </p>
      </div>

      {/* Mission Section */}
      <div className='grid md:grid-cols-2 gap-12 items-center mb-16'>
        <div>
          <h2 className='text-3xl font-semibold mb-4'>Our Mission</h2>
          <p className='text-lg text-muted-foreground mb-6'>
            At DevTrack, we believe that successful project management should be
            intuitive, efficient, and enjoyable. Our platform combines powerful
            features with a user-friendly interface to help teams stay focused
            on what matters most - delivering value.
          </p>
          <p className='text-lg text-muted-foreground'>
            We're committed to continuous innovation, ensuring our tools evolve
            with the changing needs of modern development teams.
          </p>
        </div>
        <div className='bg-muted rounded-lg p-8'>
          <h3 className='text-xl font-semibold mb-4'>Our Values</h3>
          <ul className='space-y-4'>
            <li className='flex items-start'>
              <span className='text-primary mr-2'>•</span>
              <span>
                User-Centric Design: We put our users first in everything we
                build
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-primary mr-2'>•</span>
              <span>
                Innovation: Constantly evolving to meet modern development needs
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-primary mr-2'>•</span>
              <span>
                Reliability: Building trust through consistent performance
              </span>
            </li>
            <li className='flex items-start'>
              <span className='text-primary mr-2'>•</span>
              <span>
                Transparency: Clear communication and honest practices
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className='grid md:grid-cols-3 gap-8 mb-16'>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-xl font-semibold mb-3'>
            Real-time Collaboration
          </h3>
          <p className='text-muted-foreground'>
            Work together seamlessly with instant updates and live collaboration
            features.
          </p>
        </div>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-xl font-semibold mb-3'>Intelligent Tracking</h3>
          <p className='text-muted-foreground'>
            Advanced analytics and insights to keep your projects on track and
            on time.
          </p>
        </div>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-xl font-semibold mb-3'>Custom Workflows</h3>
          <p className='text-muted-foreground'>
            Adapt the platform to your team's unique processes and requirements.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className='text-center bg-primary/5 rounded-lg p-8'>
        <h2 className='text-2xl font-semibold mb-4'>Ready to Get Started?</h2>
        <p className='text-muted-foreground mb-6'>
          Join thousands of teams who are already using DevTrack to improve
          their project management.
        </p>
        <a
          href='/signup'
          className='inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90'
        >
          Start Your Free Trial
        </a>
      </div>
    </div>
  );
}
