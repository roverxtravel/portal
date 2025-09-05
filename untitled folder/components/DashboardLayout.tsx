import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Home, 
  Clock, 
  BarChart3, 
  Users, 
  User, 
  LogOut,
  Menu,
  X,
  Award,
  Settings,
  UserPlus
} from 'lucide-react';
import { User as UserType } from '../types/user';

interface DashboardLayoutProps {
  user: UserType;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  id: string;
  roles: ('staff' | 'manager' | 'admin')[];
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', id: 'dashboard', roles: ['staff', 'manager'] },
  { icon: Clock, label: 'Attendance', id: 'attendance', roles: ['staff', 'manager'] },
  { icon: BarChart3, label: 'Sales Report', id: 'sales', roles: ['staff', 'manager'] },
  { icon: Users, label: 'Staff Directory', id: 'directory', roles: ['manager'] },
  { icon: UserPlus, label: 'HR Management', id: 'hr', roles: ['manager'] },
  { icon: Award, label: 'Recognition', id: 'recognition', roles: ['manager'] },
  { icon: Settings, label: 'Admin', id: 'admin', roles: ['manager', 'admin'] },
  { icon: User, label: 'Profile', id: 'profile', roles: ['staff', 'manager'] }
];

export function DashboardLayout({ user, onLogout, children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role as 'staff' | 'manager' | 'admin')
  );

  const getCompanyBranding = () => {
    if (user.company === 'roverx') {
      return {
        name: 'Rover X',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
        icon: (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        accentColor: 'text-blue-600'
      };
    } else {
      return {
        name: 'Tipsy Ninjas',
        bgColor: 'bg-gradient-to-br from-purple-600 to-pink-600',
        icon: (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ),
        accentColor: 'text-purple-600'
      };
    }
  };

  const companyBranding = getCompanyBranding();

  const NavContent = () => (
    <>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${companyBranding.bgColor} rounded-lg flex items-center justify-center`}>
            {companyBranding.icon}
          </div>
          <div>
            <h1 className="font-bold text-lg">{companyBranding.name}</h1>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <h1 className="font-semibold">{companyBranding.name}</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-72 lg:bg-white lg:shadow-sm">
          <NavContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:flex bg-white shadow-sm border-b px-6 py-4 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{companyBranding.name} Portal</h1>
              <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {React.cloneElement(children as React.ReactElement, { activeTab, setActiveTab })}
          </main>
        </div>
      </div>
    </div>
  );
}