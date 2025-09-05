import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Filter,
  UserPlus,
  Edit
} from 'lucide-react';

export function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock staff data
  const staffData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '555-0101',
      department: 'Sales',
      position: 'Sales Manager',
      joinDate: '2023-01-15',
      avatar: '',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '555-0102',
      department: 'Sales',
      position: 'Sales Associate',
      joinDate: '2023-03-20',
      avatar: '',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      phone: '555-0103',
      department: 'Marketing',
      position: 'Marketing Specialist',
      joinDate: '2023-02-10',
      avatar: '',
      status: 'active'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '555-0104',
      department: 'Operations',
      position: 'Operations Manager',
      joinDate: '2022-11-05',
      avatar: '',
      status: 'active'
    },
    {
      id: '5',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '555-0105',
      department: 'HR',
      position: 'HR Specialist',
      joinDate: '2023-04-12',
      avatar: '',
      status: 'active'
    },
    {
      id: '6',
      name: 'David Brown',
      email: 'david.brown@company.com',
      phone: '555-0106',
      department: 'Finance',
      position: 'Financial Analyst',
      joinDate: '2023-01-30',
      avatar: '',
      status: 'active'
    },
    {
      id: '7',
      name: 'Lisa Garcia',
      email: 'lisa.garcia@company.com',
      phone: '555-0107',
      department: 'Marketing',
      position: 'Marketing Manager',
      joinDate: '2022-12-01',
      avatar: '',
      status: 'active'
    },
    {
      id: '8',
      name: 'Tom Wilson',
      email: 'tom.wilson@company.com',
      phone: '555-0108',
      department: 'IT',
      position: 'IT Support Specialist',
      joinDate: '2023-05-15',
      avatar: '',
      status: 'active'
    }
  ];

  const departments = ['all', ...Array.from(new Set(staffData.map(staff => staff.department)))];

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const departmentStats = departments.slice(1).map(dept => ({
    name: dept,
    count: staffData.filter(staff => staff.department === dept).length
  }));

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staffData.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {departmentStats.slice(0, 3).map((dept, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{dept.name}</p>
                  <p className="text-2xl font-bold">{dept.count}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">{dept.count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={staff.avatar} alt={staff.name} />
                  <AvatarFallback className="text-lg">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{staff.name}</h3>
                  <p className="text-gray-600">{staff.position}</p>
                  <Badge variant="secondary" className="mt-1">
                    {staff.department}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{staff.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{staff.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined {staff.joinDate}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Office Building</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Badge variant="default">
                  Active
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                  <Button size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-blue-600">{dept.count}</span>
                </div>
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-gray-500">
                  {((dept.count / staffData.length) * 100).toFixed(0)}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}