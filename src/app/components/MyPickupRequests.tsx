import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Eye, XCircle, Calendar, Package, Receipt } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';
import pickupService, { PickupRequest } from '../../services/pickupService';
import { toast } from 'sonner';
import { ReceiptModal } from './ReceiptModal';

export function MyPickupRequests() {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptRequestId, setReceiptRequestId] = useState<string | null>(null);

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    try {
      const response = await pickupService.getUserPickupRequests();
      setRequests(response.data.pickupRequests || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch pickup requests';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    try {
      await pickupService.updatePickupStatus(id, { status: 'cancelled' });
      toast.success('Pickup request cancelled successfully');
      fetchPickupRequests();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to cancel request';
      toast.error(errorMessage);
    }
  };

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
    <>
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

        <Card className="border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devices</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recycler</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      Loading pickup requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p>No pickup requests found. Create your first request!</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary font-medium">#{request.id?.substring(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {request.devices && request.devices.length > 0 ? (
                            request.devices.map((device, idx) => (
                              <span key={idx} className="text-foreground text-sm">
                                {device.brand} {device.model} ({device.device_type || device.deviceType})
                              </span>
                            ))
                          ) : (
                             <span className="text-muted-foreground text-sm">
                               {Number(request.device_count) || 0} device(s)
                             </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{request.pickup_date || request.pickupDate ? new Date(request.pickup_date || request.pickupDate!).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-muted-foreground text-sm">{request.recycler_name || 'Not Assigned'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link to={`/request-details/${request.id}`}>
                            <Button variant="outline" size="sm" className="text-primary hover:text-primary/80">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-700 border-green-200 hover:bg-green-50 hover:border-green-400"
                            onClick={() => setReceiptRequestId(request.id!)}
                          >
                            <Receipt className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                          {request.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => handleCancelRequest(request.id!)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
    <ReceiptModal
      requestId={receiptRequestId || ''}
      open={!!receiptRequestId}
      onClose={() => setReceiptRequestId(null)}
    />
  </>
  );
}
