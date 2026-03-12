import { Layout } from './Layout';
import { PackagePlus, Package, CheckCircle2, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';

export function UserDashboard() {
  const stats = [
    {
      title: 'Total Requests',
      value: '24',
      change: '+12%',
      icon: PackagePlus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Pending Pickups',
      value: '5',
      change: '+2',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: '19',
      change: '+8%',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Recycled Weight',
      value: '124 kg',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const recentActivities = [
    { id: 'REQ-2024-089', device: 'Laptop, Smartphone', status: 'Completed', date: '2026-03-03', recycler: 'GreenTech Recyclers' },
    { id: 'REQ-2024-088', device: 'Desktop PC, Monitor', status: 'In Progress', date: '2026-03-04', recycler: 'EcoWaste Solutions' },
    { id: 'REQ-2024-087', device: 'Tablet, Keyboard', status: 'Pending', date: '2026-03-05', recycler: 'Not Assigned' },
    { id: 'REQ-2024-086', device: 'Smartphone, Chargers', status: 'Scheduled', date: '2026-03-06', recycler: 'GreenTech Recyclers' },
    { id: 'REQ-2024-085', device: 'Gaming Console', status: 'Completed', date: '2026-03-01', recycler: 'TechRecycle Pro' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/10 text-primary';
      case 'In Progress':
        return 'bg-secondary/10 text-secondary';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's an overview of your e-waste recycling activities</p>
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
                    <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground">Recent Pickup Requests</h3>
                <p className="text-sm text-muted-foreground mt-1">Track your latest e-waste submissions</p>
              </div>
              <a href="/my-requests" className="text-primary hover:text-primary/80 text-sm">
                View All
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">Devices</th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">Recycler</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary">{activity.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground">{activity.device}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{activity.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {activity.recycler}
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
