import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TimerIcon, 
  ListTodo, 
  CalendarClock, 
  Trash2, 
  PieChart,
  CheckCircle2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const StatsSection = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // Count tasks in each quadrant
  const getQuadrantCount = (quadrant: number) => {
    return tasks.filter(task => task.quadrant === quadrant).length;
  };

  // Count completed tasks (assuming we don't have a 'completed' property yet)
  const getCompletedCount = () => {
    // For now, assume there are no completed tasks
    // When you implement task completion functionality, update this
    return 0;
  };

  // Calculate percentage of tasks in each quadrant
  const getQuadrantPercentage = (quadrant: number) => {
    if (tasks.length === 0) return 0;
    return Math.round((getQuadrantCount(quadrant) / tasks.length) * 100);
  };

  // Calculate total tasks
  const totalTasks = tasks.length;
  const completedTasks = getCompletedCount();
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  const statsItems = [
    {
      title: "Important & Urgent",
      icon: TimerIcon,
      count: getQuadrantCount(1),
      percentage: getQuadrantPercentage(1),
      color: "red",
      description: "Tasks requiring immediate action"
    },
    {
      title: "Important & Not Urgent",
      icon: ListTodo,
      count: getQuadrantCount(2),
      percentage: getQuadrantPercentage(2),
      color: "blue",
      description: "Tasks to plan and schedule"
    },
    {
      title: "Not Important & Urgent",
      icon: CalendarClock,
      count: getQuadrantCount(3),
      percentage: getQuadrantPercentage(3),
      color: "amber",
      description: "Tasks to delegate if possible"
    },
    {
      title: "Not Important & Not Urgent",
      icon: Trash2,
      count: getQuadrantCount(4),
      percentage: getQuadrantPercentage(4),
      color: "green",
      description: "Tasks to minimize or eliminate"
    },
    {
      title: "Completion Rate",
      icon: CheckCircle2,
      count: completedTasks,
      percentage: completionRate,
      color: "purple",
      description: `${completedTasks} of ${totalTasks} tasks completed`
    },
    {
      title: "Task Distribution",
      icon: PieChart,
      count: totalTasks,
      percentage: 100,
      color: "slate",
      description: "Total tasks across all quadrants"
    }
  ];

  // Get color classes for each stat item
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          ring: 'ring-red-600/20',
          fill: 'fill-red-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          ring: 'ring-blue-600/20',
          fill: 'fill-blue-500'
        };
      case 'amber':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          ring: 'ring-amber-600/20',
          fill: 'fill-amber-500'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          ring: 'ring-green-600/20',
          fill: 'fill-green-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          ring: 'ring-purple-600/20',
          fill: 'fill-purple-500'
        };
      case 'slate':
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          ring: 'ring-slate-600/20',
          fill: 'fill-slate-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statsItems.map((item, index) => {
        const colorClasses = getColorClasses(item.color);
        const Icon = item.icon;
        
        return (
          <Card key={index} className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-transparent via-transparent to-transparent" 
              style={{ 
                backgroundImage: `linear-gradient(to right, transparent, ${colorClasses.text}, transparent)`,
                opacity: 0.5
              }}
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{item.count}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                            {item.percentage}%
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className={`rounded-full ${colorClasses.bg} p-2`}>
                  <Icon className={`h-5 w-5 ${colorClasses.text}`} />
                </div>
              </div>
              
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className={`h-full ${colorClasses.bg} transition-all`} 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSection;
