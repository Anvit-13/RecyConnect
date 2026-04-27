import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Users, Package, Truck, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminService from '../../services/adminService';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    monthlyRequests: any[];
    deviceTypes: any[];
    recyclingStats: any[];
  }>({
    stats: {},
    monthlyRequests: [],
    deviceTypes: [],
    recyclingStats: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setData(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load dashboard analytics';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
       <Layout userType="admin">
         <div className="p-8 text-center text-muted-foreground">Loading admin dashboard...</div>
       </Layout>
     );
  }

  const stats = [
    {
      title: 'Total Users',
      value: data.stats.total_users || '0',
      change: 'Lifetime',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Requests',
      value: data.stats.pending_requests || '0',
      change: 'Pending',
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Total Collectors',
      value: data.stats.total_collectors || '0',
      change: 'Active',
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed Requests',
      value: data.stats.completed_requests || '0',
      change: 'Lifetime',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
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
              <Card key={stat.title} className="p-6 border border-border shadow-sm hover:shadow-md transition-shadow bg-card">
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

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Pickup Requests Trend */}
          <Card className="border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Pickup Requests Trend (6 Months)</h3>
            </div>
            <div className="p-6">
              {data.monthlyRequests.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyRequests}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        color: 'var(--card-foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} name="Total Requests" />
                    <Line type="monotone" dataKey="completed" stroke="#14b8a6" strokeWidth={2} name="Completed" />
                    <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} name="Pending" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">Not enough data to display trends.</div>
              )}
            </div>
          </Card>

          {/* Device Types Distribution */}
          <Card className="border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Device Types Distribution</h3>
            </div>
            <div className="p-6">
              {data.deviceTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.deviceTypes.map((entry, index) => (
                        <Cell key={`device-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                         backgroundColor: 'var(--card)', 
                         color: 'var(--card-foreground)',
                         border: '1px solid var(--border)',
                         borderRadius: '6px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">No devices have been collected yet.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Recycling Statistics */}
        <Card className="border border-border shadow-sm bg-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Recycling Statistics (Total Weight in kg)</h3>
          </div>
          <div className="p-6">
            {data.recyclingStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.recyclingStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      color: 'var(--card-foreground)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="weight" fill="#10b981" radius={[8, 8, 0, 0]}>
                    {data.recyclingStats.map((entry, index) => (
                      <Cell key={`recycling-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No materials have been completely recycled and recorded yet.</div>
            )}
          </div>
        </Card>

        {/* System Overview */}
        <Card className="border border-border shadow-sm mt-6 bg-card">
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
                <p className="text-2xl font-bold text-foreground">{data.stats.pending_requests || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending distribution</p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Completed Globally</span>
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{data.stats.completed_requests || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Total lifetime completed requests</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Est. Value Realized</span>
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">₹{parseFloat(data.stats.total_value_recycled || 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">From completed recycling pools</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}