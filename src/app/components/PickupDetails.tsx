import { Layout } from './Layout';
import { ArrowLeft, Package, User, MapPin, Calendar, Truck, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router';

export function PickupDetails() {
  const request = {
    id: 'REQ-2024-088',
    status: 'In Progress',
    createdDate: '2026-03-01',
    pickupDate: '2026-03-04',
    devices: [
      { type: 'Desktop PC', brand: 'HP', model: 'Pavilion 690', condition: 'Working', quantity: 1 },
      { type: 'Monitor', brand: 'LG', model: '27" UltraGear', condition: 'Working', quantity: 1 },
    ],
    user: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '456 Oak Ave, San Francisco, CA 94102',
    },
    recycler: {
      name: 'EcoWaste Solutions',
      contact: '+1 (555) 987-6543',
      vehicleId: 'VEH-042',
    },
  };

  const timeline = [
    { label: 'Request Submitted', date: '2026-03-01 10:30 AM', completed: true },
    { label: 'Recycler Assigned', date: '2026-03-02 02:15 PM', completed: true },
    { label: 'Pickup Scheduled', date: '2026-03-03 09:00 AM', completed: true },
    { label: 'Pickup in Progress', date: '2026-03-04 11:30 AM', completed: true },
    { label: 'Processing', date: 'Pending', completed: false },
    { label: 'Completed', date: 'Pending', completed: false },
  ];

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8">
          <Link to="/my-requests">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground mb-2">Request Details</h1>
              <p className="text-muted-foreground">Request ID: {request.id}</p>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary/10 text-secondary border border-secondary/20">
              {request.status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Information */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Device Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {request.devices.map((device, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Device Type</p>
                          <p className="text-foreground">{device.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Brand</p>
                          <p className="text-foreground">{device.brand}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Model</p>
                          <p className="text-foreground">{device.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Condition</p>
                          <p className="text-foreground">{device.condition}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                          <p className="text-foreground">{device.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Status Timeline */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Status Timeline</h3>
              </div>
              <div className="p-6">
                <div className="relative">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          item.completed 
                            ? 'bg-primary border-primary' 
                            : 'bg-card border-border'
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-muted"></div>
                          )}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div className={`w-0.5 h-full mt-2 ${
                            item.completed ? 'bg-primary' : 'bg-border'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  User Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="text-foreground">{request.user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground">{request.user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground">{request.user.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Pickup Address
                  </p>
                  <p className="text-foreground">{request.user.address}</p>
                </div>
              </div>
            </Card>

            {/* Recycler Assignment */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Recycler Assignment
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="text-foreground">{request.recycler.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contact</p>
                  <p className="text-foreground">{request.recycler.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle ID</p>
                  <p className="text-foreground">{request.recycler.vehicleId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Pickup Date
                  </p>
                  <p className="text-foreground">{request.pickupDate}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
