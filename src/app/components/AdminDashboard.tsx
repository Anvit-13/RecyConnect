import { Layout } from './Layout';
import { Users, Package, Truck, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+124',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Requests',
      value: '87',
      change: '+12',
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Total Collectors',
      value: '18',
      change: '+2',
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed Requests',
      value: '3,456',
      change: '+234',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const monthlyRequests = [
    { month: 'Jan', requests: 245, completed: 198, pending: 47 },
    { month: 'Feb', requests: 298, completed: 256, pending: 42 },
    { month: 'Mar', requests: 352, completed: 301, pending: 51 },
    { month: 'Apr', requests: 412, completed: 365, pending: 47 },
    { month: 'May', requests: 385, completed: 342, pending: 43 },
    { month: 'Jun', requests: 438, completed: 398, pending: 40 },
  ];

  const deviceTypes = [
    { name: 'Laptops', value: 342, color: '#10b981' },
    { name: 'Smartphones', value: 528, color: '#14b8a6' },
    { name: 'Desktops', value: 215, color: '#059669' },
    { name: 'Monitors', value: 186, color: '#0d9488' },
    { name: 'Tablets', value: 124, color: '#6ee7b7' },
    { name: 'Other', value: 98, color: '#a7f3d0' },
  ];

  const recyclingStats = [
    { category: 'Copper', weight: 245.8, color: '#eab308' },
    { category: 'Aluminum', weight: 582.4, color: '#94a3b8' },
    { category: 'Plastic', weight: 1428.6, color: '#3b82f6' },
    { category: 'Gold', weight: 1.564, color: '#f59e0b' },
  ];

  return (
    <Layout userType="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the entire e-waste management system</p>
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
                    <p className={`text-sm ${stat.color}`}>{stat.change} this month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Pickup Requests Trend */}
          <Card className="border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Pickup Requests Trend</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRequests}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} name="Total Requests" />
                  <Line type="monotone" dataKey="completed" stroke="#14b8a6" strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Device Types Distribution */}
          <Card className="border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Device Types Distribution</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceTypes.map((entry, index) => (
                      <Cell key={`device-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recycling Statistics */}
        <Card className="border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Recycling Statistics (Total Weight in kg)</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recyclingStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="weight" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {recyclingStats.map((entry, index) => (
                    <Cell key={`recycling-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-border shadow-sm mt-6">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">System Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Active Pickups Today</span>
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl text-foreground">24</p>
                <p className="text-sm text-muted-foreground mt-1">Across 8 collectors</p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Completed This Week</span>
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl text-foreground">156</p>
                <p className="text-sm text-muted-foreground mt-1">+23% from last week</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Avg. Processing Time</span>
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl text-foreground">2.4 days</p>
                <p className="text-sm text-muted-foreground mt-1">-0.3 days improvement</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}