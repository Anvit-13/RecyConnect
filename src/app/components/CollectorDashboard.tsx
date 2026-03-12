import { Layout } from './Layout';
import { Truck, Package, CheckCircle2, Clock, MapPin, Navigation, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from './ui/button';

export function CollectorDashboard() {
  const stats = [
    {
      title: 'Today\'s Collections',
      value: '12',
      change: '+3 from yesterday',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Pickups',
      value: '8',
      change: '4 urgent',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed This Week',
      value: '45',
      change: '+12%',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Distance',
      value: '156 km',
      change: 'This week',
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const todayRoute = [
    { 
      id: 'REQ-2024-123', 
      user: 'Sarah Johnson', 
      address: '456 Oak Avenue, San Francisco', 
      time: '09:00 AM', 
      status: 'Next',
      devices: 3,
      priority: 'High'
    },
    { 
      id: 'REQ-2024-124', 
      user: 'Michael Chen', 
      address: '789 Pine Street, San Francisco', 
      time: '10:30 AM', 
      status: 'Scheduled',
      devices: 2,
      priority: 'Medium'
    },
    { 
      id: 'REQ-2024-125', 
      user: 'Emily Davis', 
      address: '321 Maple Drive, San Francisco', 
      time: '01:00 PM', 
      status: 'Scheduled',
      devices: 1,
      priority: 'Low'
    },
    { 
      id: 'REQ-2024-126', 
      user: 'Robert Wilson', 
      address: '654 Cedar Lane, San Francisco', 
      time: '03:30 PM', 
      status: 'Scheduled',
      devices: 4,
      priority: 'High'
    },
  ];

  const weeklyData = [
    { day: 'Mon', collections: 8, distance: 25 },
    { day: 'Tue', collections: 12, distance: 32 },
    { day: 'Wed', collections: 10, distance: 28 },
    { day: 'Thu', collections: 15, distance: 38 },
    { day: 'Fri', collections: 10, distance: 30 },
    { day: 'Sat', collections: 6, distance: 18 },
    { day: 'Sun', collections: 3, distance: 12 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Next':
        return 'bg-primary text-primary-foreground';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout userType="collector">
      <div className="p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-foreground mb-2">Collector Dashboard</h1>
            <p className="text-muted-foreground">Manage your collection routes and pickups</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Navigation className="w-4 h-4 mr-2" />
            Start Navigation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-foreground mb-1">{stat.value}</h3>
                    <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Route */}
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Collection Route
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {todayRoute.map((pickup, index) => (
                    <div key={pickup.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-l-primary">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-primary mb-1">{pickup.id}</p>
                            <p className="text-foreground">{pickup.user}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getPriorityColor(pickup.priority)}`}>
                            {pickup.priority}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(pickup.status)}`}>
                            {pickup.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{pickup.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 ml-11">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{pickup.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{pickup.devices} devices</span>
                        </div>
                      </div>
                      {pickup.status === 'Next' && (
                        <div className="mt-3 ml-11">
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Navigation className="w-3 h-3 mr-2" />
                            Navigate to Location
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Today's Progress */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Today's Progress</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-sm font-medium text-foreground">4 of 12</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Distance Covered</span>
                    <span className="text-sm font-medium text-foreground">42 km</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Completion</span>
                    <span className="text-sm font-medium text-primary">4:30 PM</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Completed pickup</p>
                      <p className="text-xs text-muted-foreground">REQ-2024-120 - 8:45 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Completed pickup</p>
                      <p className="text-xs text-muted-foreground">REQ-2024-119 - 8:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">Started route</p>
                      <p className="text-xs text-muted-foreground">Today at 7:30 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Weekly Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Weekly Collections</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="collections" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Distance Traveled (km)</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="distance" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
