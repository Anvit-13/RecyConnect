import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Package, Calendar, MapPin, CheckCircle2, Clock, Search, Filter, Eye, Smartphone, Laptop, Monitor, Printer, Tablet, HardDrive } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import collectorService, { Collection } from '../../services/collectorService';
import pickupService from '../../services/pickupService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function MyCollections() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalWeight: '0 kg'
  });

  const [recyclers, setRecyclers] = useState<any[]>([]);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState<string>('');
  const [isDelivering, setIsDelivering] = useState(false);

  useEffect(() => {
    fetchCollections();
    fetchRecyclers();
  }, []);

  const fetchRecyclers = async () => {
    try {
      const response = await collectorService.getRecyclers();
      setRecyclers(response.data.recyclers || []);
    } catch (error) {
      console.error('Failed to load recyclers', error);
    }
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const [collRes, statsRes] = await Promise.all([
        collectorService.getCollections(),
        collectorService.getDashboardStats()
      ]);
      
      setCollections(collRes.data.collections || []);
      
      if (statsRes.success) {
        const s = statsRes.data.stats;
        setStats({
          total: s.completed_today + s.completed_this_week, // This is an approximation based on what the API provides
          thisWeek: s.completed_this_week,
          thisMonth: s.completed_this_week * 4, // Another approximation
          totalWeight: `${(s.devices_collected * 2.5).toFixed(1)} kg` // Assuming avg 2.5kg per device
        });
      }
    } catch (error) {
      toast.error('Failed to load collections history');
    } finally {
      setLoading(false);
    }
  };

  const openDeliverModal = (id: string) => {
    setSelectedCollectionId(id);
    setSelectedRecyclerId('');
    setIsDeliverModalOpen(true);
  };

  const confirmDelivery = async () => {
    if (!selectedCollectionId || !selectedRecyclerId) {
      toast.error('Please select a recycler facility');
      return;
    }

    setIsDelivering(true);
    try {
      await pickupService.updatePickupStatus(selectedCollectionId, { 
        status: 'delivered', 
        recyclerId: selectedRecyclerId 
      });
      toast.success('Collection delivered to recycler successfully');
      setIsDeliverModalOpen(false);
      fetchCollections();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to deliver collection');
    } finally {
      setIsDelivering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered': return 'bg-primary/10 text-primary border-primary/20';
      case 'collected': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'in-progress': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'smartphone': return Smartphone;
      case 'monitor': return Monitor;
      case 'printer': return Printer;
      case 'tablet': return Tablet;
      default: return HardDrive;
    }
  };

  const filteredCollections = collections.filter(coll => 
    coll.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coll.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coll.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout userType="collector">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">My Collections</h1>
          <p className="text-muted-foreground">View your collection history and details</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-border shadow-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Collections</p>
                <h3 className="text-foreground">{loading ? '...' : stats.total}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <h3 className="text-foreground">{loading ? '...' : stats.thisWeek}</h3>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <h3 className="text-foreground">100%</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Est. Total Weight</p>
                <h3 className="text-foreground">{loading ? '...' : stats.totalWeight}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-border shadow-sm mb-6 bg-card">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by request ID, customer, or address..." 
                  className="pl-10 bg-card border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Collections List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading collection history...</div>
          ) : filteredCollections.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No historical collections found.</div>
          ) : (
            filteredCollections.map((collection) => (
              <Card key={collection.id} className="border border-border shadow-sm hover:shadow-md transition-shadow bg-card">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-primary font-medium">{collection.id?.substring(0, 10)}...</h3>
                        <Badge className={`${getStatusColor(collection.status)} border-0 capitalize`}>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {collection.status?.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-foreground mb-1 font-medium">{collection.user_name || 'Anonymous User'}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{collection.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(collection.status === 'collected' || collection.status === 'completed') && (
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                          onClick={() => openDeliverModal(collection.id)}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Deliver
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="border-border shadow-sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Collection Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(collection.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(collection.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Devices Contained</p>
                        <p className="text-foreground font-medium">{collection.device_count || 0} items collected</p>
                      </div>
                    </div>

                    {/* Devices placeholder or aggregated view */}
                    <div className="bg-muted/10 p-4 rounded-lg border border-border/50 flex flex-col justify-center items-center text-center">
                       <Package className="w-8 h-8 text-primary/40 mb-2" />
                       <p className="text-sm text-muted-foreground">Detailed device breakdown available in the full report.</p>
                       <Button variant="link" size="sm" className="text-primary p-0 h-auto">Download Receipt</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isDeliverModalOpen} onOpenChange={setIsDeliverModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Deliver to Recycler</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recycler" className="text-foreground">Select Recycler Facility</Label>
              <Select
                value={selectedRecyclerId}
                onValueChange={setSelectedRecyclerId}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Choose a recycler facility" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  {recyclers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No recyclers available</div>
                  ) : recyclers.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} ({r.address || 'No address'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              This will mark the collection as delivered and transfer it to the selected recycler's processing queue.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliverModalOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={confirmDelivery} disabled={isDelivering} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isDelivering ? 'Delivering...' : 'Confirm Delivery'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
