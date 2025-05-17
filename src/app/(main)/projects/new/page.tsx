import { NewProjectForm } from '~/components/shared/new-project-form';

export default function NewProjectPage() {
  return (
    <main className='flex-1 p-4 md:p-6 lg:p-8'>
      <div className='flex flex-col gap-6 max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold'>Create New Project</h1>
        <p className='text-muted-foreground'>
          Fill in the details below to create a new project. All fields marked
          with an asterisk (*) are required.
        </p>

        <NewProjectForm />
      </div>
    </main>
  );
}
