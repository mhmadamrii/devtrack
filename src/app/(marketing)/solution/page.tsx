import type { Metadata } from 'next';
import { ArrowRight, BarChart3, Users, Clock, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions | DevTrack',
  description: 'Discover how DevTrack helps businesses streamline their project management and team collaboration.',
};

const solutions = [
  {
    title: 'Enterprise Teams',
    description: 'Scale your project management across multiple teams and departments.',
    icon: Users,
    benefits: [
      'Centralized project visibility',
      'Cross-team collaboration',
      'Resource allocation',
      'Department-specific workflows',
    ],
  },
  {
    title: 'Performance Analytics',
    description: 'Make data-driven decisions with comprehensive analytics and reporting.',
    icon: BarChart3,
    benefits: [
      'Real-time performance metrics',
      'Custom report generation',
      'Team productivity insights',
      'Project health monitoring',
    ],
  },
  {
    title: 'Time Management',
    description: 'Optimize time tracking and resource allocation across projects.',
    icon: Clock,
    benefits: [
      'Accurate time tracking',
      'Resource utilization',
      'Deadline management',
      'Capacity planning',
    ],
  },
  {
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with role-based access control.',
    icon: Shield,
    benefits: [
      'Role-based permissions',
      'Data encryption',
      'Audit logging',
      'Compliance reporting',
    ],
  },
];

export default function SolutionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Solutions for Every Business Need
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tailored solutions to help your organization achieve its goals and drive success.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {solutions.map((solution, index) => {
          const Icon = solution.icon;
          return (
            <div key={index} className="bg-card rounded-lg border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{solution.title}</h2>
              </div>
              <p className="text-muted-foreground mb-6">{solution.description}</p>
              <ul className="space-y-3">
                {solution.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary/5 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Solution</h2>
        <p className="text-muted-foreground mb-6">
          Let us help you choose the right features and solutions for your team.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
} 