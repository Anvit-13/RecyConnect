import { Layout } from './Layout';
import { Truck, Package, CheckCircle2, Clock, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RecyclerDashboard() {
  const stats = [
    {
      title: 'Items to Process',
      value: '28',
      change: '+5 today',
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Processing',
      value: '12',
      change: 'In progress',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed Today',
      value: '15',
      change: '+3 from yesterday',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Materials Recovered',
      value: '186 kg',
      change: '+22%',
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const processingQueue = [
    { id: 'ITEM-2024-345', type: 'Laptop', brand: 'Dell XPS 15', from: 'REQ-2024-089', status: 'Processing', priority: 'High' },
    { id: 'ITEM-2024-346', type: 'Monitor', brand: 'Samsung 27"', from: 'REQ-2024-089', status: 'Pending', priority: 'Medium' },
    { id: 'ITEM-2024-347', type: 'Desktop PC', brand: 'HP Pavilion', from: 'REQ-2024-090', status: 'Pending', priority: 'High' },
    { id: 'ITEM-2024-348', type: 'Printer', brand: 'Canon Pixma', from: 'REQ-2024-091', status: 'Pending', priority: 'Low' },
  ];

  const weeklyData = [
    { day: 'Mon', processed: 18 },
    { day: 'Tue', processed: 22 },
    { day: 'Wed', processed: 20 },
    { day: 'Thu', processed: 25 },
    { day: 'Fri', processed: 15 },
    { day: 'Sat', processed: 12 },
    { day: 'Sun', processed: 8 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'bg-secondary/10 text-secondary';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'Completed':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Recycler Dashboard</h1>
          <p className="text-muted-foreground">Process e-waste and track material recovery</p>
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
          {/* Processing Queue */}
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Processing Queue
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {processingQueue.map((item) => (
                    <div key={item.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-primary mb-1">{item.id}</p>
                          <p className="text-foreground">{item.type} - {item.brand}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>From: {item.from}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Performance */}
          <div>
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Items Processed</h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="processed" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}