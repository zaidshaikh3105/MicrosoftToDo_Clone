
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import Analytics from "@/pages/Analytics";
import Tasks from "@/pages/Tasks";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { account } from "@/lib/appwriteConfig";
import { setUser, clearUser } from "@/lib/redux/slices/authSlice";
import { RootState } from "@/lib/redux/store";
import { Progress } from "@/components/ui/progress";

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#FAF9F8] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col h-screen transition-all duration-300 lg:ml-80">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AuthChecker({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const user = await account.get();
        if (user) {
          dispatch(setUser({
            id: user.$id,
            name: user.name,
            email: user.email,
          }));
        } else {
          dispatch(clearUser());
          if (location !== '/login' && location !== '/register') {
            setLocation('/login');
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        dispatch(clearUser());
        if (location !== '/login' && location !== '/register') {
          setLocation('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch, location, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Loading...</h2>
          <Progress value={65} className="w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? (
    <Layout>
      <Component />
    </Layout>
  ) : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AuthChecker>
        <Router />
      </AuthChecker>
      <Toaster />
    </div>
  );
}

export default App;
