import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../types/user';
import { getBrandSettings } from '../data/mockUsers';

interface LoginPageProps {
  onLogin: (email?: string, isGuest?: boolean) => User | undefined;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [brandSettings, setBrandSettings] = useState(getBrandSettings());

  useEffect(() => {
    // Listen for brand settings changes (useful for admin preview)
    const handleStorageChange = () => {
      setBrandSettings(getBrandSettings());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate Google OAuth flow with account selection
    setTimeout(() => {
      if (selectedAccount) {
        const user = onLogin(selectedAccount);
        if (!user) {
          setError('Account not registered. Please contact your administrator.');
          setIsLoading(false);
        }
      } else {
        // Simulate Google account picker
        setSelectedAccount('john.doe@roverx.com'); // Demo default
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      onLogin(undefined, true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center space-x-8 mb-4">
            {/* Rover X Logo - Left */}
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white border">
                <img
                  src={brandSettings.logoLeft}
                  alt="Rover X"
                  style={{ 
                    width: `${Math.min(brandSettings.logoSize, 120)}px`, 
                    height: 'auto',
                    maxHeight: '120px'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://files.catbox.moe/8c0x7w.png";
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">Rover X</span>
            </div>

            {/* Tipsy Ninjas Logo - Right */}
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white border">
                <img
                  src={brandSettings.logoRight}
                  alt="Tipsy Ninjas"
                  style={{ 
                    width: `${Math.min(brandSettings.logoSize, 120)}px`, 
                    height: 'auto',
                    maxHeight: '120px'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://files.catbox.moe/3j1q2a.png";
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">Tipsy Ninjas</span>
            </div>
          </div>
          
          <CardTitle>Rover X & Tipsy Ninjas</CardTitle>
          <CardDescription>
            Internal Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Connecting...' : 'Sign in with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button 
            onClick={handleGuestLogin}
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Continue as Guest (CV Application only)'}
          </Button>
          
          <div className="text-xs text-center text-gray-500 mt-2">
            If you see a Google popup, please allow the sign-in window.
          </div>
            
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}