import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { PackagePlus, Package, CheckCircle2, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';
import pickupService, { PickupRequest } from '../../services/pickupService';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Leaf } from 'lucide-react';

export function UserDashboard() {
  const { user, updateUser } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      // Refresh user profile to get latest eco-points
      const profileRes = await authService.getProfile();
      if (profileRes.success) {
        updateUser(profileRes.data.user);
      }

      const response = await pickupService.getUserPickupRequests();
      setRequests(response.data.pickupRequests || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load dashboard data';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalRequests = requests.length;
  const activeRequests = requests.filter(r => ['pending', 'scheduled', 'in-progress'].includes(r.status || '')).length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  
  const totalValue = requests.reduce((acc, r) => {
    const val = parseFloat(r.total_estimated_value?.toString() || '0');
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const recentActivities = [...requests].sort((a, b) => {
    const dateA = new Date(a.created_at || a.pickup_date || a.pickupDate || 0).getTime();
    const dateB = new Date(b.created_at || b.pickup_date || b.pickupDate || 0).getTime();
    return dateB - dateA;
  }).slice(0, 5);

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests.toString(),
      change: 'Lifetime',
      icon: PackagePlus,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Pickups',
      value: activeRequests.toString(),
      change: 'In Progress',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Eco-Points Earned',
      value: (user?.eco_points || 0).toLocaleString(),
      change: 'Lifetime Rewards',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Est. Total Value',
      value: `₹${totalValue.toFixed(2)}`,
      change: 'Lifetime',
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];


  const getStatusColor = (status: string | undefined) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Here's an overview of your e-waste recycling activities</p>
          </div>
          <Link to="/submit-pickup">
             <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
               <PackagePlus className="w-4 h-4 mr-2" />
               New Request
             </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4 opacity-20" />
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="p-6 border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <h3 className="text-foreground mb-1 font-bold">{stat.value}</h3>
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

            {/* Recent Activity */}
            <Card className="border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground font-semibold">Recent Pickup Requests</h3>
                    <p className="text-sm text-muted-foreground mt-1">Track your latest e-waste submissions</p>
                  </div>
                  <Link to="/my-requests" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devices</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recycler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivities.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                           <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                           <p>No recent activity found. Start recycling today!</p>
                         </td>
                       </tr>
                    ) : recentActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-primary font-medium">#{activity.id?.substring(0, 8)}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                             {activity.devices && activity.devices.length > 0 ? (
                               activity.devices.slice(0, 2).map((device: any, idx: number) => (
                                 <span key={idx} className="text-foreground text-sm">
                                   {device.brand} {device.model}
                                 </span>
                               ))
                             ) : (
                               <span className="text-muted-foreground text-sm">
                                 {Number(activity.device_count) || 0} device(s)
                               </span>
                             )}
                             {activity.devices && activity.devices.length > 2 && (
                               <span className="text-xs text-muted-foreground">+{activity.devices.length - 2} more</span>
                             )}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status || 'pending')}`}>
                            {(activity.status || 'pending').charAt(0).toUpperCase() + (activity.status || 'pending').slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{activity.pickup_date || activity.pickupDate ? new Date(activity.pickup_date || activity.pickupDate!).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                          {activity.recycler_name || 'Not Assigned'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
