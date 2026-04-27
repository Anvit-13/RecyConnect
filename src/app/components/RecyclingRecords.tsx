import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Database, Search, Calendar, Package } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import recyclingService, { RecyclingRecord } from '../../services/recyclingService';
import { toast } from 'sonner';

export function RecyclingRecords() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await recyclingService.getRecords();
      setRecords(response.data.records);
    } catch (error) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => 
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.material_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.pickup_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Recycling Records</h1>
          <p className="text-muted-foreground">View detailed logs of all processed e-waste batches</p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ID, material, or pickup source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <Card className="border border-border shadow-sm bg-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Processing History
            </h3>
          </div>
          <div className="overflow-x-auto">
             {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading records...</div>
             ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Record ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pickup Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material Grade</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weight Recovered</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value Extracted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Processed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecords.length === 0 ? (
                     <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No records found.</td></tr>
                  ) : filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary font-medium">{record.id?.substring(0, 8)}...</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-foreground">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-secondary">{record.pickup_id?.substring(0, 10)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-foreground capitalize">{record.material_type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-foreground font-medium">{parseFloat(record.weight_kg).toFixed(1)} kg</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary font-medium">${parseFloat(record.value_usd).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.processed_date).toLocaleString()}</span>
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
    </Layout>
  );
}
