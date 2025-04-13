import type { Metadata } from 'next';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features | DevTrack',
  description: 'Discover the powerful features of DevTrack that help teams collaborate and deliver projects successfully.',
};

const features = [
  {
    title: 'Project Management',
    description: 'Organize and track your projects with intuitive boards and timelines.',
    items: [
      'Customizable project boards',
      'Drag-and-drop task management',
      'Timeline and calendar views',
      'Milestone tracking',
    ],
  },
  {
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time updates and communication tools.',
    items: [
      'Real-time updates',
      'Team chat and discussions',
      'File sharing and attachments',
      'Task comments and mentions',
    ],
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor project progress with powerful analytics and reporting tools.',
    items: [
      'Progress dashboards',
      'Custom reports',
      'Time tracking',
      'Performance metrics',
    ],
  },
  {
    title: 'Automation',
    description: 'Automate repetitive tasks and workflows to save time and reduce errors.',
    items: [
      'Custom workflow automation',
      'Task dependencies',
      'Automated notifications',
      'Scheduled tasks',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Powerful Features for Modern Teams
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage projects, collaborate with your team, and deliver results.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
            <p className="text-muted-foreground mb-6">{feature.description}</p>
            <ul className="space-y-4">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary/5 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Ready to Experience These Features?</h2>
        <p className="text-muted-foreground mb-6">
          Start your free trial today and see how DevTrack can transform your team's productivity.
        </p>
        <a
          href="/signup"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Start Free Trial
        </a>
      </div>
    </div>
  );
} 