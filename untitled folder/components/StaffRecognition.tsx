import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Award, 
  Star, 
  Trophy, 
  Crown,
  TrendingUp,
  Calendar,
  Users,
  Plus,
  Medal
} from 'lucide-react';

export function StaffRecognition() {
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [nominationData, setNominationData] = useState({
    staffId: '',
    category: 'month',
    reason: ''
  });

  // Mock recognition data
  const recognitionData = {
    currentWinners: {
      month: {
        staff: {
          name: 'Jane Smith',
          department: 'Sales',
          avatar: '',
          achievement: 'Outstanding sales performance with $15,000 revenue',
          votes: 23
        }
      },
      year: {
        staff: {
          name: 'Sarah Wilson',
          department: 'Marketing',
          avatar: '',
          achievement: 'Led 5 successful campaigns increasing brand awareness by 40%',
          votes: 47
        }
      }
    },
    nominees: [
      {
        id: '1',
        name: 'Mike Johnson',
        department: 'Operations',
        avatar: '',
        category: 'month',
        reason: 'Exceptional customer service and problem-solving skills',
        nominatedBy: 'John Doe',
        votes: 18,
        date: '2024-01-10'
      },
      {
        id: '2',
        name: 'Emily Davis',
        department: 'HR',
        avatar: '',
        category: 'month',
        reason: 'Successfully implemented new employee onboarding process',
        nominatedBy: 'Sarah Wilson',
        votes: 15,
        date: '2024-01-12'
      },
      {
        id: '3',
        name: 'David Brown',
        department: 'Finance',
        avatar: '',
        category: 'year',
        reason: 'Streamlined financial processes saving company $50K annually',
        nominatedBy: 'Lisa Garcia',
        votes: 22,
        date: '2024-01-08'
      }
    ],
    pastWinners: [
      {
        name: 'Tom Wilson',
        department: 'IT',
        period: 'December 2023',
        category: 'month',
        achievement: 'Zero-downtime system migration'
      },
      {
        name: 'Lisa Garcia',
        department: 'Marketing',
        period: 'November 2023',
        category: 'month',
        achievement: 'Successful product launch campaign'
      },
      {
        name: 'John Doe',
        department: 'Sales',
        period: '2023',
        category: 'year',
        achievement: 'Exceeded annual sales target by 150%'
      }
    ]
  };

  const handleNomination = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to Supabase
    alert('Nomination submitted successfully!');
    setNominationData({ staffId: '', category: 'month', reason: '' });
    setShowNominationForm(false);
  };

  const staffOptions = [
    { id: '1', name: 'Mike Johnson' },
    { id: '2', name: 'Emily Davis' },
    { id: '3', name: 'David Brown' },
    { id: '4', name: 'Tom Wilson' },
    { id: '5', name: 'Lisa Garcia' }
  ];

  return (
    <div className="space-y-6">
      {/* Current Winners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff of the Month */}
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Award className="w-6 h-6 mr-2 text-yellow-600" />
              Staff of the Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-yellow-300">
                  <AvatarImage 
                    src={recognitionData.currentWinners.month.staff.avatar} 
                    alt={recognitionData.currentWinners.month.staff.name} 
                  />
                  <AvatarFallback className="bg-yellow-100 text-yellow-800 text-lg">
                    {recognitionData.currentWinners.month.staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-800">
                  {recognitionData.currentWinners.month.staff.name}
                </h3>
                <p className="text-yellow-700">
                  {recognitionData.currentWinners.month.staff.department}
                </p>
                <Badge className="mt-1 bg-yellow-200 text-yellow-800">
                  {recognitionData.currentWinners.month.staff.votes} votes
                </Badge>
              </div>
            </div>
            <p className="text-yellow-800 italic">
              "{recognitionData.currentWinners.month.staff.achievement}"
            </p>
          </CardContent>
        </Card>

        {/* Staff of the Year */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Trophy className="w-6 h-6 mr-2 text-purple-600" />
              Staff of the Year 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-purple-300">
                  <AvatarImage 
                    src={recognitionData.currentWinners.year.staff.avatar} 
                    alt={recognitionData.currentWinners.year.staff.name} 
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-800 text-lg">
                    {recognitionData.currentWinners.year.staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Medal className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-800">
                  {recognitionData.currentWinners.year.staff.name}
                </h3>
                <p className="text-purple-700">
                  {recognitionData.currentWinners.year.staff.department}
                </p>
                <Badge className="mt-1 bg-purple-200 text-purple-800">
                  {recognitionData.currentWinners.year.staff.votes} votes
                </Badge>
              </div>
            </div>
            <p className="text-purple-800 italic">
              "{recognitionData.currentWinners.year.staff.achievement}"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Nominate a Colleague</h3>
              <p className="text-gray-600">
                Recognize outstanding performance and dedication
              </p>
            </div>
            <Button onClick={() => setShowNominationForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nominate Staff
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nomination Form */}
      {showNominationForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nominate Staff Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNomination} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Staff Member</label>
                <select
                  value={nominationData.staffId}
                  onChange={(e) => setNominationData({...nominationData, staffId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a staff member...</option>
                  {staffOptions.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={nominationData.category}
                  onChange={(e) => setNominationData({...nominationData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">Staff of the Month</option>
                  <option value="year">Staff of the Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Nomination</label>
                <Textarea
                  placeholder="Describe why this person deserves recognition..."
                  value={nominationData.reason}
                  onChange={(e) => setNominationData({...nominationData, reason: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Submit Nomination</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNominationForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Nominees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Current Nominees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recognitionData.nominees.map((nominee) => (
              <div key={nominee.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={nominee.avatar} alt={nominee.name} />
                      <AvatarFallback>
                        {nominee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{nominee.name}</h4>
                      <p className="text-sm text-gray-600">{nominee.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={nominee.category === 'month' ? 'default' : 'secondary'}>
                      {nominee.category === 'month' ? 'Monthly' : 'Yearly'}
                    </Badge>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>{nominee.votes} votes</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-2">"{nominee.reason}"</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Nominated by {nominee.nominatedBy}</span>
                  <span>{nominee.date}</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-1" />
                    Vote
                  </Button>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Winners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Hall of Fame
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recognitionData.pastWinners.map((winner, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {winner.category === 'month' ? (
                      <Award className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Trophy className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{winner.name}</h4>
                    <p className="text-sm text-gray-600">{winner.department}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">{winner.period}</p>
                  <p className="text-gray-800 italic">"{winner.achievement}"</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}