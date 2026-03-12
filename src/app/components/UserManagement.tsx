import { Layout } from './Layout';
import { User, Mail, Phone, MapPin, Calendar, Search, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      city: 'San Francisco',
      joined: '2025-01-15',
      requests: 24,
      status: 'Active',
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      city: 'Los Angeles',
      joined: '2025-02-20',
      requests: 18,
      status: 'Active',
    },
    {
      id: 'USR-003',
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      phone: '+1 (555) 345-6789',
      city: 'San Diego',
      joined: '2025-03-10',
      requests: 12,
      status: 'Active',
    },
    {
      id: 'USR-004',
      name: 'Alice Brown',
      email: 'alice.brown@email.com',
      phone: '+1 (555) 456-7890',
      city: 'San Jose',
      joined: '2024-12-05',
      requests: 35,
      status: 'Active',
    },
    {
      id: 'USR-005',
      name: 'Charlie Davis',
      email: 'charlie.davis@email.com',
      phone: '+1 (555) 567-8901',
      city: 'Oakland',
      joined: '2024-11-18',
      requests: 8,
      status: 'Inactive',
    },
  ];

  const collectors = [
    {
      id: 'COL-001',
      name: 'Mike Johnson',
      email: 'mike.j@collector.com',
      phone: '+1 (555) 111-2222',
      city: 'San Francisco',
      joined: '2024-06-10',
      completed: 342,
      vehicles: 2,
      status: 'Active',
    },
    {
      id: 'COL-002',
      name: 'Sarah Williams',
      email: 'sarah.w@collector.com',
      phone: '+1 (555) 333-4444',
      city: 'Oakland',
      joined: '2024-07-15',
      completed: 289,
      vehicles: 2,
      status: 'Active',
    },
    {
      id: 'COL-003',
      name: 'David Martinez',
      email: 'david.m@collector.com',
      phone: '+1 (555) 555-6666',
      city: 'San Jose',
      joined: '2024-08-20',
      completed: 256,
      vehicles: 1,
      status: 'Active',
    },
  ];

  const recyclers = [
    {
      id: 'REC-001',
      name: 'GreenTech Recyclers',
      email: 'contact@greentech.com',
      phone: '+1 (555) 987-6543',
      city: 'San Francisco',
      joined: '2024-08-12',
      processed: 486,
      capacity: 'High',
      status: 'Active',
    },
    {
      id: 'REC-002',
      name: 'EcoWaste Solutions',
      email: 'info@ecowaste.com',
      phone: '+1 (555) 876-5432',
      city: 'Oakland',
      joined: '2024-09-05',
      processed: 352,
      capacity: 'Medium',
      status: 'Active',
    },
    {
      id: 'REC-003',
      name: 'TechRecycle Pro',
      email: 'support@techrecycle.com',
      phone: '+1 (555) 765-4321',
      city: 'San Jose',
      joined: '2024-10-20',
      processed: 298,
      capacity: 'Medium',
      status: 'Active',
    },
  ];

  return (
    <Layout userType="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage users, collectors, and recyclers in the system</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Add New User
          </Button>
        </div>

        {/* Users Table */}
        <Card className="border border-border shadow-sm mb-8">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Registered Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Requests</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary">{user.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{user.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{user.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{user.joined}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{user.requests}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                        user.status === 'Active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Collectors Table */}
        <Card className="border border-border shadow-sm mb-8">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              Registered Collectors
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Collector ID</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Vehicles</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {collectors.map((collector) => (
                  <tr key={collector.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-secondary">{collector.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{collector.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{collector.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{collector.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{collector.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{collector.joined}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{collector.completed}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{collector.vehicles}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                        collector.status === 'Active' 
                          ? 'bg-secondary/10 text-secondary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {collector.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {collector.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recyclers Table */}
        <Card className="border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Registered Recyclers
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Recycler ID</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Processed</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {recyclers.map((recycler) => (
                  <tr key={recycler.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary">{recycler.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{recycler.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{recycler.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{recycler.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{recycler.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{recycler.joined}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{recycler.processed}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{recycler.capacity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                        recycler.status === 'Active' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {recycler.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {recycler.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}