import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Task } from '@shared/schema';
import TaskCard from './TaskCard';
import { RootState } from '@/lib/redux/store';
import { editTask, moveTask } from '@/lib/redux/slices/taskSlice';
import { useState } from 'react';
import { 
  TimerIcon, 
  ListTodo, 
  CalendarClock, 
  Trash2,
  PlusCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuadrantContainerProps {
  quadrant: number;
  title: string;
  action: string;
  tasks: Task[];
}

const QuadrantContainer = ({ quadrant, title, action, tasks }: QuadrantContainerProps) => {
  const dispatch = useDispatch();
  const { draggedTask } = useSelector((state: RootState) => state.tasks);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedTask && draggedTask.quadrant !== quadrant) {
      const taskId = e.dataTransfer.getData('text/plain');
      
      // Update in Redux
      dispatch(moveTask({ taskId, quadrant }));
      
      // Update in backend
      // Use cast to any to handle Redux Toolkit AsyncThunk typing issue
      (dispatch(editTask({ 
        taskId, 
        data: { ...draggedTask, quadrant } 
      })) as any);
    }
  };

  // Determine quadrant styles and descriptions
  const getQuadrantConfig = () => {
    switch(quadrant) {
      case 1: return { 
        color: 'rose',
        icon: TimerIcon,
        description: 'Critical tasks that need immediate attention',
        actionDescription: 'Complete these tasks as soon as possible'
      };
      case 2: return { 
        color: 'indigo',
        icon: ListTodo,
        description: 'Important tasks that can be scheduled',
        actionDescription: 'Plan these tasks in your calendar'
      };
      case 3: return { 
        color: 'orange',
        icon: CalendarClock,
        description: 'Tasks to delegate if possible',
        actionDescription: 'Consider if someone else can handle these'
      };
      case 4: return { 
        color: 'slate',
        icon: Trash2,
        description: 'Low-value tasks to minimize',
        actionDescription: 'Consider if these tasks are worth doing at all'
      };
      default: return { 
        color: 'gray',
        icon: PlusCircle,
        description: 'Unsorted tasks',
        actionDescription: 'Categorize these tasks'
      };
    }
  };

  const config = getQuadrantConfig();
  const Icon = config.icon;
  
  // Dynamic styling based on quadrant
  const getBorderColor = () => {
    if (isDragOver) return 'ring-2 ring-primary';
    
    switch(quadrant) {
      case 1: return 'border-rose-200';
      case 2: return 'border-indigo-200';
      case 3: return 'border-orange-200';
      case 4: return 'border-slate-200';
      default: return 'border-gray-200';
    }
  };
  
  const getHeaderColor = () => {
    switch(quadrant) {
      case 1: return 'bg-rose-50 text-rose-700';
      case 2: return 'bg-indigo-50 text-indigo-700';
      case 3: return 'bg-orange-50 text-orange-700';
      case 4: return 'bg-slate-50 text-slate-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };
  
  const getBadgeColor = () => {
    switch(quadrant) {
      case 1: return 'bg-rose-100 text-rose-800 hover:bg-rose-200';
      case 2: return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 3: return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 4: return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card 
      className={`overflow-hidden flex flex-col h-full border transition-all ${getBorderColor()}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className={`p-4 ${getHeaderColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </div>
            <CardDescription className="text-xs mt-1 opacity-90">
              {config.description}
            </CardDescription>
          </div>
          <Badge className={`${getBadgeColor()}`}>
            {action}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-3 overflow-y-auto">
        <div className="h-full">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground text-sm text-center border-2 border-dashed rounded-md">
              <div className="mb-2 opacity-70">
                <Icon className="h-10 w-10" />
              </div>
              <p className="font-medium">No tasks here yet</p>
              <p className="mt-1">Drag tasks here or add new ones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCard key={task.$id.toString()} task={task} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuadrantContainer;
