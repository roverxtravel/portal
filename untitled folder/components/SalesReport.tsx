import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  ExternalLink,
  Calendar,
  Target,
  Users,
  BarChart3
} from 'lucide-react';
import { User } from '../types/user';

interface SalesReportProps {
  user: User;
  isManager?: boolean;
}

export function SalesReport({ user, isManager = false }: SalesReportProps) {
  const [reportData, setReportData] = useState({
    dailySales: '',
    customers: '',
    notes: ''
  });

  // Mock sales data
  const salesData = {
    today: 2450,
    thisWeek: 12750,
    thisMonth: 48500,
    target: 50000,
    reports: [
      {
        date: '2024-01-15',
        amount: 2450,
        customers: 8,
        staff: 'Jane Smith',
        status: 'submitted',
        notes: 'Great day with premium product sales'
      },
      {
        date: '2024-01-14',
        amount: 1890,
        customers: 6,
        staff: 'John Doe',
        status: 'submitted',
        notes: 'Steady flow of customers'
      },
      {
        date: '2024-01-13',
        amount: 3200,
        customers: 12,
        staff: 'Sarah Wilson',
        status: 'submitted',
        notes: 'Weekend rush, excellent performance'
      }
    ],
    teamData: isManager ? [
      { name: 'Jane Smith', sales: 8950, target: 10000, customers: 45 },
      { name: 'John Doe', sales: 7800, target: 8000, customers: 38 },
      { name: 'Sarah Wilson', sales: 9200, target: 9000, customers: 52 },
      { name: 'Mike Johnson', sales: 6500, target: 8000, customers: 32 }
    ] : []
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would sync with Google Sheets
    alert('Sales report submitted successfully!');
    setReportData({ dailySales: '', customers: '', notes: '' });
  };

  const progressPercentage = (salesData.thisMonth / salesData.target) * 100;

  return (
    <div className="space-y-6">
      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${salesData.today.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${salesData.thisWeek.toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${salesData.thisMonth.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Target</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${salesData.target.toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Progress</span>
            <Badge variant={progressPercentage >= 100 ? 'default' : 'secondary'}>
              {progressPercentage.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: ${salesData.thisMonth.toLocaleString()}</span>
              <span>Target: ${salesData.target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${(salesData.target - salesData.thisMonth).toLocaleString()} remaining to reach target
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Daily Report */}
      {!isManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Submit Daily Sales Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Sales ($)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={reportData.dailySales}
                    onChange={(e) => setReportData({...reportData, dailySales: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Customers</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={reportData.customers}
                    onChange={(e) => setReportData({...reportData, customers: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <Textarea
                  placeholder="Any additional notes about today's sales..."
                  value={reportData.notes}
                  onChange={(e) => setReportData({...reportData, notes: e.target.value})}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Performance (Manager View) */}
      {isManager && salesData.teamData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.teamData.map((member, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{member.name}</h4>
                    <Badge variant={member.sales >= member.target ? 'default' : 'secondary'}>
                      {((member.sales / member.target) * 100).toFixed(0)}% of target
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Sales</p>
                      <p className="font-medium">${member.sales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-medium">${member.target.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Customers</p>
                      <p className="font-medium">{member.customers}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((member.sales / member.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Recent Sales Reports
            </span>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Google Sheets
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salesData.reports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{report.date}</p>
                      {isManager && (
                        <p className="text-sm text-gray-600">by {report.staff}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="default">{report.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-gray-600">Sales: </span>
                    <span className="font-medium text-green-600">
                      ${report.amount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Customers: </span>
                    <span className="font-medium">{report.customers}</span>
                  </div>
                </div>
                {report.notes && (
                  <p className="text-sm text-gray-600 italic">{report.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}