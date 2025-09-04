import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Navigation
} from 'lucide-react';
import { User } from '../types/user';

interface CheckInOutProps {
  user: User;
  status: {
    isCheckedIn: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    location?: string;
  };
  onStatusChange: (status: any) => void;
}

export function CheckInOut({ user, status, onStatusChange }: CheckInOutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Loading location...');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate getting location
    setTimeout(() => {
      setLocation('Office Building, Floor 3');
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    onStatusChange({
      isCheckedIn: true,
      checkInTime: now,
      checkOutTime: undefined,
      location: location
    });
  };

  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    onStatusChange({
      isCheckedIn: false,
      checkInTime: status.checkInTime,
      checkOutTime: now,
      location: status.location
    });
  };

  // Mock attendance history
  const attendanceHistory = [
    { date: '2024-01-15', checkIn: '09:00', checkOut: '17:30', hours: 8.5, status: 'complete' },
    { date: '2024-01-14', checkIn: '08:45', checkOut: '17:15', hours: 8.5, status: 'complete' },
    { date: '2024-01-13', checkIn: '09:30', checkOut: '17:45', hours: 8.25, status: 'late' },
    { date: '2024-01-12', checkIn: '08:55', checkOut: '17:25', hours: 8.5, status: 'complete' },
    { date: '2024-01-11', checkIn: '-', checkOut: '-', hours: 0, status: 'absent' }
  ];

  const thisWeekStats = {
    totalHours: 34.75,
    averageCheckIn: '09:02',
    daysPresent: 4,
    daysLate: 1
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Check In/Out
            </div>
            <Badge variant={status.isCheckedIn ? 'default' : 'secondary'}>
              {status.isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time Display */}
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
            <Navigation className="w-4 h-4 cursor-pointer hover:text-blue-600" />
          </div>

          {/* Status Display */}
          {status.isCheckedIn && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Checked In</p>
                    <p className="text-sm text-green-600">
                      Since {status.checkInTime} at {status.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="w-full max-w-xs"
              onClick={status.isCheckedIn ? handleCheckOut : handleCheckIn}
            >
              {status.isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            This Week's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{thisWeekStats.totalHours}h</div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{thisWeekStats.daysPresent}</div>
              <div className="text-sm text-gray-500">Days Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{thisWeekStats.daysLate}</div>
              <div className="text-sm text-gray-500">Days Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{thisWeekStats.averageCheckIn}</div>
              <div className="text-sm text-gray-500">Avg Check-in</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceHistory.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  {day.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {day.status === 'late' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  {day.status === 'absent' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{day.checkIn} - {day.checkOut}</span>
                      {day.hours > 0 && (
                        <span className="text-gray-400">• {day.hours}h</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <Badge variant={
                  day.status === 'complete' ? 'default' : 
                  day.status === 'late' ? 'secondary' : 'destructive'
                }>
                  {day.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}