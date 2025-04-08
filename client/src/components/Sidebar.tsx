import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { RootState } from '@/lib/redux/store';
import { logout } from '@/lib/redux/slices/authSlice';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard, 
  LayoutGrid, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  LogOut,
  X,
  PanelLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const dispatch = useDispatch();
  const [location] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    // Use cast to any to handle Redux Toolkit AsyncThunk typing issue
    (dispatch(logout()) as any)
      .unwrap()
      .then(() => {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      })
      .catch((error: any) => {
        toast({
          title: "Error",
          description: `Failed to log out: ${error}`,
          variant: "destructive",
        });
      });
  };

  // Close sidebar on mobile when location changes
  useEffect(() => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  }, [location, isMobile, isOpen, toggleSidebar]);

  const NavItem = ({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) => (
    <Link href={href} className={`
      group flex items-center rounded-md px-3 py-2 text-sm font-medium
      ${isActive 
        ? 'bg-primary/10 text-primary' 
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }
      transition-all duration-200 ease-in-out
    `}>
      <Icon className={`mr-2 h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-background/95 backdrop-blur-sm border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2 px-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              ToDo'Em
            </span>
          </Link>

          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          <NavItem 
            href="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={location === '/'} 
          />
          <NavItem 
            href="/tasks" 
            icon={CheckSquare} 
            label="Tasks" 
            isActive={location === '/tasks'} 
          />
          <NavItem 
            href="/analytics" 
            icon={BarChart2} 
            label="Analytics" 
            isActive={location === '/analytics'} 
          />
        </nav>

        <Separator className="my-6" />

        <nav className="space-y-1.5">
          <NavItem 
            href="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={location === '/settings'} 
          />
        </nav>

        {/* User profile and logout */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
            <div className="flex items-center mb-4 gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{user.name || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      {!isOpen && isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-4 top-4 z-20 lg:hidden"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;