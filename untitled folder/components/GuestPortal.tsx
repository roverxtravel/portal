import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  FileText, 
  ExternalLink, 
  Users, 
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface GuestPortalProps {
  onBack?: () => void;
}

export function GuestPortal({ onBack }: GuestPortalProps) {
  const handleCVApplication = (company: 'roverx' | 'tipsy-ninjas') => {
    // Get company-specific settings
    const companySettings = JSON.parse(localStorage.getItem(`${company}_settings`) || '{}');
    const defaultURL = "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform";
    const cvURL = companySettings.cvURL || defaultURL;
    window.open(cvURL, '_blank');
  };

  // Get editable content from localStorage
  const getContent = () => {
    const content = JSON.parse(localStorage.getItem('portal_content') || '{}');
    return {
      aboutRoverX: content.aboutRoverX || "Leading logistics and transportation company delivering excellence in supply chain management and freight solutions.",
      aboutTipsyNinjas: content.aboutTipsyNinjas || "Innovative hospitality and entertainment company creating unique experiences through creative events and exceptional service.",
      contactEmail: content.contactEmail || "careers@roverx-tipsy.com",
      contactPhone: content.contactPhone || "+1 (555) 123-4567",
      contactAddress: content.contactAddress || "123 Business Ave",
      contactHours: content.contactHours || "Mon-Fri 9AM-6PM",
      positions: content.positions || {
        roverx: [
          { title: "Logistics Coordinator", type: "Full-time • Operations" },
          { title: "Fleet Manager", type: "Full-time • Management" },
          { title: "Driver", type: "Full/Part-time • Operations" }
        ],
        tipsyninjas: [
          { title: "Bartender", type: "Full/Part-time • Bar Operations" },
          { title: "Event Coordinator", type: "Full-time • Events" },
          { title: "Social Media Manager", type: "Full-time • Marketing" }
        ]
      }
    };
  };

  const content = getContent();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      )}
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center space-x-4 mb-6">
            {/* Rover X Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {/* Tipsy Ninjas Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Companies</h1>
          <p className="text-gray-600 text-lg mb-6">
            Join the Rover X team for logistics excellence or Tipsy Ninjas for exciting hospitality experiences. 
            We're always looking for talented individuals!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Learn About Our Companies
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rover X Applications */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Apply to Rover X
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Join our logistics and transportation team. We're looking for 
              dedicated professionals to help move the world forward.
            </p>
            
            <div className="space-y-2">
              {content.positions.roverx.map((position, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">{position.title}</p>
                  <p className="text-xs text-gray-600">{position.type}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => handleCVApplication('roverx')} className="w-full" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply to Rover X
            </Button>
          </CardContent>
        </Card>

        {/* Tipsy Ninjas Applications */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              Apply to Tipsy Ninjas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Be part of our vibrant hospitality team. Create memorable experiences 
              and join our energetic, creative environment.
            </p>
            
            <div className="space-y-2">
              {content.positions.tipsyninjas.map((position, index) => (
                <div key={index} className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-medium text-sm">{position.title}</p>
                  <p className="text-xs text-gray-600">{position.type}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => handleCVApplication('tipsy-ninjas')} className="w-full" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply to Tipsy Ninjas
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              About Rover X
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {content.aboutRoverX}
            </p>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Why Join Rover X?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Industry-leading benefits package</li>
                <li>• Career advancement opportunities</li>
                <li>• Cutting-edge logistics technology</li>
                <li>• Team-oriented work environment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              About Tipsy Ninjas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {content.aboutTipsyNinjas}
            </p>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Why Join Tipsy Ninjas?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Creative and fun work environment</li>
                <li>• Flexible scheduling options</li>
                <li>• Performance-based incentives</li>
                <li>• Skills development programs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">{content.contactEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">{content.contactPhone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-600">{content.contactAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Office Hours</p>
                <p className="text-sm text-gray-600">{content.contactHours}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How long does the application process take?</h4>
              <p className="text-sm text-gray-600">
                Our typical application process takes 2-3 weeks from submission to final decision. 
                You'll receive updates throughout the process.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">What documents should I include?</h4>
              <p className="text-sm text-gray-600">
                Please include your updated CV, a cover letter, and any relevant certifications 
                or portfolio materials.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Can I apply for multiple positions?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can apply for multiple positions that match your skills and interests. 
                Please submit separate applications for each position.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}