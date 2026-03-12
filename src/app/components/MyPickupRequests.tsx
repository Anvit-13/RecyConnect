import { Layout } from './Layout';
import { Eye, XCircle, Calendar, MapPin, Package } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';

export function MyPickupRequests() {
  const requests = [
    {
      id: 'REQ-2024-089',
      devices: ['Laptop Dell XPS 13', 'Smartphone Samsung Galaxy S20'],
      status: 'Completed',
      date: '2026-03-03',
      recycler: 'GreenTech Recyclers',
      address: '123 Main St, San Francisco, CA',
    },
    {
      id: 'REQ-2024-088',
      devices: ['Desktop PC HP Pavilion', 'Monitor LG 27"'],
      status: 'In Progress',
      date: '2026-03-04',
      recycler: 'EcoWaste Solutions',
      address: '456 Oak Ave, San Francisco, CA',
    },
    {
      id: 'REQ-2024-087',
      devices: ['Tablet iPad Air', 'Keyboard Apple Magic'],
      status: 'Pending',
      date: '2026-03-05',
      recycler: 'Not Assigned',
      address: '789 Pine St, San Francisco, CA',
    },
    {
      id: 'REQ-2024-086',
      devices: ['Smartphone iPhone 11', 'Chargers (3x)'],
      status: 'Scheduled',
      date: '2026-03-06',
      recycler: 'GreenTech Recyclers',
      address: '321 Elm St, San Francisco, CA',
    },
    {
      id: 'REQ-2024-085',
      devices: ['Gaming Console PS4', 'Controllers (2x)'],
      status: 'Completed',
      date: '2026-03-01',
      recycler: 'TechRecycle Pro',
      address: '654 Maple Dr, San Francisco, CA',
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
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2">My Pickup Requests</h1>
            <p className="text-muted-foreground">View and manage all your e-waste pickup requests</p>
          </div>
          <Link to="/submit-pickup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Package className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        <Card className="border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Devices</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Recycler</th>
                  <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary">{request.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {request.devices.map((device, idx) => (
                          <span key={idx} className="text-foreground text-sm">{device}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{request.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-foreground">{request.recycler}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link to={`/request-details/${request.id}`}>
                          <Button variant="outline" size="sm" className="text-primary hover:text-primary/80">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {request.status === 'Pending' && (
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/80">
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
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
