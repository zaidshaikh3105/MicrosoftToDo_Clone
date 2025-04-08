import React from "react"; // 👈 REQUIRED

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@shared/schema";
import {
  Edit,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  GripVertical,
  Tag,
  CheckCircle,
  Circle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  removeTask,
  setActiveTask,
  toggleTaskForm,
  setDraggedTask,
  toggleTaskCompletion,
} from "@/lib/redux/slices/taskSlice";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    // Use cast to any to handle Redux Toolkit AsyncThunk typing issue
    (dispatch(removeTask(task.$id)) as any)
      .unwrap()
      .then(() => {
        toast({
          title: "Task deleted",
          description: "Task has been removed successfully",
        });
      })
      .catch((error: any) => {
        toast({
          title: "Error",
          description: `Failed to delete task: ${error}`,
          variant: "destructive",
        });
      });
  };

  const handleEdit = () => {
    dispatch(setActiveTask(task));
    dispatch(toggleTaskForm(true));
  };

  // Determine colors based on quadrant
  const getQuadrantColor = () => {
    switch (task.quadrant) {
      case 1:
        return {
          text: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-100",
        };
      case 2:
        return {
          text: "text-indigo-600",
          bg: "bg-indigo-50",
          border: "border-indigo-100",
        };
      case 3:
        return {
          text: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-100",
        };
      case 4:
        return {
          text: "text-slate-600",
          bg: "bg-slate-50",
          border: "border-slate-100",
        };
      default:
        return {
          text: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
        };
    }
  };

  // Get priority badge configuration
  const getPriorityConfig = () => {
    switch (task.priority) {
      case "high":
        return {
          label: "High",
          variant: "destructive" as const,
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
        };
      case "medium":
        return {
          label: "Medium",
          variant: "default" as const,
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "low":
        return {
          label: "Low",
          variant: "outline" as const,
          icon: <Tag className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          label: "Normal",
          variant: "secondary" as const,
          icon: <Tag className="h-3 w-3 mr-1" />,
        };
    }
  };

  // Drag and drop handlers
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    dispatch(setDraggedTask(task));
    e.dataTransfer.setData("text/plain", task.$id || "");
    if (cardRef.current) {
      cardRef.current.classList.add("opacity-40");
    }
  };

  const handleDragEnd = () => {
    if (cardRef.current) {
      cardRef.current.classList.remove("opacity-40");
    }
    dispatch(setDraggedTask(null));
  };

  const quadrantStyles = getQuadrantColor();
  const priorityConfig = getPriorityConfig();

  return (
    <Card
      ref={cardRef}
      data-completed={task.completed}
      className={`relative group task-card border hover:bg-blue-50/50 transition-all duration-200 ${quadrantStyles.border} ${quadrantStyles.bg} bg-opacity-30 shadow-sm hover:shadow-md`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 cursor-move opacity-0 group-hover:opacity-70 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardContent className="p-4">
        {/* Task title and actions */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium truncate">{task.title}</h3>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => dispatch(toggleTaskCompletion(task.$id))}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">Toggle completion</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleEdit}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Task description */}
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {task.description}
          </p>
        )}

        {/* Task metadata */}
        <div className="flex items-center flex-wrap gap-2 mt-3">
          <Badge
            variant={priorityConfig.variant}
            className="text-[10px] h-5 px-1.5 gap-0.5"
          >
            {priorityConfig.icon}
            {priorityConfig.label}
          </Badge>

          {task.dueDate && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-0.5">
              <Calendar className="h-3 w-3 mr-1" />
              {task.dueDate}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;