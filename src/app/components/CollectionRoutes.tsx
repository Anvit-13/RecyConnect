import { Layout } from './Layout';
import { MapPin, Navigation, Clock, Package, Phone, User, Filter, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export function CollectionRoutes() {
  const routes = [
    {
      id: 'ROUTE-001',
      date: 'March 6, 2026',
      status: 'Active',
      pickups: 12,
      completed: 4,
      distance: '45 km',
      estimatedTime: '4h 30m',
      locations: [
        { id: 'REQ-2024-123', user: 'Sarah Johnson', address: '456 Oak Ave', phone: '(555) 123-4567', devices: 3, status: 'Next', time: '09:00 AM' },
        { id: 'REQ-2024-124', user: 'Michael Chen', address: '789 Pine St', phone: '(555) 234-5678', devices: 2, status: 'Scheduled', time: '10:30 AM' },
        { id: 'REQ-2024-125', user: 'Emily Davis', address: '321 Maple Dr', phone: '(555) 345-6789', devices: 1, status: 'Scheduled', time: '01:00 PM' },
        { id: 'REQ-2024-126', user: 'Robert Wilson', address: '654 Cedar Ln', phone: '(555) 456-7890', devices: 4, status: 'Scheduled', time: '03:30 PM' },
      ]
    },
    {
      id: 'ROUTE-002',
      date: 'March 7, 2026',
      status: 'Planned',
      pickups: 10,
      completed: 0,
      distance: '38 km',
      estimatedTime: '3h 45m',
      locations: [
        { id: 'REQ-2024-127', user: 'Lisa Anderson', address: '147 Birch Ave', phone: '(555) 567-8901', devices: 2, status: 'Scheduled', time: '09:30 AM' },
        { id: 'REQ-2024-128', user: 'James Taylor', address: '258 Elm St', phone: '(555) 678-9012', devices: 3, status: 'Scheduled', time: '11:00 AM' },
        { id: 'REQ-2024-129', user: 'Maria Garcia', address: '369 Spruce Dr', phone: '(555) 789-0123', devices: 1, status: 'Scheduled', time: '02:00 PM' },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary text-primary-foreground';
      case 'Planned':
        return 'bg-blue-50 text-blue-700';
      case 'Next':
        return 'bg-primary/10 text-primary';
      case 'Scheduled':
        return 'bg-muted text-muted-foreground';
      case 'Completed':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout userType="collector">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Collection Routes</h1>
          <p className="text-muted-foreground">Plan and manage your collection routes</p>
        </div>

        {/* Filters and Search */}
        <Card className="border border-border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search routes or locations..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Navigation className="w-4 h-4 mr-2" />
                Optimize Route
              </Button>
            </div>
          </div>
        </Card>

        {/* Routes */}
        <div className="space-y-6">
          {routes.map((route) => (
            <Card key={route.id} className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-foreground">{route.id}</h3>
                      <Badge className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{route.date}</p>
                  </div>
                  {route.status === 'Active' && (
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                  )}
                  {route.status === 'Planned' && (
                    <Button variant="outline" className="border-border">
                      Start Route
                    </Button>
                  )}
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Pickups</p>
                    <p className="text-foreground">
                      {route.completed}/{route.pickups}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Distance</p>
                    <p className="text-foreground">{route.distance}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Est. Time</p>
                    <p className="text-foreground">{route.estimatedTime}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                    <p className="text-foreground">
                      {Math.round((route.completed / route.pickups) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Route Locations */}
              <div className="p-6">
                <h4 className="text-foreground mb-4">Pickup Locations</h4>
                <div className="space-y-3">
                  {route.locations.map((location, index) => (
                    <div 
                      key={location.id} 
                      className={`p-4 rounded-lg border transition-colors ${
                        location.status === 'Next' 
                          ? 'bg-primary/5 border-primary' 
                          : 'bg-muted/30 border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          location.status === 'Next' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-foreground mb-1">{location.user}</p>
                              <p className="text-sm text-primary">{location.id}</p>
                            </div>
                            <Badge className={getStatusColor(location.status)}>
                              {location.status}
                            </Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{location.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{location.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{location.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 flex-shrink-0" />
                              <span>{location.devices} devices</span>
                            </div>
                          </div>
                          {location.status === 'Next' && (
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Navigation className="w-3 h-3 mr-2" />
                                Navigate
                              </Button>
                              <Button size="sm" variant="outline" className="border-border">
                                <Phone className="w-3 h-3 mr-2" />
                                Call Customer
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
