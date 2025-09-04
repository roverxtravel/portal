import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Settings, FileText } from 'lucide-react';
import { ContentManager } from './ContentManager';

interface BrandSettings {
  logoLeft: string;
  logoRight: string;
  logoSize: number;
  checkInURL: string;
  leaveURL: string;
  cvURL: string;
}

const DEFAULTS: BrandSettings = {
  logoLeft: "https://files.catbox.moe/8c0x7w.png", // fallback (Rover X)
  logoRight: "https://files.catbox.moe/3j1q2a.png", // fallback (Tipsy Ninjas)
  logoSize: 120,
  checkInURL: "https://docs.google.com/spreadsheets/d/19DbytZMQborRmbqvDbb9gAJqdu_ClmuLTdVTklDxEfA/edit?usp=sharing",
  leaveURL: "https://forms.gle/idkWEa9db5QwUAE3A",
  cvURL: "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform"
};

export function LogoManager() {
  const [settings, setSettings] = useState<BrandSettings>(DEFAULTS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('rx_brand');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULTS, ...parsed });
      } catch (e) {
        console.error('Failed to parse brand settings:', e);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof BrandSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('rx_brand', JSON.stringify(settings));
    setHasChanges(false);
    // Show success message
    alert('Brand settings saved successfully! Refresh the page to see changes on the login screen.');
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    setHasChanges(true);
  };

  const previewLogin = () => {
    // This would trigger a preview of the login page - for now just alert
    alert('Login preview would show here. In a full implementation, this would open a modal or navigate to preview.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-gray-600">Manage logos, content, and portal settings</p>
      </div>

      <Tabs defaultValue="logos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logos" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Logo & Links
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Portal Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logos" className="space-y-6">
          <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logoLeft">Rover X Logo URL</Label>
              <Input
                id="logoLeft"
                type="url"
                value={settings.logoLeft}
                onChange={(e) => handleSettingChange('logoLeft', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoRight">Tipsy Ninjas Logo URL</Label>
              <Input
                id="logoRight"
                type="url"
                value={settings.logoRight}
                onChange={(e) => handleSettingChange('logoRight', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Logo Size Slider */}
          <div className="space-y-2">
            <Label>Logo Size: {settings.logoSize}px</Label>
            <Slider
              value={[settings.logoSize]}
              onValueChange={([value]) => handleSettingChange('logoSize', value)}
              min={60}
              max={220}
              step={2}
              className="w-full"
            />
          </div>

          {/* Logo Preview */}
          <div className="space-y-2">
            <Label>Logo Preview</Label>
            <div className="flex justify-center space-x-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl overflow-hidden bg-white border shadow-lg">
                  <img
                    src={settings.logoLeft}
                    alt="Rover X Logo"
                    style={{ width: `${Math.min(settings.logoSize, 120)}px`, height: 'auto' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULTS.logoLeft;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">Rover X</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-xl overflow-hidden bg-white border shadow-lg">
                  <img
                    src={settings.logoRight}
                    alt="Tipsy Ninjas Logo"
                    style={{ width: `${Math.min(settings.logoSize, 120)}px`, height: 'auto' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULTS.logoRight;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">Tipsy Ninjas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portal Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkInURL">Check-In URL (Google Sheets)</Label>
            <Input
              id="checkInURL"
              type="url"
              value={settings.checkInURL}
              onChange={(e) => handleSettingChange('checkInURL', e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveURL">Leave Form URL</Label>
            <Input
              id="leaveURL"
              type="url"
              value={settings.leaveURL}
              onChange={(e) => handleSettingChange('leaveURL', e.target.value)}
              placeholder="https://forms.gle/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvURL">CV Application URL</Label>
            <Input
              id="cvURL"
              type="url"
              value={settings.cvURL}
              onChange={(e) => handleSettingChange('cvURL', e.target.value)}
              placeholder="https://docs.google.com/forms/..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Settings
        </Button>
        <Button 
          onClick={previewLogin} 
          variant="outline"
        >
          Preview Login Page
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline"
        >
          Reset to Defaults
        </Button>
      </div>

          {hasChanges && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              ⚠️ You have unsaved changes. Remember to save your settings!
            </div>
          )}
        </TabsContent>

        <TabsContent value="content">
          <ContentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}