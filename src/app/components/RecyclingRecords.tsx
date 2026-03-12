import { Layout } from './Layout';
import { Recycle, Calendar, Package, CheckCircle2, Weight } from 'lucide-react';
import { Card } from './ui/card';

export function RecyclingRecords() {
  const records = [
    {
      id: 'REC-2024-156',
      requestId: 'REQ-2024-089',
      devices: ['Laptop Dell XPS 13', 'Smartphone Samsung Galaxy S20'],
      recyclingDate: '2026-03-04',
      weight: '3.2 kg',
      status: 'Completed',
      materials: { copper: '120g', aluminum: '450g', plastic: '1.8kg', gold: '0.8g' },
    },
    {
      id: 'REC-2024-155',
      requestId: 'REQ-2024-088',
      devices: ['Desktop PC HP Pavilion', 'Monitor LG 27"'],
      recyclingDate: '2026-03-03',
      weight: '12.5 kg',
      status: 'Completed',
      materials: { copper: '380g', aluminum: '2.1kg', plastic: '4.5kg', gold: '1.2g' },
    },
    {
      id: 'REC-2024-154',
      requestId: 'REQ-2024-087',
      devices: ['Tablet iPad Air', 'Keyboard Apple Magic'],
      recyclingDate: '2026-03-02',
      weight: '1.8 kg',
      status: 'Completed',
      materials: { copper: '85g', aluminum: '320g', plastic: '950g', gold: '0.5g' },
    },
    {
      id: 'REC-2024-153',
      requestId: 'REQ-2024-086',
      devices: ['Smartphone iPhone 11', 'Chargers (3x)'],
      recyclingDate: '2026-03-01',
      weight: '0.9 kg',
      status: 'Completed',
      materials: { copper: '45g', aluminum: '180g', plastic: '520g', gold: '0.3g' },
    },
    {
      id: 'REC-2024-152',
      requestId: 'REQ-2024-085',
      devices: ['Gaming Console PS4', 'Controllers (2x)'],
      recyclingDate: '2026-02-28',
      weight: '4.5 kg',
      status: 'Completed',
      materials: { copper: '210g', aluminum: '1.2kg', plastic: '2.5kg', gold: '0.6g' },
    },
  ];

  return (
    <Layout userType="recycler">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Recycling Records</h1>
          <p className="text-muted-foreground">View all processed devices and recycling activities</p>
        </div>

        <div className="space-y-6">
          {records.map((record) => (
            <Card key={record.id} className="border border-border shadow-sm overflow-hidden">
              <div className="p-6 bg-muted/30 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Recycle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground">{record.id}</h3>
                      <p className="text-sm text-muted-foreground">Request: {record.requestId}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {record.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Device Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-primary" />
                      <h4 className="text-foreground">Processed Devices</h4>
                    </div>
                    <ul className="space-y-2">
                      {record.devices.map((device, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{device}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Recycling Date</span>
                        </div>
                        <span className="text-foreground">{record.recyclingDate}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Weight className="w-4 h-4" />
                          <span>Total Weight</span>
                        </div>
                        <span className="text-foreground">{record.weight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recovered Materials */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Recycle className="w-5 h-5 text-primary" />
                      <h4 className="text-foreground">Recovered Materials</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-700 mb-1">Copper</p>
                        <p className="text-lg text-yellow-900">{record.materials.copper}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-700 mb-1">Aluminum</p>
                        <p className="text-lg text-gray-900">{record.materials.aluminum}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Plastic</p>
                        <p className="text-lg text-blue-900">{record.materials.plastic}</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-700 mb-1">Gold</p>
                        <p className="text-lg text-amber-900">{record.materials.gold}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
