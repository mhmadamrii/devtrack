'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Loader2, Plus, UserPlus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const formSchema = z.object({
  teamId: z.string().min(1, 'Please select a team member'),
  role: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeamMemberDialogProps {
  projectId: number;
  onSuccess?: () => void;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AddTeamMemberDialog({
  projectId,
  onSuccess,
  variant = 'default',
  size = 'default',
}: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: '',
      role: '',
    },
  });

  const { data: teamMembers, isLoading: isLoadingTeamMembers } =
    api.team.getAllTeams.useQuery();

  const addTeamMember = api.project.addTeamMember.useMutation({
    onSuccess: () => {
      toast.success('Team member added to project');
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add team member');
    },
  });

  function onSubmit(data: FormValues) {
    addTeamMember.mutate({
      projectId,
      teamId: parseInt(data.teamId),
      role: data.role,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <UserPlus className='mr-2 h-4 w-4' />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a team member to this project. You can also specify their role
            in the project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Team Member</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingTeamMembers || addTeamMember.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a team member' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTeamMembers ? (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          <span className='ml-2'>Loading...</span>
                        </div>
                      ) : teamMembers && teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id.toString()}
                          >
                            {member.name} ({member.role})
                          </SelectItem>
                        ))
                      ) : (
                        <div className='p-2 text-center text-sm text-muted-foreground'>
                          No team members found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role in Project (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Frontend Developer, Project Manager'
                      {...field}
                      disabled={addTeamMember.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the team member's role in this specific project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={addTeamMember.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={addTeamMember.isPending}>
                {addTeamMember.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Adding...
                  </>
                ) : (
                  'Add Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
