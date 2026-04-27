import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { BarChart3, TrendingUp, IndianRupee, Package } from 'lucide-react';
import { Card } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import recyclingService, { MaterialStat, MonthlyRecovery } from '../../services/recyclingService';
import { toast } from 'sonner';

interface RecoveryMaterialsProps {
  userType?: 'recycler' | 'admin';
}

export function RecoveryMaterials({ userType = 'recycler' }: RecoveryMaterialsProps) {
  const [loading, setLoading] = useState(true);
  const [materialStats, setMaterialStats] = useState<MaterialStat[]>([]);
  const [monthlyRecovery, setMonthlyRecovery] = useState<MonthlyRecovery[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await recyclingService.getMaterials();
      setMaterialStats(response.data.materialStats || []);
      setMonthlyRecovery(response.data.monthlyRecovery || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load materials data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = materialStats.reduce((sum, material) => sum + parseFloat(material.value?.toString() || (parseFloat(material.weight.toString()) * 50).toString()), 0);
  const totalWeight = materialStats.reduce((sum, material) => sum + parseFloat(material.weight?.toString() || '0'), 0);

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

        {loading ? (
           <div className="flex justify-center py-20 text-muted-foreground">Loading data...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border border-border shadow-sm bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Weight Recovered</p>
                    <h3 className="text-foreground mb-1">{totalWeight.toFixed(1)} kg</h3>
                    <p className="text-sm text-primary">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border shadow-sm bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Material Value</p>
                    <h3 className="text-foreground mb-1">₹{totalValue.toLocaleString('en-IN')}</h3>
                    <p className="text-sm text-primary">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border shadow-sm bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg. Value per kg</p>
                    <h3 className="text-foreground mb-1">₹{totalWeight > 0 ? (totalValue / totalWeight).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0'}</h3>
                    <p className="text-sm text-primary">All time</p>
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
                <Card className="border border-border shadow-sm bg-card h-full">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-foreground flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Material Composition (kg)
                    </h3>
                  </div>
                  <div className="p-6">
                    {materialStats.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">No material extracted yet.</div>
                    ) : (
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
                            dataKey="weight"
                          >
                            {materialStats.map((entry, index) => (
                              <Cell key={`material-cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'var(--card)', 
                              color: 'var(--card-foreground)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>
              </div>

              {/* Material Values */}
              <div>
                <Card className="border border-border shadow-sm bg-card h-full">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-foreground">Material Values</h3>
                  </div>
                  <div className="p-6">
                     {materialStats.length === 0 ? (
                       <p className="text-muted-foreground text-center py-6">No data</p>
                     ) : (
                      <div className="space-y-4">
                        {materialStats.map((material) => (
                          <div key={material.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: material.color }}
                              ></div>
                              <div>
                                <p className="text-foreground capitalize">{material.name}</p>
                                <p className="text-xs text-muted-foreground">Vol: {parseFloat(material.weight.toString()).toFixed(1)} kg</p>
                              </div>
                            </div>
                            <span className="text-foreground font-medium">₹{parseFloat(material.value?.toString() || (parseFloat(material.weight.toString()) * 50).toString()).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                     )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Monthly Recovery Trends */}
            <Card className="border border-border shadow-sm bg-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Monthly Recovery Trends (kg)</h3>
              </div>
              <div className="p-6">
                {monthlyRecovery.length === 0 ? (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground">No trends data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyRecovery}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          color: 'var(--card-foreground)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="electronics" fill="#10b981" name="Electronics (kg)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="batteries" fill="#f59e0b" name="Batteries (kg)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="metals" fill="#94a3b8" name="Metals (kg)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="plastics" fill="#3b82f6" name="Plastics (kg)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}