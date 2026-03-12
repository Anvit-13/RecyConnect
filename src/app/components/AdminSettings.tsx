import { useState } from 'react';
import { Layout } from './Layout';
import { UserX, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface InactiveUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  inactiveDays: number;
  totalRequests: number;
}

export function AdminSettings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<InactiveUser | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([
    {
      id: 'USR-001',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      role: 'User',
      lastActive: '2025-11-15',
      inactiveDays: 116,
      totalRequests: 3,
    },
    {
      id: 'USR-002',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'User',
      lastActive: '2025-10-20',
      inactiveDays: 142,
      totalRequests: 1,
    },
    {
      id: 'COL-003',
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      role: 'Collector',
      lastActive: '2025-12-01',
      inactiveDays: 100,
      totalRequests: 0,
    },
    {
      id: 'USR-004',
      name: 'Diana Prince',
      email: 'diana.p@example.com',
      role: 'User',
      lastActive: '2025-09-10',
      inactiveDays: 182,
      totalRequests: 5,
    },
    {
      id: 'REC-005',
      name: 'Edward Norton',
      email: 'edward.n@example.com',
      role: 'Recycler',
      lastActive: '2025-11-30',
      inactiveDays: 101,
      totalRequests: 0,
    },
  ]);

  const filteredUsers = inactiveUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (user: InactiveUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setInactiveUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      alert(`User ${selectedUser.name} has been deleted successfully.`);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'User':
        return 'bg-blue-50 text-blue-700';
      case 'Collector':
        return 'bg-yellow-50 text-yellow-700';
      case 'Recycler':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInactivityColor = (days: number) => {
    if (days >= 180) return 'text-red-600';
    if (days >= 120) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <Layout userType="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Manage inactive users and system settings</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inactive Users</p>
                <h3 className="text-foreground mb-1">{inactiveUsers.length}</h3>
                <p className="text-sm text-yellow-600">90+ days inactive</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Critical Inactive</p>
                <h3 className="text-foreground mb-1">
                  {inactiveUsers.filter(u => u.inactiveDays >= 180).length}
                </h3>
                <p className="text-sm text-red-600">180+ days inactive</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Zero Activity</p>
                <h3 className="text-foreground mb-1">
                  {inactiveUsers.filter(u => u.totalRequests === 0).length}
                </h3>
                <p className="text-sm text-muted-foreground">No requests made</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Inactive Users Table */}
        <Card className="border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground">Inactive Users</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Users who haven't logged in for 90+ days
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Inactive Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Total Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      No inactive users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary">{user.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-foreground">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-muted-foreground">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${getInactivityColor(user.inactiveDays)}`}>
                          {user.inactiveDays} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-muted-foreground">
                        {user.totalRequests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user account for{' '}
                <span className="font-semibold">{selectedUser?.name}</span> ({selectedUser?.email}).
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
