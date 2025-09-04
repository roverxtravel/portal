import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload,
  Save,
  Camera
} from 'lucide-react';
import { User as UserType } from '../types/user';

interface ProfileEditProps {
  user: UserType;
}

export function ProfileEdit({ user }: ProfileEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    department: user.department || '',
    position: user.position || '',
    avatar: user.avatar || ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would update the user data in Supabase
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, this would upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          avatar: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback className="text-xl">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-gray-600 mb-2">{user.position} • {user.department}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{user.email}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Join Date</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{user.joinDate || 'Not available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              {isEditing ? (
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{user.department}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              {isEditing ? (
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{user.position}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              <p className="text-gray-900">EMP-{user.id.padStart(4, '0')}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Badge variant={user.isApproved ? 'default' : 'secondary'}>
                {user.isApproved ? 'Active' : 'Pending Approval'}
              </Badge>
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
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Sales report submitted</p>
                  <p className="text-sm text-gray-500">Daily sales: $2,450</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Profile updated</p>
                  <p className="text-sm text-gray-500">Phone number added</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Checked in</p>
                  <p className="text-sm text-gray-500">Attendance marked for today</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">8 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}