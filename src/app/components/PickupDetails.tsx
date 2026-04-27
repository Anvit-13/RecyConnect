import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { ArrowLeft, Package, User, MapPin, Calendar, Truck, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link, useParams } from 'react-router';
import pickupService from '../../services/pickupService';
import { toast } from 'sonner';

export function PickupDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRequestDetails(id);
    }
  }, [id]);

  const fetchRequestDetails = async (requestId: string) => {
    try {
      const response = await pickupService.getPickupRequestById(requestId);
      setRequest(response.data.pickupRequest);
    } catch (error: any) {
      toast.error('Failed to load request details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout userType="user">
        <div className="p-8 text-center text-muted-foreground">Loading details...</div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout userType="user">
        <div className="p-8 text-center text-muted-foreground">Request not found.</div>
      </Layout>
    );
  }

  // Generate dynamic timeline based on status and dates
  const statuses = ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'];
  const currentStatusIndex = statuses.indexOf(request.status || 'pending');
  
  const timeline = [
    { 
      label: 'Request Submitted', 
      date: new Date(request.created_at).toLocaleString(), 
      completed: true 
    },
    { 
      label: 'Recycler Assigned', 
      date: request.collector_id ? 'Assigned' : 'Pending', 
      completed: !!request.collector_id || currentStatusIndex >= 1 
    },
    { 
      label: 'Pickup Scheduled', 
      date: currentStatusIndex >= 1 ? new Date(request.pickup_date || request.pickupDate).toLocaleDateString() : 'Pending', 
      completed: currentStatusIndex >= 1 
    },
    { 
      label: 'Pickup in Progress', 
      date: currentStatusIndex >= 2 ? 'In Progress' : 'Pending', 
      completed: currentStatusIndex >= 2 
    },
    { 
      label: 'Processing', 
      date: currentStatusIndex >= 3 ? 'Processing' : 'Pending', 
      completed: currentStatusIndex >= 3 && request.status !== 'completed' 
    },
    { 
      label: 'Completed', 
      date: request.updated_at ? new Date(request.updated_at).toLocaleString() : 'Pending', 
      completed: request.status === 'completed' 
    },
  ];

  if (request.status === 'cancelled') {
    timeline.push({
      label: 'Cancelled',
      date: request.updated_at ? new Date(request.updated_at).toLocaleString() : 'Cancelled',
      completed: true
    });
  }

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8">
          <Link to="/my-requests">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2">Request Details</h1>
              <p className="text-muted-foreground">Request ID: <span className="font-mono">{request.id}</span></p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm capitalize ${
               request.status === 'completed' ? 'bg-primary/10 text-primary border border-primary/20' :
               request.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
               'bg-secondary/10 text-secondary border border-secondary/20'
            }`}>
              {request.status?.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Information */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Device Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {request.devices?.map((device: any, idx: number) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Type</p>
                          <p className="text-foreground font-medium capitalize">{device.device_type}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Brand</p>
                          <p className="text-foreground">{device.brand}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Model</p>
                          <p className="text-foreground">{device.model}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Condition</p>
                          <p className="text-foreground capitalize">{device.condition?.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Qty</p>
                          <p className="text-foreground">{device.quantity}</p>
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground text-sm italic">No devices found.</p>}
                  
                  <div className="mt-4 flex justify-end">
                    <p className="text-sm font-medium text-muted-foreground">Total Estimated Value: <span className="text-foreground text-lg ml-2">${parseFloat(request.total_estimated_value || 0).toFixed(2)}</span></p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Timeline */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Status Timeline</h3>
              </div>
              <div className="p-6">
                <div className="relative">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                          item.completed 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-card border-muted-foreground/30 text-muted-foreground/30'
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                          )}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div className={`w-0.5 h-full mt-2 ${
                            item.completed ? 'bg-primary/50' : 'bg-border'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  User Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Name</p>
                  <p className="text-foreground">{request.user_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Email</p>
                  <p className="text-foreground">{request.user_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Phone</p>
                  <p className="text-foreground">{request.user_phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    Pickup Address
                  </p>
                  <p className="text-foreground">{request.address}</p>
                </div>
              </div>
            </Card>

            {/* Recycler Assignment */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Recycler Assignment
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Company/Recycler</p>
                  <p className="text-foreground">{request.recycler_name || 'Not yet assigned'}</p>
                </div>
                {request.collector_name && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Collector</p>
                    <p className="text-foreground">{request.collector_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    Pickup Date
                  </p>
                  <p className="text-foreground">{new Date(request.pickup_date || request.pickupDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
