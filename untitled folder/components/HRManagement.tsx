import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Briefcase,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface Position {
  id: string;
  title: string;
  company: 'roverx' | 'tipsyninjas';
  type: string;
  description: string;
  requirements: string[];
  datePosted: string;
  isActive: boolean;
}

export function HRManagement() {
  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('hr_positions');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default positions
    return [
      {
        id: '1',
        title: 'Logistics Coordinator',
        company: 'roverx',
        type: 'Full-time • Operations',
        description: 'Coordinate logistics operations and manage supply chain activities.',
        requirements: ['Bachelor\'s degree', '2+ years experience', 'Strong organizational skills'],
        datePosted: '2024-01-15',
        isActive: true
      },
      {
        id: '2',
        title: 'Bartender',
        company: 'tipsyninjas',
        type: 'Full/Part-time • Bar Operations',
        description: 'Create exceptional beverage experiences for our guests.',
        requirements: ['Previous bartending experience', 'Customer service skills', 'Flexible schedule'],
        datePosted: '2024-01-10',
        isActive: true
      }
    ];
  });

  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const savePositions = (newPositions: Position[]) => {
    setPositions(newPositions);
    localStorage.setItem('hr_positions', JSON.stringify(newPositions));
    
    // Update portal content with current active positions
    const portalContent = JSON.parse(localStorage.getItem('portal_content') || '{}');
    const activeRoverXPositions = newPositions
      .filter(p => p.company === 'roverx' && p.isActive)
      .map(p => ({ title: p.title, type: p.type }));
    const activeTipsyPositions = newPositions
      .filter(p => p.company === 'tipsyninjas' && p.isActive)
      .map(p => ({ title: p.title, type: p.type }));
    
    portalContent.positions = {
      roverx: activeRoverXPositions,
      tipsyninjas: activeTipsyPositions
    };
    
    localStorage.setItem('portal_content', JSON.stringify(portalContent));
  };

  const handleCreatePosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      title: '',
      company: 'roverx',
      type: '',
      description: '',
      requirements: [],
      datePosted: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setEditingPosition(newPosition);
    setIsCreating(true);
  };

  const handleSavePosition = (position: Position) => {
    if (isCreating) {
      const newPositions = [...positions, position];
      savePositions(newPositions);
      setIsCreating(false);
    } else {
      const updatedPositions = positions.map(p => p.id === position.id ? position : p);
      savePositions(updatedPositions);
    }
    setEditingPosition(null);
  };

  const handleDeletePosition = (id: string) => {
    const updatedPositions = positions.filter(p => p.id !== id);
    savePositions(updatedPositions);
  };

  const handleToggleActive = (id: string) => {
    const updatedPositions = positions.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    savePositions(updatedPositions);
  };

  const getCompanyBadge = (company: string) => {
    return company === 'roverx' 
      ? <Badge className="bg-blue-100 text-blue-800">Rover X</Badge>
      : <Badge className="bg-purple-100 text-purple-800">Tipsy Ninjas</Badge>;
  };

  const PositionForm = ({ position, onSave, onCancel }: { 
    position: Position; 
    onSave: (position: Position) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(position);
    const [requirementInput, setRequirementInput] = useState('');

    const addRequirement = () => {
      if (requirementInput.trim()) {
        setFormData({
          ...formData,
          requirements: [...formData.requirements, requirementInput.trim()]
        });
        setRequirementInput('');
      }
    };

    const removeRequirement = (index: number) => {
      setFormData({
        ...formData,
        requirements: formData.requirements.filter((_, i) => i !== index)
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isCreating ? 'Create New Position' : 'Edit Position'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter position title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value as 'roverx' | 'tipsyninjas' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="roverx">Rover X</option>
                <option value="tipsyninjas">Tipsy Ninjas</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Employment Type</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., Full-time • Operations"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter job description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add a requirement"
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <Button onClick={addRequirement} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{req}</span>
                  <Button
                    onClick={() => removeRequirement(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => onSave(formData)} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Position
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (editingPosition) {
    return (
      <PositionForm
        position={editingPosition}
        onSave={handleSavePosition}
        onCancel={() => {
          setEditingPosition(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">HR Management</h2>
          <p className="text-gray-600">Manage job positions and announcements</p>
        </div>
        <Button onClick={handleCreatePosition}>
          <Plus className="w-4 h-4 mr-2" />
          Create Position
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Positions</p>
                <p className="text-2xl font-bold text-green-600">{positions.filter(p => p.isActive).length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rover X Positions</p>
                <p className="text-2xl font-bold text-blue-600">{positions.filter(p => p.company === 'roverx').length}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tipsy Ninjas Positions</p>
                <p className="text-2xl font-bold text-purple-600">{positions.filter(p => p.company === 'tipsyninjas').length}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {positions.map((position) => (
          <Card key={position.id} className={`${!position.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {position.title}
                    {!position.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getCompanyBadge(position.company)}
                    <Badge variant="outline">{position.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => setEditingPosition(position)}
                    size="sm"
                    variant="ghost"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeletePosition(position.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{position.description}</p>
              
              {position.requirements.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {position.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted {new Date(position.datePosted).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => handleToggleActive(position.id)}
                  size="sm"
                  variant={position.isActive ? "destructive" : "default"}
                >
                  {position.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
            <p className="text-gray-600 mb-4">Create your first job position to get started.</p>
            <Button onClick={handleCreatePosition}>
              <Plus className="w-4 h-4 mr-2" />
              Create Position
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}