import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Save, Globe, Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContentManager() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('portal_content') || '{}';
    const parsed = JSON.parse(saved);
    return {
      aboutRoverX: parsed.aboutRoverX || "Leading logistics and transportation company delivering excellence in supply chain management and freight solutions.",
      aboutTipsyNinjas: parsed.aboutTipsyNinjas || "Innovative hospitality and entertainment company creating unique experiences through creative events and exceptional service.",
      contactEmail: parsed.contactEmail || "careers@roverx-tipsy.com",
      contactPhone: parsed.contactPhone || "+1 (555) 123-4567",
      contactAddress: parsed.contactAddress || "123 Business Ave",
      contactHours: parsed.contactHours || "Mon-Fri 9AM-6PM",
    };
  });

  const [companySettings, setCompanySettings] = useState(() => {
    const roverxSettings = JSON.parse(localStorage.getItem('roverx_settings') || '{}');
    const tipsySettings = JSON.parse(localStorage.getItem('tipsyninjas_settings') || '{}');
    return {
      roverx: {
        cvURL: roverxSettings.cvURL || "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform"
      },
      tipsyninjas: {
        cvURL: tipsySettings.cvURL || "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform"
      }
    };
  });

  const handleSaveContent = () => {
    localStorage.setItem('portal_content', JSON.stringify(content));
    alert('Content saved successfully!');
  };

  const handleSaveCompanySettings = () => {
    localStorage.setItem('roverx_settings', JSON.stringify(companySettings.roverx));
    localStorage.setItem('tipsyninjas_settings', JSON.stringify(companySettings.tipsyninjas));
    alert('Company settings saved successfully!');
  };

  const updateContent = (field: string, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const updateCompanySetting = (company: 'roverx' | 'tipsyninjas', field: string, value: string) => {
    setCompanySettings(prev => ({
      ...prev,
      [company]: {
        ...prev[company],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-gray-600">Manage portal content and company settings</p>
      </div>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About Companies</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="applications">Application URLs</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
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
            <CardContent>
              <Textarea
                value={content.aboutRoverX}
                onChange={(e) => updateContent('aboutRoverX', e.target.value)}
                placeholder="Enter Rover X company description"
                rows={4}
                className="mb-4"
              />
            </CardContent>
          </Card>

          <Card>
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
            <CardContent>
              <Textarea
                value={content.aboutTipsyNinjas}
                onChange={(e) => updateContent('aboutTipsyNinjas', e.target.value)}
                placeholder="Enter Tipsy Ninjas company description"
                rows={4}
                className="mb-4"
              />
            </CardContent>
          </Card>

          <Button onClick={handleSaveContent} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save About Information
          </Button>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <Input
                  value={content.contactEmail}
                  onChange={(e) => updateContent('contactEmail', e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <Input
                  value={content.contactPhone}
                  onChange={(e) => updateContent('contactPhone', e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <Input
                  value={content.contactAddress}
                  onChange={(e) => updateContent('contactAddress', e.target.value)}
                  placeholder="Enter office address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Office Hours
                </label>
                <Input
                  value={content.contactHours}
                  onChange={(e) => updateContent('contactHours', e.target.value)}
                  placeholder="Enter office hours"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveContent} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Contact Information
          </Button>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Rover X Application URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  CV Application Form URL
                </label>
                <Input
                  value={companySettings.roverx.cvURL}
                  onChange={(e) => updateCompanySetting('roverx', 'cvURL', e.target.value)}
                  placeholder="Enter Google Forms URL or application link"
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  This URL will be opened when guests click "Apply to Rover X"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                Tipsy Ninjas Application URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  CV Application Form URL
                </label>
                <Input
                  value={companySettings.tipsyninjas.cvURL}
                  onChange={(e) => updateCompanySetting('tipsyninjas', 'cvURL', e.target.value)}
                  placeholder="Enter Google Forms URL or application link"
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  This URL will be opened when guests click "Apply to Tipsy Ninjas"
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveCompanySettings} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Application URLs
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}