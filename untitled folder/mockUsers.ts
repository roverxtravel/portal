import { User } from '../types/user';

// Mock user data - in real app this would come from Supabase
export const mockUsers: User[] = [
  // Rover X Users
  {
    id: '1',
    email: 'john.doe@roverx.com',
    name: 'John Doe',
    role: 'manager',
    company: 'roverx',
    department: 'Operations',
    position: 'Operations Manager',
    phone: '555-0101',
    joinDate: '2023-01-15',
    isApproved: true,
    tabs: {
      checkIn: true,
      leave: true,
      dailySale: true,
      admin: true
    },
    sheets: [
      {
        name: 'Rover X Daily Sales',
        url: 'https://docs.google.com/spreadsheets/d/1example1/edit'
      }
    ]
  },
  {
    id: '2',
    email: 'jane.smith@roverx.com',
    name: 'Jane Smith',
    role: 'staff',
    company: 'roverx',
    department: 'Logistics',
    position: 'Logistics Coordinator',
    phone: '555-0102',
    joinDate: '2023-03-20',
    isApproved: true,
    tabs: {
      checkIn: true,
      leave: true,
      cv: true
    }
  },
  {
    id: '3',
    email: 'pending.user@roverx.com',
    name: 'Alex Chen',
    role: 'pending',
    company: 'roverx',
    department: 'Technology',
    position: 'Software Engineer',
    isApproved: false,
    tabs: {
      cv: true
    }
  },
  // Tipsy Ninjas Users
  {
    id: '4',
    email: 'sarah.wilson@tipsyninjas.com',
    name: 'Sarah Wilson',
    role: 'manager',
    company: 'tipsy-ninjas',
    department: 'Events',
    position: 'Event Manager',
    phone: '555-0104',
    joinDate: '2023-02-10',
    isApproved: true,
    tabs: {
      checkIn: true,
      leave: true,
      dailySale: true,
      admin: true
    },
    sheets: [
      {
        name: 'Tipsy Ninjas Events Sales',
        url: 'https://docs.google.com/spreadsheets/d/1example2/edit'
      }
    ]
  },
  {
    id: '5',
    email: 'mike.johnson@tipsyninjas.com',
    name: 'Mike Johnson',
    role: 'staff',
    company: 'tipsy-ninjas',
    department: 'Bar Operations',
    position: 'Head Bartender',
    phone: '555-0105',
    joinDate: '2023-04-12',
    isApproved: true,
    tabs: {
      checkIn: true,
      leave: true,
      cv: true
    }
  },
  {
    id: '6',
    email: 'pending.ninja@tipsyninjas.com',
    name: 'Lisa Garcia',
    role: 'pending',
    company: 'tipsy-ninjas',
    department: 'Marketing',
    position: 'Social Media Manager',
    isApproved: false,
    tabs: {
      cv: true
    }
  },
  // Admin user for both companies
  {
    id: '7',
    email: 'admin@portal.com',
    name: 'System Administrator',
    role: 'admin',
    company: 'roverx', // Default company
    department: 'IT',
    position: 'System Admin',
    isApproved: true,
    tabs: {
      checkIn: true,
      leave: true,
      dailySale: true,
      admin: true
    }
  }
];

export const getBrandSettings = () => {
  const saved = localStorage.getItem('rx_brand');
  const defaults = {
    logoLeft: "https://files.catbox.moe/8c0x7w.png",
    logoRight: "https://files.catbox.moe/3j1q2a.png", 
    logoSize: 120,
    checkInURL: "https://docs.google.com/spreadsheets/d/19DbytZMQborRmbqvDbb9gAJqdu_ClmuLTdVTklDxEfA/edit?usp=sharing",
    leaveURL: "https://forms.gle/idkWEa9db5QwUAE3A",
    cvURL: "https://docs.google.com/forms/d/18PDSTMt6LP2h6yPpscdZ322-bjrDitKB669WD05ho4I/viewform"
  };
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...defaults, ...parsed };
    } catch (e) {
      console.error('Failed to parse brand settings:', e);
    }
  }
  
  return defaults;
};