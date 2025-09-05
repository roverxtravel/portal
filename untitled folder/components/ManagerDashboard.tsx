import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckInOut } from './CheckInOut';
import { SalesReport } from './SalesReport';
import { ProfileEdit } from './ProfileEdit';
import { AttendanceDashboard } from './AttendanceDashboard';
import { StaffDirectory } from './StaffDirectory';
import { StaffRecognition } from './StaffRecognition';
import { HRManagement } from './HRManagement';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  BarChart3,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '../types/user';
import { LogoManager } from './LogoManager';

interface ManagerDashboardProps {
  user: UserType;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function ManagerDashboard({ user, activeTab = 'dashboard', setActiveTab }: ManagerDashboardProps) {
  const [checkInStatus, setCheckInStatus] = useState<{
    isCheckedIn: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    location?: string;
  }>({
    isCheckedIn: false
  });

  // Mock dashboard data
  const dashboardData = {
    totalStaff: 25,
    presentToday: 23,
    lateToday: 2,
    absentToday: 0,
    totalSalesToday: 45750,
    salesGrowth: 12.5,
    topPerformer: {
      name: 'Jane Smith',
      sales: 8950
    },
    recentActivity: [
      { type: 'check-in', user: 'John Smith', time: '09:00 AM', status: 'on-time' },
      { type: 'sales', user: 'Sarah Wilson', amount: 1250, time: '10:30 AM' },
      { type: 'check-in', user: 'Mike Johnson', time: '09:15 AM', status: 'late' },
      { type: 'sales', user: 'David Brown', amount: 890, time: '11:00 AM' },
    ]
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceDashboard />;
      case 'sales':
        return <SalesReport user={user} isManager={true} />;
      case 'directory':
        return <StaffDirectory />;
      case 'hr':
        return <HRManagement />;
      case 'recognition':
        return <StaffRecognition />;
      case 'profile':
        return <ProfileEdit user={user} />;
      case 'admin':
        return <LogoManager />;
      default:
        return (
          <div className="space-y-6">
            {/* Manager Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Staff</p>
                      <p className="text-2xl font-bold">{dashboardData.totalStaff}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Present Today</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardData.presentToday}</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Late Today</p>
                      <p className="text-2xl font-bold text-yellow-600">{dashboardData.lateToday}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Absent Today</p>
                      <p className="text-2xl font-bold text-red-600">{dashboardData.absentToday}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Today's Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-green-600">
                          ${dashboardData.totalSalesToday.toLocaleString()}
                        </span>
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          +{dashboardData.salesGrowth}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Compared to yesterday
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Top Performer</span>
                        <div className="text-right">
                          <p className="font-semibold">{dashboardData.topPerformer.name}</p>
                          <p className="text-sm text-gray-600">
                            ${dashboardData.topPerformer.sales.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setActiveTab && setActiveTab('attendance')}
                      className="h-20 flex-col"
                      variant="outline"
                    >
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <span className="text-sm">Attendance</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab && setActiveTab('directory')}
                      className="h-20 flex-col"
                      variant="outline"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <span className="text-sm">Staff Directory</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab && setActiveTab('sales')}
                      className="h-20 flex-col"
                      variant="outline"
                    >
                      <TrendingUp className="w-6 h-6 mb-2" />
                      <span className="text-sm">Sales Reports</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab && setActiveTab('recognition')}
                      className="h-20 flex-col"
                      variant="outline"
                    >
                      <Award className="w-6 h-6 mb-2" />
                      <span className="text-sm">Recognition</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        {activity.type === 'check-in' ? (
                          <Clock className={`w-5 h-5 ${
                            activity.status === 'on-time' ? 'text-green-500' : 'text-yellow-500'
                          }`} />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-gray-600">
                            {activity.type === 'check-in' 
                              ? `Checked in ${activity.status === 'late' ? '(Late)' : ''}`
                              : `Sale: $${activity.amount?.toLocaleString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return renderContent();
}