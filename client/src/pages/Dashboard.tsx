import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { fetchUserTasks, toggleTaskForm } from '@/lib/redux/slices/taskSlice';
import { RootState } from '@/lib/redux/store';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@shared/schema';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MatrixGrid from '@/components/MatrixGrid';
import StatsSection from '@/components/StatsSection';
import TaskForm from '@/components/TaskForm';
import { Redirect } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quadrantFilter, setQuadrantFilter] = useState<number | null>(null);
  
  const { tasks, isFormOpen, loading, error } = useSelector((state: RootState) => state.tasks);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch tasks when the user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Use cast to any to handle Redux Toolkit AsyncThunk typing issue
      (dispatch(fetchUserTasks(user.id)) as any)
        .unwrap()
        .catch((error: any) => {
          toast({
            title: "Error",
            description: `Failed to fetch tasks: ${error}`,
            variant: "destructive",
          });
        });
    }
  }, [dispatch, isAuthenticated, user, toast]);

  // Apply filters to tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply quadrant filter
    if (quadrantFilter !== null) {
      result = result.filter(task => task.quadrant === quadrantFilter);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, quadrantFilter]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterByQuadrant = (quadrant: number | null) => {
    setQuadrantFilter(quadrant);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const LoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[150px] rounded-md" />
        <Skeleton className="h-[150px] rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[150px] rounded-md" />
        <Skeleton className="h-[150px] rounded-md" />
      </div>
    </div>
  );

  const ErrorState = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error ? error : "Failed to load tasks. Please try again."}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen transition-all duration-300 lg:ml-72">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          onSearch={handleSearch}
          onFilterByQuadrant={handleFilterByQuadrant}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-container">
            <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button
                  onClick={() => dispatch(toggleTaskForm(true))}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>

              <MatrixGrid />

              <TaskForm isOpen={isFormOpen} />
            </div>
          </div>
          
          {/* Floating action button */}
          {/* This button is redundant given the button in the new Dashboard component */}
          {/* <Button 
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
            size="icon"
            onClick={() => dispatch(toggleTaskForm(true))}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add task</span>
          </Button> */}
        </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;