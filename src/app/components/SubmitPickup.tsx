import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from './Layout';
import { Upload, Calendar, MapPin, Package, Plus, Trash2, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Device {
  id: string;
  deviceType: string;
  brand: string;
  model: string;
  condition: string;
  quantity: string;
}

export function SubmitPickup() {
  const navigate = useNavigate();
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      deviceType: '',
      brand: '',
      model: '',
      condition: '',
      quantity: '1',
    }
  ]);
  
  const [pickupInfo, setPickupInfo] = useState({
    address: '',
    pickupDate: '',
  });

  const [totalEstimatedValue, setTotalEstimatedValue] = useState(0);

  // Device type options with their respective brands and models
  const deviceOptions = {
    laptop: {
      name: 'Laptop',
      brands: {
        'Apple': ['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13" M1', 'MacBook Pro 13" M2', 'MacBook Pro 14" M1 Pro', 'MacBook Pro 14" M2 Pro', 'MacBook Pro 14" M3 Pro'],
        'Dell': ['XPS 13', 'XPS 15', 'XPS 17', 'Inspiron 15 3000', 'Inspiron 15 5000', 'Latitude 5420', 'Latitude 7420', 'Precision 5560', 'G15 Gaming'],
        'HP': ['Spectre x360', 'Envy 13', 'Envy 15', 'Pavilion 15', 'EliteBook 840', 'ProBook 450', 'Omen 15', 'ZBook Studio'],
        'Lenovo': ['ThinkPad X1 Carbon', 'ThinkPad T14', 'ThinkPad P1', 'IdeaPad 3', 'IdeaPad 5', 'Yoga 7i', 'Legion 5', 'Legion 7'],
        'ASUS': ['ZenBook 13', 'ZenBook 14', 'VivoBook 15', 'ROG Zephyrus G14', 'ROG Strix G15', 'TUF Gaming A15'],
        'Acer': ['Swift 3', 'Swift 5', 'Aspire 5', 'Predator Helios 300', 'Nitro 5'],
        'MSI': ['GS66 Stealth', 'GE66 Raider', 'GP66 Leopard', 'Creator 15'],
        'Razer': ['Blade 15', 'Blade 17', 'Blade 14', 'Blade Stealth 13']
      }
    },
    desktop: {
      name: 'Desktop Computer',
      brands: {
        'Dell': ['OptiPlex 3090', 'OptiPlex 5090', 'XPS 8950', 'Alienware Aurora R13'],
        'HP': ['Pavilion Desktop', 'EliteDesk 800', 'Z2 Tower', 'Omen 25L', 'Omen 30L'],
        'Lenovo': ['ThinkCentre M70q', 'ThinkStation P340', 'IdeaCentre 3', 'Legion Tower 5i'],
        'Apple iMac': ['iMac 24" M1', 'iMac 24" M3', 'Mac Studio M1 Max', 'Mac Pro M2 Ultra'],
        'Custom Built': ['Gaming PC', 'Workstation PC', 'Office PC', 'High-End Build']
      }
    },
    smartphone: {
      name: 'Smartphone',
      brands: {
        'Apple iPhone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12', 'iPhone SE 3rd Gen'],
        'Samsung Galaxy': ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54 5G'],
        'Google Pixel': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6'],
        'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus Nord 3'],
        'Xiaomi': ['Xiaomi 14 Ultra', 'Xiaomi 13', 'Redmi Note 13 Pro', 'POCO F5 Pro']
      }
    },
    tablet: {
      name: 'Tablet',
      brands: {
        'Apple iPad': ['iPad Pro 12.9" M2', 'iPad Pro 11" M2', 'iPad Air 5th Gen', 'iPad 10th Gen', 'iPad mini 6th Gen'],
        'Samsung Galaxy Tab': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A8'],
        'Microsoft Surface': ['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3']
      }
    },
    monitor: {
      name: 'Monitor',
      brands: {
        'Dell': ['UltraSharp U2723QE', 'S3422DWG', 'Alienware AW3423DW'],
        'LG': ['UltraGear 27GP950', 'UltraWide 34WP65C', '27UP850'],
        'Samsung': ['Odyssey G9', 'Odyssey G7', 'M8 Smart Monitor'],
        'ASUS': ['ProArt PA278QV', 'ROG Swift PG279QM', 'TUF Gaming VG27AQ']
      }
    },
    printer: {
      name: 'Printer',
      brands: {
        'HP': ['LaserJet Pro M404n', 'OfficeJet Pro 9015e', 'DeskJet 3755'],
        'Canon': ['PIXMA TS3522', 'imageCLASS MF445dw', 'MAXIFY GX7021'],
        'Epson': ['EcoTank ET-2850', 'WorkForce Pro WF-4830', 'Expression Home XP-4200'],
        'Brother': ['HL-L2350DW', 'MFC-L3770CDW', 'DCP-L2550DW']
      }
    },
    other: {
      name: 'Other Electronics',
      brands: {
        'Gaming Console': ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
        'Smart TV': ['Samsung QLED', 'LG OLED', 'Sony Bravia'],
        'Router': ['ASUS AX6000', 'Netgear Nighthawk', 'TP-Link Archer'],
        'Camera': ['Canon EOS R5', 'Sony A7 IV', 'Nikon Z9']
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deviceCount = devices.length;
    alert(`Pickup request submitted successfully!\n${deviceCount} device(s) with total estimated value: ₹${totalEstimatedValue}`);
    navigate('/my-requests');
  };

  const handlePickupInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPickupInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeviceChange = (deviceId: string, field: keyof Device, value: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const updatedDevice = { ...device, [field]: value };
        
        if (field === 'deviceType') {
          updatedDevice.brand = '';
          updatedDevice.model = '';
        }
        if (field === 'brand') {
          updatedDevice.model = '';
        }
        
        return updatedDevice;
      }
      return device;
    }));
  };

  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      deviceType: '',
      brand: '',
      model: '',
      condition: '',
      quantity: '1',
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const removeDevice = (deviceId: string) => {
    if (devices.length > 1) {
      setDevices(prev => prev.filter(device => device.id !== deviceId));
    }
  };

  const calculateDeviceValue = (device: Device): number => {
    if (!device.deviceType || !device.condition || !device.quantity || !device.brand) {
      return 0;
    }

    const baseValues: { [key: string]: number } = {
      laptop: 16000,
      desktop: 12000,
      smartphone: 9600,
      tablet: 8000,
      monitor: 4800,
      printer: 2800,
      other: 2400,
    };

    const getModelMultiplier = (deviceType: string, brand: string, model: string): number => {
      const modelLower = model.toLowerCase();
      const brandLower = brand.toLowerCase();
      
      switch (deviceType) {
        case 'laptop':
          if (brandLower.includes('apple')) {
            if (modelLower.includes('m3') || modelLower.includes('m2')) return 2.2;
            if (modelLower.includes('m1')) return 1.9;
            if (modelLower.includes('pro 16') || modelLower.includes('pro 14')) return 2.0;
            return 1.6;
          }
          if (modelLower.includes('rog') || modelLower.includes('predator') || modelLower.includes('alienware')) return 1.7;
          if (modelLower.includes('thinkpad') || modelLower.includes('elitebook')) return 1.4;
          if (modelLower.includes('xps') || modelLower.includes('spectre')) return 1.5;
          return 1.0;
          
        case 'smartphone':
          if (brandLower.includes('apple')) {
            if (modelLower.includes('15 pro') || modelLower.includes('14 pro')) return 2.0;
            if (modelLower.includes('15') || modelLower.includes('14')) return 1.7;
            if (modelLower.includes('13 pro') || modelLower.includes('12 pro')) return 1.5;
            return 1.3;
          }
          if (brandLower.includes('samsung')) {
            if (modelLower.includes('s24 ultra') || modelLower.includes('s23 ultra')) return 1.6;
            if (modelLower.includes('fold') || modelLower.includes('flip')) return 1.5;
            return 1.3;
          }
          return 1.0;
          
        case 'tablet':
          if (brandLower.includes('apple')) {
            if (modelLower.includes('pro')) return 1.9;
            return 1.5;
          }
          return 1.0;
          
        default:
          return 1.0;
      }
    };

    const getBrandMultiplier = (deviceType: string, brand: string): number => {
      const brandLower = brand.toLowerCase();
      
      switch (deviceType) {
        case 'laptop':
          if (brandLower.includes('apple')) return 1.2;
          if (brandLower.includes('razer') || brandLower.includes('alienware')) return 1.1;
          return 1.0;
        case 'smartphone':
          if (brandLower.includes('apple')) return 1.1;
          if (brandLower.includes('samsung') || brandLower.includes('google')) return 1.05;
          return 1.0;
        default:
          return 1.0;
      }
    };

    const conditionMultipliers: { [key: string]: number } = {
      working: 1.0,
      'partially-working': 0.65,
      'not-working': 0.35,
      broken: 0.15,
    };

    const getAgeFactor = (deviceType: string, model: string): number => {
      const modelLower = model.toLowerCase();
      
      if (modelLower.includes('m3') || modelLower.includes('15') || modelLower.includes('2024')) return 1.0;
      if (modelLower.includes('m2') || modelLower.includes('14') || modelLower.includes('2023')) return 0.9;
      if (modelLower.includes('m1') || modelLower.includes('13') || modelLower.includes('2022')) return 0.8;
      
      switch (deviceType) {
        case 'laptop':
        case 'smartphone':
          return 0.75;
        case 'desktop':
        case 'tablet':
          return 0.85;
        default:
          return 0.7;
      }
    };

    const baseValue = baseValues[device.deviceType] || 2400;
    const brandMultiplier = getBrandMultiplier(device.deviceType, device.brand);
    const modelMultiplier = device.model ? getModelMultiplier(device.deviceType, device.brand, device.model) : 1.0;
    const conditionMultiplier = conditionMultipliers[device.condition] || 0.15;
    const ageFactor = device.model ? getAgeFactor(device.deviceType, device.model) : 0.8;
    const quantity = parseInt(device.quantity) || 1;

    const estimated = baseValue * brandMultiplier * modelMultiplier * conditionMultiplier * ageFactor * quantity;
    return Math.round(estimated * 100) / 100;
  };

  useEffect(() => {
    const total = devices.reduce((sum, device) => {
      return sum + calculateDeviceValue(device);
    }, 0);
    setTotalEstimatedValue(Math.round(total * 100) / 100);
  }, [devices]);

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Submit Pickup Request</h1>
          <p className="text-muted-foreground">Fill in the details below to schedule your e-waste pickup</p>
        </div>

        <div className="max-w-6xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Devices Section */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Devices ({devices.length})
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Add all devices you want to recycle</p>
                </div>
                <Button
                  type="button"
                  onClick={addDevice}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {devices.map((device, index) => (
                  <Card key={device.id} className="border border-border/50 bg-muted/20">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-foreground font-medium">Device {index + 1}</h4>
                        {devices.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDevice(device.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-foreground text-sm">Device Type</label>
                          <select
                            value={device.deviceType}
                            onChange={(e) => handleDeviceChange(device.id, 'deviceType', e.target.value)}
                            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                            required
                          >
                            <option value="">Select device type</option>
                            {Object.entries(deviceOptions).map(([key, deviceData]) => (
                              <option key={key} value={key}>{deviceData.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-foreground text-sm">Brand</label>
                          <select
                            value={device.brand}
                            onChange={(e) => handleDeviceChange(device.id, 'brand', e.target.value)}
                            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                            required
                            disabled={!device.deviceType}
                          >
                            <option value="">
                              {device.deviceType ? 'Select brand' : 'Select device type first'}
                            </option>
                            {device.deviceType && (() => {
                              const deviceData = deviceOptions[device.deviceType as keyof typeof deviceOptions];
                              if (deviceData && 'brands' in deviceData) {
                                const brands = deviceData.brands as Record<string, string[]>;
                                return Object.keys(brands).map((brand) => (
                                  <option key={brand} value={brand}>{brand}</option>
                                ));
                              }
                              return null;
                            })()}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-foreground text-sm">Model</label>
                          <select
                            value={device.model}
                            onChange={(e) => handleDeviceChange(device.id, 'model', e.target.value)}
                            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                            required
                            disabled={!device.brand}
                          >
                            <option value="">
                              {device.brand ? 'Select model' : 'Select brand first'}
                            </option>
                            {device.deviceType && device.brand && (() => {
                              const deviceData = deviceOptions[device.deviceType as keyof typeof deviceOptions];
                              if (deviceData && 'brands' in deviceData) {
                                const brands = deviceData.brands as Record<string, string[]>;
                                const models = brands[device.brand];
                                return models?.map((model: string) => (
                                  <option key={model} value={model}>{model}</option>
                                ));
                              }
                              return null;
                            })()}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-foreground text-sm">Condition</label>
                          <select
                            value={device.condition}
                            onChange={(e) => handleDeviceChange(device.id, 'condition', e.target.value)}
                            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                            required
                          >
                            <option value="">Select condition</option>
                            <option value="working">Working</option>
                            <option value="partially-working">Partially Working</option>
                            <option value="not-working">Not Working</option>
                            <option value="broken">Broken</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-foreground text-sm">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            value={device.quantity}
                            onChange={(e) => handleDeviceChange(device.id, 'quantity', e.target.value)}
                            className="bg-input-background"
                            required
                          />
                        </div>

                        <div className="space-y-2 flex items-end">
                          <div className="w-full p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-xs text-muted-foreground">Estimated Value</p>
                            <p className="text-lg font-bold text-primary">₹{calculateDeviceValue(device)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Total Estimated Value */}
            {totalEstimatedValue > 0 && (
              <Card className="border border-primary/30 shadow-sm bg-primary/5">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-foreground mb-1 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-primary" />
                        Total Estimated Value
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        For {devices.length} device(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-primary">₹{totalEstimatedValue}</p>
                      <p className="text-xs text-muted-foreground mt-1">This is an estimate only</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Pickup Information */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Pickup Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="address" className="text-foreground">Pickup Address</label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter full pickup address"
                      value={pickupInfo.address}
                      onChange={handlePickupInfoChange}
                      className="bg-input-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pickupDate" className="text-foreground">Preferred Pickup Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="pickupDate"
                        name="pickupDate"
                        type="date"
                        value={pickupInfo.pickupDate}
                        onChange={handlePickupInfoChange}
                        className="pl-10 bg-input-background"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Device Images Upload */}
            <Card className="border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground">Device Images (Optional)</h3>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  <input type="file" className="hidden" accept="image/*" multiple />
                </div>
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
