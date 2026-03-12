import { Layout } from './Layout';
import { Truck, Calendar, MapPin, User, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function PickupAssignmentManagement() {
  const assignments = [
    {
      id: 'REQ-2024-089',
      user: { name: 'John Doe', phone: '+1 (555) 123-4567' },
      address: '123 Main St, San Francisco, CA 94102',
      pickupDate: '2026-03-06',
      vehicleId: 'VEH-042',
      devices: 2,
      status: 'Scheduled',
    },
    {
      id: 'REQ-2024-090',
      user: { name: 'Jane Smith', phone: '+1 (555) 234-5678' },
      address: '456 Oak Ave, San Francisco, CA 94103',
      pickupDate: '2026-03-06',
      vehicleId: 'VEH-042',
      devices: 3,
      status: 'In Progress',
    },
    {
      id: 'REQ-2024-091',
      user: { name: 'Bob Wilson', phone: '+1 (555) 345-6789' },
      address: '789 Pine St, San Francisco, CA 94104',
      pickupDate: '2026-03-07',
      vehicleId: 'VEH-043',
      devices: 1,
      status: 'Scheduled',
    },
    {
      id: 'REQ-2024-092',
      user: { name: 'Alice Brown', phone: '+1 (555) 456-7890' },
      address: '321 Elm St, San Francisco, CA 94105',
      pickupDate: '2026-03-07',
      vehicleId: 'VEH-043',
      devices: 4,
      status: 'Pending',
    },
    {
      id: 'REQ-2024-093',
      user: { name: 'Charlie Davis', phone: '+1 (555) 567-8901' },
      address: '654 Maple Dr, San Francisco, CA 94106',
      pickupDate: '2026-03-08',
      vehicleId: 'VEH-044',
      devices: 2,
      status: 'Scheduled',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'In Progress':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Layout userType="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Pickup Assignment Management</h1>
          <p className="text-muted-foreground">Manage and assign pickups to collectors</p>
        </div>

        <Card className="border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Pickup ID</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Devices</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary">{assignment.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{assignment.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{assignment.user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-muted-foreground max-w-xs">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{assignment.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{assignment.pickupDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-foreground">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>{assignment.vehicleId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{assignment.devices}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {assignment.status === 'Scheduled' && (
                          <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                            Start
                          </Button>
                        )}
                        {assignment.status === 'In Progress' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Complete
                          </Button>
                        )}
                        {assignment.status === 'Pending' && (
                          <Button size="sm" variant="outline" className="text-primary">
                            Assign
                          </Button>
                        )}
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