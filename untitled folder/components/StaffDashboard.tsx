import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckInOut } from './CheckInOut';
import { SalesReport } from './SalesReport';
import { ProfileEdit } from './ProfileEdit';
import { 
  Clock, 
  TrendingUp, 
  CalendarDays, 
  MapPin,
  CheckCircle,
  User
} from 'lucide-react';
import { User as UserType } from '../types/user';

interface StaffDashboardProps {
  user: UserType;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function StaffDashboard({ user, activeTab = 'dashboard', setActiveTab }: StaffDashboardProps) {
  const [checkInStatus, setCheckInStatus] = useState<{
    isCheckedIn: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    location?: string;
  }>({
    isCheckedIn: false
  });

  // Mock attendance data
  const attendanceData = {
    thisMonth: {
      present: 18,
      absent: 2,
      late: 1,
      workingHours: 144
    },
    recent: [
      { date: '2024-01-15', status: 'present', checkIn: '09:00', checkOut: '17:30' },
      { date: '2024-01-14', status: 'present', checkIn: '08:45', checkOut: '17:15' },
      { date: '2024-01-13', status: 'late', checkIn: '09:30', checkOut: '17:45' },
      { date: '2024-01-12', status: 'present', checkIn: '08:55', checkOut: '17:25' },
      { date: '2024-01-11', status: 'absent', checkIn: '-', checkOut: '-' }
    ]
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <CheckInOut user={user} status={checkInStatus} onStatusChange={setCheckInStatus} />;
      case 'sales':
        return <SalesReport user={user} />;
      case 'profile':
        return <ProfileEdit user={user} />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                    <p className="text-gray-600">{user.department} • {user.position}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Office Location</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Check In/Out</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {checkInStatus.isCheckedIn ? 'Currently checked in' : 'Ready to check in'}
                      </p>
                      <Button 
                        onClick={() => setActiveTab && setActiveTab('attendance')}
                        className="w-full"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {checkInStatus.isCheckedIn ? 'Check Out' : 'Check In'}
                      </Button>
                    </div>
                    <div className="text-right">
                      <Badge variant={checkInStatus.isCheckedIn ? 'default' : 'secondary'}>
                        {checkInStatus.isCheckedIn ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sales Report</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Submit your daily sales data
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab && setActiveTab('sales')}
                        className="w-full"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Reports
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">$2,450</div>
                      <div className="text-sm text-gray-500">Today's sales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  This Month's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{attendanceData.thisMonth.present}</div>
                    <div className="text-sm text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{attendanceData.thisMonth.absent}</div>
                    <div className="text-sm text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{attendanceData.thisMonth.late}</div>
                    <div className="text-sm text-gray-500">Late</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendanceData.thisMonth.workingHours}h</div>
                    <div className="text-sm text-gray-500">Total Hours</div>
                  </div>
                </div>

                {/* Recent Attendance */}
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  {attendanceData.recent.map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className={`w-4 h-4 ${
                          day.status === 'present' ? 'text-green-500' : 
                          day.status === 'late' ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span className="font-medium">{day.date}</span>
                        <Badge variant={
                          day.status === 'present' ? 'default' : 
                          day.status === 'late' ? 'secondary' : 'destructive'
                        }>
                          {day.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {day.checkIn} - {day.checkOut}
                      </div>
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