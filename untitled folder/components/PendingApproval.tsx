import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Clock, 
  User, 
  Mail, 
  AlertCircle,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { User as UserType } from '../types/user';

interface PendingApprovalProps {
  user: UserType;
  onLogout: () => void;
}

export function PendingApproval({ user, onLogout }: PendingApprovalProps) {
  const getCompanyBranding = () => {
    if (user.company === 'roverx') {
      return {
        name: 'Rover X',
        bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      };
    } else {
      return {
        name: 'Tipsy Ninjas',
        bgColor: 'bg-gradient-to-br from-purple-600 to-pink-600',
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )
      };
    }
  };

  const companyBranding = getCompanyBranding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 ${companyBranding.bgColor} rounded-2xl flex items-center justify-center`}>
              {companyBranding.icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Under Review</h1>
          <p className="text-gray-600">
            Your {companyBranding.name} registration is being processed by our administrators
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Pending Approval
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <p className="font-medium">{user.department || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Position</label>
                <p className="font-medium">{user.position || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              What happens next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-gray-600">Your registration has been received and is in our system.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Under Review</p>
                  <p className="text-sm text-gray-600">Our administrators are currently reviewing your application.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-400">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Approval & Access</p>
                  <p className="text-sm text-gray-400">Once approved, you'll gain full access to the company portal.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expected Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Expected Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Typical approval time: 1-3 business days</span>
              </div>
              <p className="text-sm text-blue-700">
                You'll receive an email notification once your account has been approved. 
                If you have any urgent questions, please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about your application or need assistance, please contact:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">admin@company.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Phone: +1 (555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>{companyBranding.name} Portal © 2024</p>
          <p>This page will automatically refresh when your account is approved</p>
        </div>
      </div>
    </div>
  );
}