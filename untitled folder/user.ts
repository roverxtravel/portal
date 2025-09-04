export type UserRole = 'staff' | 'manager' | 'guest' | 'pending' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: 'roverx' | 'tipsy-ninjas';
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  joinDate?: string;
  isApproved: boolean;
  tabs?: {
    checkIn?: boolean;
    leave?: boolean;
    dailySale?: boolean;
    admin?: boolean;
    cv?: boolean;
  };
  sheets?: Array<{
    name: string;
    url: string;
  }>;
}

export interface BrandSettings {
  logoLeft: string;
  logoRight: string;
  logoSize: number;
  checkInURL: string;
  leaveURL: string;
  cvURL: string;
}

export interface Session {
  email: string;
  name: string;
  role: UserRole;
  status: string;
  tabs: {
    checkIn?: boolean;
    leave?: boolean;
    dailySale?: boolean;
    admin?: boolean;
    cv?: boolean;
  };
  sheets?: Array<{
    name: string;
    url: string;
  }>;
  exp: number;
}