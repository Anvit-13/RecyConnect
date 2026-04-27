import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { MapPin, Navigation, Package, CheckCircle2, Truck, Clock, X, ExternalLink, Map } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import collectorService from '../../services/collectorService';
import pickupService from '../../services/pickupService';
import { toast } from 'sonner';

export function CollectorDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    todayRoute: any[];
    weeklyData: any[];
  }>({
    stats: {},
    todayRoute: [],
    weeklyData: []
  });

  // Detail modal state
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [stopDetail, setStopDetail] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await collectorService.getDashboardStats();
      setData(response.data);
    } catch (error: any) {
       const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load collector dashboard';
       toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await pickupService.updatePickupStatus(id, { status: newStatus });
      toast.success(`Request marked as ${newStatus}`);
      fetchDashboard();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = async (stop: any) => {
    setSelectedStop(stop);
    setStopDetail(null);
    setDetailLoading(true);
    try {
      const response = await pickupService.getPickupRequestById(stop.id);
      setStopDetail(response.data.pickupRequest);
    } catch (error: any) {
      // Fall back to the basic stop info from dashboard if detail fetch fails
      setStopDetail(stop);
      toast.error('Could not load full details — showing basic info.');
    } finally {
      setDetailLoading(false);
    }
  };

  const openGoogleMaps = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=driving`, '_blank');
  };

  if (loading) {
     return (
       <Layout userType="collector">
         <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
       </Layout>
     );
  }

  const stats = [
    {
      title: "Today's Pickups",
      value: data.stats?.todays_pickups || '0',
      change: 'Scheduled',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Completed Today',
      value: data.stats?.completed_today || '0',
      change: 'Success',
      icon: CheckCircle2,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Active Route',
      value: (data.todayRoute?.filter(r => r.status === 'in-progress').length > 0) ? 'In Progress' : 'Pending',
      change: `Next Stop: ${data.todayRoute?.[0]?.address?.substring(0, 15) || 'None'}`,
      icon: Navigation,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Devices Collected',
      value: data.stats?.devices_collected || '0',
      change: 'This week',
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in-progress':
      case 'in progress':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'collected':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Layout userType="collector">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Collector Dashboard</h1>
          <p className="text-muted-foreground">Manage your daily routes and track collection metrics</p>
        </div>

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Route */}
          <Card className="lg:col-span-2 border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Today's Active Route
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {data.todayRoute.length === 0 ? (
                 <div className="text-center text-muted-foreground py-10">No active stops found for today.</div>
              ) : (
                <div className="relative border-l-2 border-border ml-3 pl-6 space-y-8">
                  {data.todayRoute.map((stop, index) => (
                    <div key={stop.id} className="relative">
                      <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-2 bg-card ${
                        stop.status === 'completed' ? 'border-primary ring-4 ring-primary/20' :
                        stop.status === 'in-progress' ? 'border-secondary ring-4 ring-secondary/20' :
                        'border-muted-foreground'
                      }`}></div>
                      
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">Stop {index + 1}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(stop.status)}`}>
                                {stop.status}
                              </span>
                            </div>
                            <p className="text-sm text-foreground flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-1 text-muted-foreground shrink-0" />
                              {stop.address}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium text-foreground mb-1">
                              {stop.estimatedTime ? new Date(stop.estimatedTime).toLocaleDateString() : 'Pending'}
                            </p>
                            <p className="text-xs text-muted-foreground">{stop.device_count || 0} Devices</p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                          {stop.status === 'scheduled' && (
                            <Button size="sm" onClick={() => handleStatusUpdate(stop.id, 'in-progress')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                              Start Pickup
                            </Button>
                          )}
                          {stop.status === 'in-progress' && (
                            <Button size="sm" onClick={() => handleStatusUpdate(stop.id, 'collected')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Collect Pickup
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(stop)}
                            className="border-border"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openGoogleMaps(stop.address)}
                            className="border-border text-blue-600 hover:text-blue-700 hover:border-blue-300"
                          >
                            <Map className="w-3.5 h-3.5 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Weekly Performance */}
          <Card className="border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Weekly Performance
              </h3>
            </div>
            <div className="p-6">
              {data.weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" tickFormatter={(t) => t.substring(5, 10)} />
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
                    <Bar dataKey="count" fill="#10b981" name="Completed Pickups" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">No tracking info available this week.</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Pickup Detail Modal */}
      <Dialog open={!!selectedStop} onOpenChange={(open) => { if (!open) setSelectedStop(null); }}>
        <DialogContent className="sm:max-w-[560px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Pickup Details
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="py-10 text-center text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading details...
            </div>
          ) : stopDetail ? (
            <div className="space-y-5 py-2">

              {/* ID & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">#{(stopDetail.id || '').substring(0, 12)}...</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  stopDetail.status === 'in-progress' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                  stopDetail.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {stopDetail.status}
                </span>
              </div>

              {/* Address + Maps Button */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup Address</p>
                <p className="text-foreground flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  {stopDetail.address || 'N/A'}
                </p>
                {stopDetail.address && (
                  <Button
                    size="sm"
                    onClick={() => openGoogleMaps(stopDetail.address)}
                    className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Open in Google Maps
                    <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-70" />
                  </Button>
                )}
              </div>

              {/* Pickup Date & User */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pickup Date</p>
                  <p className="text-foreground text-sm">
                    {stopDetail.pickup_date ? new Date(stopDetail.pickup_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-foreground text-sm">{stopDetail.user_name || 'N/A'}</p>
                </div>
              </div>

              {/* Devices */}
              {stopDetail.devices && stopDetail.devices.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Devices to Collect</p>
                  <div className="space-y-2">
                    {stopDetail.devices.map((device: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-muted/30 rounded-lg p-3 border border-border/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {device.brand} {device.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {device.device_type || device.deviceType} · {device.condition}
                          </p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Qty: {device.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Value */}
              {stopDetail.total_estimated_value && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Total Estimated Value</span>
                  <span className="text-foreground font-semibold">₹{parseFloat(stopDetail.total_estimated_value).toFixed(2)}</span>
                </div>
              )}

              {/* Notes */}
              {stopDetail.notes && (
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-foreground">{stopDetail.notes}</p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
