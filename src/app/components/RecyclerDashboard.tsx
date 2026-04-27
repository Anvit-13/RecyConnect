import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Factory, Package, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import recyclingService from '../../services/recyclingService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function RecyclerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: any;
    processingQueue: any[];
    weeklyData: any[];
  }>({
    stats: {},
    processingQueue: [],
    weeklyData: []
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await recyclingService.getDashboardStats();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
     return (
       <Layout userType="recycler">
         <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>
       </Layout>
     );
  }

  const stats = [
    {
      title: 'Total Processed',
      value: data.stats.total_processed || '0',
      change: 'Lifetime',
      icon: Factory,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Queue',
      value: data.stats.processing || '0',
      change: 'Pending Devices',
      icon: Package,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Materials Recovered',
      value: `${parseFloat(data.stats.materials_recovered || '0').toFixed(1)} kg`,
      change: 'Lifetime',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Value Generated',
      value: `$${parseFloat(data.stats.value_generated || '0').toFixed(2)}`,
      change: 'Lifetime',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Recycler Dashboard</h1>
          <p className="text-muted-foreground">Monitor processing metrics and material recovery</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="p-6 border border-border shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (stat.title === 'In Queue') navigate('/processing-center');
                  if (stat.title === 'Total Processed') navigate('/recycling-records');
                }}
              >
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Weekly Processing Volume (kg)</h3>
            </div>
            <div className="p-6">
               {data.weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.weeklyData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        color: 'var(--card-foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                      }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">Not enough data to display processing volume.</div>
              )}
            </div>
          </Card>

          {/* Processing Queue */}
          <Card className="border border-border shadow-sm bg-card">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-foreground">Processing Queue</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80"
                onClick={() => navigate('/processing-center')}
              >
                View Full Queue
              </Button>
            </div>
            <div className="p-0">
               {data.processingQueue.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">Queue is empty.</div>
               ) : (
                <div className="divide-y divide-border">
                  {data.processingQueue.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-primary">{item.id?.substring(0, 8)}...</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border bg-card ${getStatusColor(item.status)}`}>
                          {item.status?.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">{item.device_count} Devices Extracted</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Est Value: ${parseFloat(item.total_estimated_value || '0').toFixed(2)}</span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-primary"
                          onClick={() => navigate('/processing-center')}
                        >
                          Process Items →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
               )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}