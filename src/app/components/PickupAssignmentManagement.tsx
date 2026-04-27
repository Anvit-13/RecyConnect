import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Truck, Calendar, MapPin, User, Phone, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import pickupService, { PickupRequest } from '../../services/pickupService';
import adminService from '../../services/adminService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function PickupAssignmentManagement() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<PickupRequest[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await pickupService.getAllPickupRequests({ limit: 100 });
      setAssignments(response.data.pickupRequests || []);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectors = async () => {
    try {
      const response = await adminService.getAllUsers({ role: 'collector', limit: 100 });
      setCollectors(response.data.users || []);
    } catch (error) {
      console.error('Failed to load collectors', error);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const getStatusColor = (status?: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
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

  const handleAction = async (id: string, newStatus: string) => {
    try {
      await pickupService.updatePickupStatus(id, { status: newStatus });
      toast.success(`Request marked as ${newStatus}`);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleOpenAssignModal = (id: string) => {
    setSelectedRequestId(id);
    setSelectedCollectorId('');
    setIsModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedRequestId || !selectedCollectorId) {
      toast.error('Please select a collector');
      return;
    }

    setIsAssigning(true);
    try {
      await pickupService.updatePickupStatus(selectedRequestId, { 
        collectorId: selectedCollectorId,
        status: 'scheduled' 
      });
      toast.success('Collector assigned successfully');
      setIsModalOpen(false);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to assign collector');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Layout userType="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Pickup Assignment Management</h1>
          <p className="text-muted-foreground">Manage and assign pickups to collectors</p>
        </div>

        <Card className="border border-border shadow-sm bg-card">
          <div className="overflow-x-auto">
             {loading ? (
               <div className="p-8 text-center text-muted-foreground">Loading pickup requests...</div>
             ) : (
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Collector</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devices</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assignments.length === 0 ? (
                       <tr><td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No requests found.</td></tr>
                    ) : assignments.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-primary font-medium">{req.id?.substring(0, 8)}...</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{req.user_name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{req.user_email || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2 text-muted-foreground max-w-xs">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm truncate">{req.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(req.pickupDate || req.pickup_date || '').toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-foreground text-sm">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span>{req.collector_name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-foreground text-sm">{req.device_count || req.devices?.length || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(req.status)}`}>
                            {req.status?.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                             {req.status === 'scheduled' && (
                              <Button size="sm" onClick={() => handleAction(req.id!, 'in-progress')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm">
                                Start
                              </Button>
                            )}
                            {req.status === 'in-progress' && (
                              <Button size="sm" onClick={() => handleAction(req.id!, 'completed')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                                Complete
                              </Button>
                            )}
                            {req.status === 'pending' && (
                              <Button onClick={() => handleOpenAssignModal(req.id!)} size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
                                Assign
                              </Button>
                            )}
                            {req.status === 'completed' && (
                              <Button disabled size="sm" variant="ghost" className="text-muted-foreground">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Assign Collector</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collector" className="text-foreground">Select Collector</Label>
              <Select
                value={selectedCollectorId}
                onValueChange={setSelectedCollectorId}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Choose a collector" />
                </SelectTrigger>
                <SelectContent>
                  {collectors.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No collectors available</div>
                  ) : collectors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.address || 'No address'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Assigning a collector will change the status of this request to "Scheduled".
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssignment} disabled={isAssigning}>
              {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}