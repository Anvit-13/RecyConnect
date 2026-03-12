import { Layout } from './Layout';
import { Package, Smartphone, Laptop, Monitor, Tablet, Printer, HardDrive, Eye, Wrench } from 'lucide-react';
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

/**
 * Priority Assignment Logic:
 * 
 * Device priority is determined by a combination of estimated value and condition:
 * 
 * HIGH Priority:
 * - Estimated Value ≥ ₹20,000 AND Condition is Good/Excellent
 * - Examples: High-end laptops, smartphones, tablets in working condition
 * 
 * MEDIUM Priority:
 * - Estimated Value between ₹5,000 - ₹20,000 AND Condition is Fair/Good
 * - Examples: Monitors, mid-range devices with partial functionality
 * 
 * LOW Priority:
 * - Estimated Value < ₹5,000 OR Condition is Poor
 * - Examples: Old printers, broken accessories, low-value items
 * 
 * This ensures valuable and reusable devices are processed first for maximum recovery value.
 */

export function ProcessingCenter() {
  const items = [
    {
      id: 'ITEM-2024-345',
      type: 'Laptop',
      brand: 'Dell',
      model: 'XPS 15',
      icon: Laptop,
      from: 'REQ-2024-089',
      receivedDate: '2026-03-06',
      status: 'Processing',
      priority: 'High', // High value (₹20,000+) + Good condition = High priority
      condition: 'Good',
      estimatedValue: '₹20,000',
    },
    {
      id: 'ITEM-2024-346',
      type: 'Monitor',
      brand: 'Samsung',
      model: '27" LED',
      icon: Monitor,
      from: 'REQ-2024-089',
      receivedDate: '2026-03-06',
      status: 'Pending',
      priority: 'Medium', // Medium value (₹5,000-20,000) + Fair condition = Medium priority
      condition: 'Fair',
      estimatedValue: '₹6,500',
    },
    {
      id: 'ITEM-2024-347',
      type: 'Desktop PC',
      brand: 'HP',
      model: 'Pavilion',
      icon: HardDrive,
      from: 'REQ-2024-090',
      receivedDate: '2026-03-06',
      status: 'Pending',
      priority: 'High', // High value (₹20,000+) + Good condition = High priority
      condition: 'Good',
      estimatedValue: '₹15,000',
    },
    {
      id: 'ITEM-2024-348',
      type: 'Printer',
      brand: 'Canon',
      model: 'Pixma MG3620',
      icon: Printer,
      from: 'REQ-2024-091',
      receivedDate: '2026-03-05',
      status: 'Pending',
      priority: 'Low', // Low value (<₹5,000) + Poor condition = Low priority
      condition: 'Poor',
      estimatedValue: '₹1,200',
    },
    {
      id: 'ITEM-2024-349',
      type: 'Tablet',
      brand: 'iPad',
      model: 'Air 3',
      icon: Tablet,
      from: 'REQ-2024-092',
      receivedDate: '2026-03-05',
      status: 'Completed',
      priority: 'High', // High value (₹20,000+) + Excellent condition = High priority
      condition: 'Excellent',
      estimatedValue: '₹26,000',
    },
    {
      id: 'ITEM-2024-350',
      type: 'Smartphone',
      brand: 'iPhone',
      model: '11 Pro',
      icon: Smartphone,
      from: 'REQ-2024-092',
      receivedDate: '2026-03-05',
      status: 'Completed',
      priority: 'High', // High value (₹20,000+) + Good condition = High priority
      condition: 'Good',
      estimatedValue: '₹22,500',
    },
  ];

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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'text-primary';
      case 'Good':
        return 'text-green-600';
      case 'Fair':
        return 'text-yellow-600';
      case 'Poor':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Processing Center</h1>
          <p className="text-muted-foreground">Process and evaluate incoming e-waste items</p>
        </div>

        <Card className="border border-border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground">{item.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.brand} {item.model}
                            </p>
                            <p className="text-xs text-primary">{item.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.from}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{item.receivedDate}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">{item.estimatedValue}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.status === 'Pending' && (
                            <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                              <Wrench className="w-3 h-3 mr-2" />
                              Start
                            </Button>
                          )}
                          {item.status === 'Processing' && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Complete
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-border">
                            <Eye className="w-3 h-3 mr-2" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6 border border-border shadow-sm">
            <div className="text-center">
              <p className="text-2xl text-primary mb-1">28</p>
              <p className="text-sm text-muted-foreground">Items to Process</p>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="text-center">
              <p className="text-2xl text-secondary mb-1">12</p>
              <p className="text-sm text-muted-foreground">In Processing</p>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="text-center">
              <p className="text-2xl text-primary mb-1">156</p>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <div className="text-center">
              <p className="text-2xl text-primary mb-1">₹10,25,000</p>
              <p className="text-sm text-muted-foreground">Est. Total Value</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}