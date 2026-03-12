import { Layout } from './Layout';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { Card } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface RecoveryMaterialsProps {
  userType?: 'recycler' | 'admin';
}

export function RecoveryMaterials({ userType = 'recycler' }: RecoveryMaterialsProps) {
  const materialStats = [
    { name: 'Copper', value: 24.5, color: '#eab308', unit: 'kg', price: '₹12,201' },
    { name: 'Aluminum', value: 58.3, color: '#94a3b8', unit: 'kg', price: '₹9,678' },
    { name: 'Gold', value: 0.156, color: '#f59e0b', unit: 'kg', price: '₹7,76,880' },
    { name: 'Plastic', value: 142.8, color: '#3b82f6', unit: 'kg', price: '₹5,926' },
    { name: 'Steel', value: 85.2, color: '#64748b', unit: 'kg', price: '₹5,657' },
    { name: 'Other', value: 32.4, color: '#cbd5e1', unit: 'kg', price: '₹1,345' },
  ];

  const monthlyRecovery = [
    { month: 'Jan', copper: 18.5, aluminum: 42.3, gold: 0.125, plastic: 98.5 },
    { month: 'Feb', copper: 22.1, aluminum: 51.8, gold: 0.142, plastic: 125.3 },
    { month: 'Mar', copper: 24.5, aluminum: 58.3, gold: 0.156, plastic: 142.8 },
  ];

  const totalValue = materialStats.reduce((sum, material) => {
    const price = parseFloat(material.price.replace('₹', '').replace(/,/g, ''));
    return sum + price;
  }, 0);

  const totalWeight = materialStats.reduce((sum, material) => sum + material.value, 0);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Layout userType={userType}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Recovery Materials Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze recovered materials from e-waste recycling</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Weight Recovered</p>
                <h3 className="text-foreground mb-1">{totalWeight.toFixed(1)} kg</h3>
                <p className="text-sm text-primary">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Material Value</p>
                <h3 className="text-foreground mb-1">₹{totalValue.toLocaleString('en-IN')}</h3>
                <p className="text-sm text-primary">+18% from last month</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Value per kg</p>
                <h3 className="text-foreground mb-1">₹{(totalValue / totalWeight).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                <p className="text-sm text-primary">+5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Material Composition */}
          <div className="lg:col-span-2">
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Material Composition
                </h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={materialStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materialStats.map((entry, index) => (
                        <Cell key={`material-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Material Values */}
          <div>
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Material Values</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {materialStats.map((material) => (
                    <div key={material.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: material.color }}
                        ></div>
                        <div>
                          <p className="text-foreground">{material.name}</p>
                          <p className="text-xs text-muted-foreground">{material.value} {material.unit}</p>
                        </div>
                      </div>
                      <span className="text-foreground">{material.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Monthly Recovery Trends */}
        <Card className="border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Monthly Recovery Trends</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRecovery}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="copper" fill="#eab308" name="Copper (kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="aluminum" fill="#94a3b8" name="Aluminum (kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="plastic" fill="#3b82f6" name="Plastic (kg)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
}