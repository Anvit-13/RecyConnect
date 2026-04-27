import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Package, Smartphone, Laptop, Monitor, Tablet, Printer, HardDrive, Eye, Wrench, Receipt } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import pickupService, { PickupRequest, Device } from '../../services/pickupService';
import recyclingService from '../../services/recyclingService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ProcessingCenter() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ toProcess: 0, inProcessing: 0, completedToday: 0, totalValue: 0 });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await pickupService.getAllPickupRequests({ limit: 100 }); 
      // We process requests that are scheduled, in-progress or completed
      const requests = response.data.pickupRequests || [];
      
      const extractedItems: any[] = [];
      let toProc = 0, inProc = 0, compToday = 0, val = 0;

      requests.forEach((req) => {
        if (!['delivered', 'in-progress', 'completed'].includes(req.status || '')) return;

        req.devices?.forEach((device: Device) => {
          extractedItems.push({
            id: device.id || `${req.id}-${device.deviceType || device.device_type}`,
            type: device.deviceType || device.device_type || 'Unknown',
            brand: device.brand || 'Unknown',
            model: device.model,
            from: req.id,
            receivedDate: new Date(req.created_at || new Date()).toLocaleDateString(),
            status: req.status === 'in-progress' ? 'Processing' : req.status === 'completed' ? 'Completed' : 'Pending',
            condition: device.condition,
            estimatedValue: parseFloat(device.estimated_value?.toString() || '0'),
          });

          if (req.status === 'delivered') toProc++;
          if (req.status === 'in-progress') inProc++;
          if (req.status === 'completed' && new Date(req.updated_at || new Date()).toDateString() === new Date().toDateString()) compToday++;
        });

        val += parseFloat(req.total_estimated_value?.toString() || '0');
      });

      setItems(extractedItems);
      setStats({ toProcess: toProc, inProcessing: inProc, completedToday: compToday, totalValue: val });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load processing center queue';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessClick = async (item: any) => {
    if (item.status === 'Pending') {
      try {
        await pickupService.updatePickupStatus(item.from, { status: 'in-progress' });
        toast.success('Processing started');
        fetchQueue();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to start processing');
      }
    } else {
      // Auto-calculate extracted materials based on device type
      const DEVICE_STATS: Record<string, { weight: number, material: string, valPerKg: number }> = {
        'laptop': { weight: 2.5, material: 'electronic', valPerKg: 15 },
        'smartphone': { weight: 0.2, material: 'electronic', valPerKg: 50 },
        'mobile': { weight: 0.2, material: 'electronic', valPerKg: 50 },
        'monitor': { weight: 4.5, material: 'plastic', valPerKg: 3 },
        'tablet': { weight: 0.6, material: 'electronic', valPerKg: 30 },
        'printer': { weight: 8.0, material: 'plastic', valPerKg: 2 },
        'desktop': { weight: 7.0, material: 'metal', valPerKg: 5 },
        'default': { weight: 1.5, material: 'electronic', valPerKg: 5 }
      };

      const deviceType = item.type?.toLowerCase() || 'default';
      const stats = DEVICE_STATS[deviceType] || DEVICE_STATS['default'];
      
      const autoWeight = stats.weight;
      const autoMaterial = stats.material;
      const autoValue = item.estimatedValue > 0 ? item.estimatedValue : (autoWeight * stats.valPerKg);

      try {
        // 1. Create auto-calculated recycling record
        await recyclingService.createRecord({
          pickupId: item.from,
          materialType: autoMaterial,
          weight: autoWeight,
          value: autoValue
        });

        // 2. Mark as completed
        await pickupService.updatePickupStatus(item.from, { status: 'completed' });
        
        toast.success(`Automatically extracted ${autoWeight}kg of ${autoMaterial} valued at $${autoValue.toFixed(2)}`);
        fetchQueue();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to complete processing');
      }
    }
  };

  const getDeviceIcon = (type: string) => {
    if (!type) return HardDrive;
    switch (type.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'smartphone': case 'mobile': return Smartphone;
      case 'monitor': return Monitor;
      case 'tablet': return Tablet;
      case 'printer': return Printer;
      default: return HardDrive;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Completed':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'working':
      case 'excellent':
        return 'text-primary';
      case 'fair':
      case 'partially-working':
        return 'text-yellow-600';
      case 'poor':
      case 'not-working':
      case 'broken':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Processing Center</h1>
          <p className="text-muted-foreground">Process and evaluate incoming e-waste items before material extraction</p>
        </div>

        <Card className="border border-border shadow-sm bg-card mb-8">
          <div className="overflow-x-auto">
            {loading ? (
               <div className="p-8 text-center text-muted-foreground">Loading processing queue...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                         No devices found in processing queue.
                      </TableCell>
                    </TableRow>
                  ) : items.map((item, idx) => {
                    const Icon = getDeviceIcon(item.type);
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-foreground capitalize">{item.type}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.brand} {item.model}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{item.from?.substring(0, 8)}...</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.receivedDate}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium capitalize ${getConditionColor(item.condition)}`}>
                            {item.condition?.replace('-', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">₹{item.estimatedValue.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.status === 'Completed' ? (
                               <Button size="sm" variant="outline" className="border-border">
                                <Receipt className="w-3 h-3 mr-2" />
                                Review
                               </Button>
                            ) : (
                                <Button 
                                  size="sm" 
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                  onClick={() => handleProcessClick(item)}
                                >
                                <Wrench className="w-3 h-3 mr-2" />
                                {item.status === 'Pending' ? 'Start Processing' : 'Mark Completed'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Summary Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="p-6 border border-border shadow-sm bg-card hover:bg-muted/10 transition-colors">
              <div className="text-center">
                <p className="text-2xl text-primary font-bold mb-1">{stats.toProcess}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Devices to Process</p>
              </div>
            </Card>
            <Card className="p-6 border border-border shadow-sm bg-card hover:bg-muted/10 transition-colors">
              <div className="text-center">
                <p className="text-2xl text-secondary font-bold mb-1">{stats.inProcessing}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Currently Processing</p>
              </div>
            </Card>
            <Card className="p-6 border border-border shadow-sm bg-card hover:bg-muted/10 transition-colors">
              <div className="text-center">
                <p className="text-2xl text-primary font-bold mb-1">{stats.completedToday}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Completed Today</p>
              </div>
            </Card>
            <Card className="p-6 border border-border shadow-sm bg-card hover:bg-muted/10 transition-colors">
              <div className="text-center">
                <p className="text-2xl text-primary font-bold mb-1">₹{stats.totalValue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Est. Value</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}