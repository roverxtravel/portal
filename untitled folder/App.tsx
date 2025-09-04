import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { StaffDashboard } from './components/StaffDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { GuestPortal } from './components/GuestPortal';
import { PendingApproval } from './components/PendingApproval';
import { User } from './types/user';
import { mockUsers } from './data/mockUsers';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email?: string, isGuest: boolean = false) => {
    if (isGuest) {
      // Handle guest login
      const guestUser: User = {
        id: 'guest',
        email: 'guest@portal.com',
        name: 'Guest User',
        role: 'guest',
        company: 'roverx', // Default to RoverX for guests
        isApproved: true
      };
      setCurrentUser(guestUser);
      localStorage.setItem('currentUser', JSON.stringify(guestUser));
      return guestUser;
    }

    // Simulate Google OAuth login
    if (email) {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return user;
    }
    return null;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (!currentUser.isApproved) {
    return <PendingApproval user={currentUser} onLogout={handleLogout} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'manager':
        return <ManagerDashboard user={currentUser} />;
      case 'staff':
        return <StaffDashboard user={currentUser} />;
      case 'guest':
        return <GuestPortal onBack={handleLogout} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <DashboardLayout user={currentUser} onLogout={handleLogout}>
      {renderDashboard()}
    </DashboardLayout>
  );
}