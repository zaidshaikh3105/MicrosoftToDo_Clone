import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTaskForm, addNewTask, editTask } from '@/lib/redux/slices/taskSlice';
import { taskValidationSchema, InsertTask } from '@shared/schema';
import { RootState } from '@/lib/redux/store';
import { z } from 'zod';

interface TaskFormProps {
  isOpen: boolean;
}

const TaskForm = ({ isOpen }: TaskFormProps) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { activeTask, isEditing } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const formSchema = taskValidationSchema.omit({ userId: true });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activeTask?.title || '',
      description: activeTask?.description || '',
      quadrant: activeTask?.quadrant || 1,
      priority: (activeTask?.priority as 'high' | 'medium' | 'low') || 'medium',
      dueDate: activeTask?.dueDate || '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }

    const taskData = {
      ...data,
      userId: user?.id || '',
    };

    if (isEditing && activeTask) {
      dispatch(editTask({ taskId: activeTask.$id.toString(), data: taskData }))
        .unwrap()
        .then(() => {
          toast({
            title: "Success",
            description: "Task updated successfully",
          });
          dispatch(toggleTaskForm(false));
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: `Failed to update task: ${error}`,
            variant: "destructive",
          });
        });
    } else {
      dispatch(addNewTask(taskData))
        .unwrap()
        .then(() => {
          toast({
            title: "Success",
            description: "Task created successfully",
          });
          dispatch(toggleTaskForm(false));
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: `Failed to create task: ${error}`,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => dispatch(toggleTaskForm(open))}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit your existing task details below.' : 'Fill in the details below to create a new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quadrant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quadrant</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quadrant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Important & Urgent</SelectItem>
                        <SelectItem value="2">Important & Not Urgent</SelectItem>
                        <SelectItem value="3">Not Important & Urgent</SelectItem>
                        <SelectItem value="4">Not Important & Not Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => dispatch(toggleTaskForm(false))}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
