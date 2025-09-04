import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';

export function AttendanceDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock attendance data
  const attendanceData = {
    summary: {
      totalStaff: 25,
      presentToday: 23,
      lateToday: 2,
      absentToday: 0,
      averageHours: 8.2
    },
    staff: [
      {
        id: '1',
        name: 'Jane Smith',
        department: 'Sales',
        checkIn: '08:45',
        checkOut: '17:30',
        status: 'present',
        hours: 8.75,
        location: 'Office Building',
        avatar: ''
      },
      {
        id: '2',
        name: 'John Doe',
        department: 'Marketing',
        checkIn: '09:15',
        checkOut: '18:00',
        status: 'late',
        hours: 8.75,
        location: 'Office Building',
        avatar: ''
      },
      {
        id: '3',
        name: 'Sarah Wilson',
        department: 'Sales',
        checkIn: '08:30',
        checkOut: '17:15',
        status: 'present',
        hours: 8.75,
        location: 'Office Building',
        avatar: ''
      },
      {
        id: '4',
        name: 'Mike Johnson',
        department: 'Operations',
        checkIn: '09:00',
        checkOut: '18:30',
        status: 'present',
        hours: 9.5,
        location: 'Office Building',
        avatar: ''
      },
      {
        id: '5',
        name: 'Emily Davis',
        department: 'HR',
        checkIn: '08:55',
        checkOut: '17:25',
        status: 'present',
        hours: 8.5,
        location: 'Office Building',
        avatar: ''
      }
    ],
    weeklyTrends: [
      { day: 'Mon', present: 24, late: 1, absent: 0 },
      { day: 'Tue', present: 23, late: 2, absent: 0 },
      { day: 'Wed', present: 25, late: 0, absent: 0 },
      { day: 'Thu', present: 22, late: 2, absent: 1 },
      { day: 'Fri', present: 23, late: 2, absent: 0 }
    ]
  };

  const filteredStaff = attendanceData.staff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'late':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'absent':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default">Present</Badge>;
      case 'late':
        return <Badge variant="secondary">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{attendanceData.summary.totalStaff}</p>
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
                <p className="text-2xl font-bold text-green-600">
                  {attendanceData.summary.presentToday}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Today</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {attendanceData.summary.lateToday}
                </p>
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
                <p className="text-2xl font-bold text-red-600">
                  {attendanceData.summary.absentToday}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Hours</p>
                <p className="text-2xl font-bold text-purple-600">
                  {attendanceData.summary.averageHours}h
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Weekly Attendance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {attendanceData.weeklyTrends.map((day, index) => (
              <div key={index} className="text-center">
                <p className="font-medium mb-2">{day.day}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{day.present}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Late: {day.late} | Absent: {day.absent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(staff.status)}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                    <AvatarFallback>
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{staff.name}</h4>
                    <p className="text-sm text-gray-600">{staff.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Check In</p>
                    <p className="font-medium">{staff.checkIn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Check Out</p>
                    <p className="font-medium">{staff.checkOut}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Hours</p>
                    <p className="font-medium">{staff.hours}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium text-xs">{staff.location}</p>
                  </div>
                  {getStatusBadge(staff.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}