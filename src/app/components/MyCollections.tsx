import { Layout } from './Layout';
import { Package, Calendar, MapPin, CheckCircle2, Clock, Search, Filter, Eye, Smartphone, Laptop, Monitor, Printer, Tablet, HardDrive } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function MyCollections() {
  const collections = [
    {
      id: 'REQ-2024-120',
      user: 'David Martinez',
      address: '852 Willow Street, San Francisco',
      date: 'March 6, 2026',
      time: '08:45 AM',
      devices: [
        { type: 'Laptop', brand: 'Dell', model: 'XPS 15', icon: Laptop },
        { type: 'Monitor', brand: 'Samsung', model: '27" LED', icon: Monitor },
      ],
      weight: '12.5 kg',
      status: 'Completed',
      notes: 'Customer very satisfied. All items in good condition.'
    },
    {
      id: 'REQ-2024-119',
      user: 'Jennifer Lee',
      address: '963 Redwood Avenue, San Francisco',
      date: 'March 6, 2026',
      time: '08:15 AM',
      devices: [
        { type: 'Smartphone', brand: 'iPhone', model: '11 Pro', icon: Smartphone },
        { type: 'Tablet', brand: 'iPad', model: 'Air 3', icon: Tablet },
      ],
      weight: '1.8 kg',
      status: 'Completed',
      notes: 'Quick pickup, no issues.'
    },
    {
      id: 'REQ-2024-118',
      user: 'Christopher Brown',
      address: '741 Sequoia Drive, San Francisco',
      date: 'March 5, 2026',
      time: '03:30 PM',
      devices: [
        { type: 'Desktop PC', brand: 'HP', model: 'Pavilion', icon: HardDrive },
        { type: 'Printer', brand: 'Canon', model: 'Pixma', icon: Printer },
        { type: 'Monitor', brand: 'LG', model: '24" LCD', icon: Monitor },
      ],
      weight: '18.3 kg',
      status: 'Completed',
      notes: 'Heavy items. Required assistance.'
    },
    {
      id: 'REQ-2024-117',
      user: 'Amanda Thompson',
      address: '159 Cypress Lane, San Francisco',
      date: 'March 5, 2026',
      time: '01:00 PM',
      devices: [
        { type: 'Laptop', brand: 'MacBook', model: 'Pro 13"', icon: Laptop },
      ],
      weight: '1.4 kg',
      status: 'Completed',
      notes: 'Easy pickup at office reception.'
    },
    {
      id: 'REQ-2024-116',
      user: 'Kevin Harris',
      address: '357 Sycamore Street, San Francisco',
      date: 'March 5, 2026',
      time: '10:30 AM',
      devices: [
        { type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad', icon: Laptop },
        { type: 'Smartphone', brand: 'Samsung', model: 'Galaxy S10', icon: Smartphone },
      ],
      weight: '2.2 kg',
      status: 'Completed',
      notes: 'Customer requested receipt.'
    },
  ];

  const stats = {
    total: 156,
    thisWeek: 45,
    thisMonth: 183,
    totalWeight: '2,458 kg'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/10 text-primary';
      case 'In Progress':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout userType="collector">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">My Collections</h1>
          <p className="text-muted-foreground">View your collection history and details</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Collections</p>
                <h3 className="text-foreground">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <h3 className="text-foreground">{stats.thisWeek}</h3>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <h3 className="text-foreground">{stats.thisMonth}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Weight</p>
                <h3 className="text-foreground">{stats.totalWeight}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by request ID, customer, or address..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Collections List */}
        <div className="space-y-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-primary">{collection.id}</h3>
                      <Badge className={getStatusColor(collection.status)}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {collection.status}
                      </Badge>
                    </div>
                    <p className="text-foreground mb-1">{collection.user}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{collection.address}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Collection Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{collection.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{collection.time}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Collection Weight</p>
                      <p className="text-foreground">{collection.weight}</p>
                    </div>
                    {collection.notes && (
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground">{collection.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Devices */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Collected Devices</p>
                    <div className="space-y-2">
                      {collection.devices.map((device, idx) => {
                        const Icon = device.icon;
                        return (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-foreground">{device.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {device.brand} {device.model}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" className="border-border" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="border-border bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            2
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            3
          </Button>
          <Button variant="outline" size="sm" className="border-border">
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
