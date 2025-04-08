import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Bell,
  HelpCircle,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RootState } from '@/lib/redux/store';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch: (searchTerm: string) => void;
  onFilterByQuadrant: (quadrant: number | null) => void;
}

const Header = ({ toggleSidebar, onSearch, onFilterByQuadrant }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleQuadrantFilter = (quadrant: number | null) => {
    setSelectedQuadrant(quadrant);
    onFilterByQuadrant(quadrant);
  };

  const quadrantNames = {
    1: 'Important + Urgent',
    2: 'Important + Not Urgent',
    3: 'Not Important + Urgent',
    4: 'Not Important + Not Urgent'
  };

  const quadrantColors = {
    1: 'bg-red-500',
    2: 'bg-blue-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500'
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center gap-4 px-6 sm:gap-8">
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search tasks..." 
            className="pl-8 bg-background shadow-none border-muted" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex-1 md:flex-none"></div>

        {/* Quadrant filter buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedQuadrant === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuadrantFilter(null)}
            className="text-sm font-medium"
          >
            All
          </Button>
          <Button
            variant={selectedQuadrant === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuadrantFilter(1)}
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-sm font-medium"
          >
            Do
          </Button>
          <Button
            variant={selectedQuadrant === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuadrantFilter(2)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-sm font-medium"
          >
            Schedule
          </Button>
          <Button
            variant={selectedQuadrant === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuadrantFilter(3)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 text-sm font-medium"
          >
            Delegate
          </Button>
          <Button
            variant={selectedQuadrant === 4 ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuadrantFilter(4)}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 text-sm font-medium"
          >
            Eliminate
          </Button>
        </div>

        {/* Help & notifications */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Help</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
