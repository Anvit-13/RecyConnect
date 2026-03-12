import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from './Layout';
import { Upload, Calendar, MapPin, Package, Smartphone, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export function SubmitPickup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: '',
    quantity: '1',
    address: '',
    pickupDate: '',
  });

  const [estimatedValue, setEstimatedValue] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Pickup request submitted successfully!');
    navigate('/my-requests');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Reset brand and model when device type changes
      if (name === 'deviceType') {
        return {
          ...prev,
          [name]: value,
          brand: '', // Reset brand selection
          model: ''  // Reset model selection
        };
      }
      // Reset model when brand changes
      if (name === 'brand') {
        return {
          ...prev,
          [name]: value,
          model: '' // Reset model selection
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Device type options with their respective brands and models
  const deviceOptions = {
    laptop: {
      name: 'Laptop',
      brands: {
        'Apple': ['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13" M1', 'MacBook Pro 13" M2', 'MacBook Pro 14" M1 Pro', 'MacBook Pro 14" M2 Pro', 'MacBook Pro 14" M3 Pro', 'MacBook Pro 16" M1 Pro', 'MacBook Pro 16" M2 Pro', 'MacBook Pro 16" M3 Pro', 'MacBook Air Intel', 'MacBook Pro Intel'],
        'Dell': ['XPS 13', 'XPS 15', 'XPS 17', 'Inspiron 15 3000', 'Inspiron 15 5000', 'Inspiron 15 7000', 'Latitude 5420', 'Latitude 7420', 'Precision 5560', 'Precision 7560', 'G15 Gaming', 'G7 Gaming', 'Vostro 15 3000'],
        'HP': ['Spectre x360', 'Envy 13', 'Envy 15', 'Pavilion 15', 'Pavilion Gaming', 'EliteBook 840', 'EliteBook 850', 'ProBook 450', 'ProBook 650', 'Omen 15', 'Omen 17', 'ZBook Studio', 'ZBook Fury'],
        'Lenovo': ['ThinkPad X1 Carbon', 'ThinkPad T14', 'ThinkPad T15', 'ThinkPad P1', 'ThinkPad P15', 'IdeaPad 3', 'IdeaPad 5', 'Yoga 7i', 'Yoga 9i', 'Legion 5', 'Legion 7', 'Legion Slim 7'],
        'ASUS': ['ZenBook 13', 'ZenBook 14', 'ZenBook Pro 15', 'VivoBook 15', 'VivoBook Pro 16', 'ROG Zephyrus G14', 'ROG Zephyrus G15', 'ROG Strix G15', 'ROG Flow X13', 'TUF Gaming A15', 'ExpertBook B9'],
        'Acer': ['Swift 3', 'Swift 5', 'Aspire 5', 'Aspire 7', 'Predator Helios 300', 'Predator Triton 500', 'Nitro 5', 'Nitro 7', 'ConceptD 7', 'Chromebook Spin 713'],
        'MSI': ['GS66 Stealth', 'GS77 Stealth', 'GE66 Raider', 'GE76 Raider', 'GP66 Leopard', 'GL66 Pulse', 'Creator 15', 'Creator 17', 'Modern 14', 'Modern 15'],
        'Razer': ['Blade 15', 'Blade 17', 'Blade 14', 'Blade Stealth 13', 'Book 13'],
        'Microsoft Surface': ['Surface Laptop 4', 'Surface Laptop 5', 'Surface Laptop Studio', 'Surface Book 3', 'Surface Pro 8', 'Surface Pro 9'],
        'Samsung': ['Galaxy Book Pro', 'Galaxy Book Pro 360', 'Galaxy Book2 Pro', 'Galaxy Book2 Pro 360', 'Galaxy Book3 Pro', 'Galaxy Book3 Ultra'],
        'LG': ['Gram 14', 'Gram 15', 'Gram 16', 'Gram 17', 'Ultra PC 15', 'Ultra PC 17']
      }
    },
    desktop: {
      name: 'Desktop Computer',
      brands: {
        'Dell': ['OptiPlex 3090', 'OptiPlex 5090', 'OptiPlex 7090', 'Inspiron 3891', 'Inspiron 3910', 'XPS 8950', 'Precision 3660', 'Precision 5820', 'Alienware Aurora R13', 'Alienware Aurora R14'],
        'HP': ['Pavilion Desktop', 'Pavilion Gaming Desktop', 'EliteDesk 800', 'EliteDesk 705', 'ProDesk 400', 'ProDesk 600', 'Z2 Tower', 'Z4 Workstation', 'Z6 Workstation', 'Omen 25L', 'Omen 30L', 'Omen 45L'],
        'Lenovo': ['ThinkCentre M70q', 'ThinkCentre M90q', 'ThinkStation P340', 'ThinkStation P520', 'IdeaCentre 3', 'IdeaCentre 5', 'Legion Tower 5i', 'Legion Tower 7i'],
        'ASUS': ['VivoPC', 'Mini PC PN50', 'ExpertCenter D500MA', 'ProArt Station PA90', 'ROG Strix GT15', 'ROG Strix GT35'],
        'Acer': ['Aspire TC', 'Aspire XC', 'Predator Orion 3000', 'Predator Orion 5000', 'Predator Orion 7000', 'Veriton X', 'Veriton M'],
        'Apple iMac': ['iMac 24" M1', 'iMac 24" M3', 'iMac Pro 27"', 'Mac Studio M1 Max', 'Mac Studio M2 Max', 'Mac Pro M2 Ultra'],
        'Custom Built': ['Gaming PC', 'Workstation PC', 'Office PC', 'Budget Build', 'High-End Build', 'Mini ITX Build']
      }
    },
    smartphone: {
      name: 'Smartphone',
      brands: {
        'Apple iPhone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini', 'iPhone SE 3rd Gen', 'iPhone 11', 'iPhone XR', 'iPhone XS'],
        'Samsung Galaxy': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy Note 20 Ultra', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4', 'Galaxy A54 5G', 'Galaxy A34 5G', 'Galaxy A14 5G'],
        'Google Pixel': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 'Pixel 5', 'Pixel 4a 5G'],
        'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus Nord 3', 'OnePlus Nord CE 3', 'OnePlus Nord N30'],
        'Xiaomi': ['Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13 Ultra', 'Xiaomi 13', 'Xiaomi 12 Pro', 'Redmi Note 13 Pro', 'Redmi Note 12 Pro', 'Redmi 12', 'POCO F5 Pro', 'POCO X5 Pro'],
        'Huawei': ['P60 Pro', 'P50 Pro', 'Mate 50 Pro', 'Mate 40 Pro', 'Nova 11', 'Nova 10', 'P40 Pro', 'P30 Pro'],
        'Oppo': ['Find X6 Pro', 'Find X5 Pro', 'Reno 10 Pro', 'Reno 9 Pro', 'A98 5G', 'A78 5G', 'A58'],
        'Vivo': ['X90 Pro', 'X80 Pro', 'V29 Pro', 'V27 Pro', 'Y100', 'Y36', 'Y27'],
        'Motorola': ['Edge 40 Pro', 'Edge 30 Ultra', 'Moto G73', 'Moto G53', 'Moto G23', 'Razr 40 Ultra', 'Razr 40']
      }
    },
    tablet: {
      name: 'Tablet',
      brands: {
        'Apple iPad': ['iPad Pro 12.9" M2', 'iPad Pro 11" M2', 'iPad Air 5th Gen', 'iPad 10th Gen', 'iPad 9th Gen', 'iPad mini 6th Gen'],
        'Samsung Galaxy Tab': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8', 'Galaxy Tab A8', 'Galaxy Tab A7 Lite'],
        'Microsoft Surface': ['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3', 'Surface Laptop Studio'],
        'Amazon Fire': ['Fire Max 11', 'Fire HD 10', 'Fire HD 8', 'Fire 7'],
        'Lenovo Tab': ['Tab P12 Pro', 'Tab P11 Plus', 'Tab M10 Plus', 'Tab M8'],
        'Huawei MatePad': ['MatePad Pro 12.6', 'MatePad Pro 11', 'MatePad 11', 'MatePad SE']
      }
    },
    monitor: {
      name: 'Monitor',
      brands: {
        'Dell': ['UltraSharp U2723QE', 'UltraSharp U2722DE', 'S3422DWG', 'S2722DZ', 'P2723QE', 'Alienware AW3423DW', 'Alienware AW2723DF'],
        'HP': ['E27 G5', 'E24 G5', 'Z27k G3', 'Z24f G3', 'Omen 27c', 'Omen 25i'],
        'ASUS': ['ProArt PA278QV', 'TUF Gaming VG27AQ', 'ROG Swift PG279QM', 'ROG Strix XG27AQ', 'ZenScreen MB16AC'],
        'LG': ['UltraGear 27GP950', 'UltraWide 34WP65C', '27UP850', '24UP550', 'C2 42" OLED'],
        'Samsung': ['Odyssey G9', 'Odyssey G7', 'M8 Smart Monitor', 'M7 Smart Monitor', 'CF398 Curved'],
        'Acer': ['Predator X27', 'Nitro XV272U', 'SB220Q', 'CB242Y', 'ConceptD CP3271K']
      }
    },
    printer: {
      name: 'Printer',
      brands: {
        'HP': ['LaserJet Pro M404n', 'LaserJet Pro M454dw', 'OfficeJet Pro 9015e', 'DeskJet 3755', 'Envy 6055e', 'PageWide Pro 477dw'],
        'Canon': ['PIXMA TS3522', 'PIXMA TR4720', 'imageCLASS MF445dw', 'MAXIFY GX7021', 'SELPHY CP1500'],
        'Epson': ['EcoTank ET-2850', 'EcoTank ET-4850', 'WorkForce Pro WF-4830', 'Expression Home XP-4200', 'SureColor P900'],
        'Brother': ['HL-L2350DW', 'MFC-L3770CDW', 'DCP-L2550DW', 'MFC-J995DW', 'QL-820NWB']
      }
    },
    other: {
      name: 'Other Electronics',
      brands: {
        'Gaming Console': ['PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox Series S', 'Xbox One', 'Nintendo Switch', 'Nintendo Switch Lite', 'Steam Deck'],
        'Smart TV': ['Samsung QLED', 'LG OLED', 'Sony Bravia', 'TCL 6-Series', 'Hisense U8G'],
        'Router': ['ASUS AX6000', 'Netgear Nighthawk', 'TP-Link Archer', 'Linksys Velop'],
        'Speaker': ['Sonos One', 'Amazon Echo', 'Google Nest', 'JBL Charge', 'Bose SoundLink'],
        'Camera': ['Canon EOS R5', 'Sony A7 IV', 'Nikon Z9', 'Fujifilm X-T5', 'GoPro Hero 12']
      }
    }
  };

  // Calculate estimated value based on device type, brand, model, condition, and quantity
  useEffect(() => {
    const calculateEstimatedValue = () => {
      if (!formData.deviceType || !formData.condition || !formData.quantity || !formData.brand) {
        setEstimatedValue(0);
        return;
      }

      // Base values for different device types (in INR)
      const baseValues: { [key: string]: number } = {
        laptop: 16000,  // ~$200 * 80 (approx INR conversion)
        desktop: 12000, // ~$150 * 80
        smartphone: 9600, // ~$120 * 80
        tablet: 8000,   // ~$100 * 80
        monitor: 4800,  // ~$60 * 80
        printer: 2800,  // ~$35 * 80
        other: 2400,    // ~$30 * 80
      };

      // Model-specific multipliers for premium/flagship models
      const getModelMultiplier = (deviceType: string, brand: string, model: string): number => {
        const modelLower = model.toLowerCase();
        const brandLower = brand.toLowerCase();
        
        switch (deviceType) {
          case 'laptop':
            // Apple MacBooks
            if (brandLower.includes('apple')) {
              if (modelLower.includes('m3') || modelLower.includes('m2')) return 2.2;
              if (modelLower.includes('m1')) return 1.9;
              if (modelLower.includes('pro 16') || modelLower.includes('pro 14')) return 2.0;
              if (modelLower.includes('air')) return 1.6;
              return 1.4;
            }
            // Gaming laptops
            if (modelLower.includes('rog') || modelLower.includes('predator') || modelLower.includes('alienware') || 
                modelLower.includes('razer') || modelLower.includes('msi')) return 1.7;
            // Business laptops
            if (modelLower.includes('thinkpad') || modelLower.includes('elitebook') || modelLower.includes('latitude')) return 1.4;
            // Premium consumer
            if (modelLower.includes('xps') || modelLower.includes('spectre') || modelLower.includes('zenbook')) return 1.5;
            return 1.0;
            
          case 'smartphone':
            if (brandLower.includes('apple')) {
              if (modelLower.includes('15 pro') || modelLower.includes('14 pro')) return 2.0;
              if (modelLower.includes('15') || modelLower.includes('14')) return 1.7;
              if (modelLower.includes('13 pro') || modelLower.includes('12 pro')) return 1.5;
              if (modelLower.includes('13') || modelLower.includes('12')) return 1.3;
              return 1.2;
            }
            if (brandLower.includes('samsung')) {
              if (modelLower.includes('s24 ultra') || modelLower.includes('s23 ultra')) return 1.6;
              if (modelLower.includes('s24') || modelLower.includes('s23')) return 1.4;
              if (modelLower.includes('fold') || modelLower.includes('flip')) return 1.5;
              return 1.1;
            }
            if (brandLower.includes('google')) {
              if (modelLower.includes('8 pro') || modelLower.includes('7 pro')) return 1.3;
              return 1.2;
            }
            return 1.0;
            
          case 'tablet':
            if (brandLower.includes('apple')) {
              if (modelLower.includes('pro 12.9') || modelLower.includes('pro 11')) return 1.9;
              if (modelLower.includes('air')) return 1.5;
              return 1.3;
            }
            if (brandLower.includes('surface')) {
              if (modelLower.includes('pro')) return 1.6;
              return 1.3;
            }
            return 1.0;
            
          case 'desktop':
            if (brandLower.includes('apple')) {
              if (modelLower.includes('studio') || modelLower.includes('pro')) return 2.2;
              if (modelLower.includes('imac')) return 1.8;
            }
            if (modelLower.includes('alienware') || modelLower.includes('predator')) return 1.6;
            if (modelLower.includes('gaming') || modelLower.includes('high-end')) return 1.4;
            return 1.0;
            
          default:
            return 1.0;
        }
      };

      // Brand multipliers (reduced since model multiplier is more specific)
      const getBrandMultiplier = (deviceType: string, brand: string): number => {
        const brandLower = brand.toLowerCase();
        
        switch (deviceType) {
          case 'laptop':
            if (brandLower.includes('apple')) return 1.2;
            if (brandLower.includes('razer') || brandLower.includes('alienware') || brandLower.includes('msi')) return 1.1;
            return 1.0;
            
          case 'smartphone':
            if (brandLower.includes('apple')) return 1.1;
            if (brandLower.includes('samsung') || brandLower.includes('google')) return 1.05;
            return 1.0;
            
          default:
            return 1.0;
        }
      };

      // Condition multipliers with more granular pricing
      const conditionMultipliers: { [key: string]: number } = {
        working: 1.0,
        'partially-working': 0.65,
        'not-working': 0.35,
        broken: 0.15,
      };

      // Age factor (assuming newer devices are worth more)
      const getAgeFactor = (deviceType: string, model: string): number => {
        const modelLower = model.toLowerCase();
        
        // Check for generation indicators
        if (modelLower.includes('m3') || modelLower.includes('15') || modelLower.includes('2024')) return 1.0;
        if (modelLower.includes('m2') || modelLower.includes('14') || modelLower.includes('2023')) return 0.9;
        if (modelLower.includes('m1') || modelLower.includes('13') || modelLower.includes('2022')) return 0.8;
        if (modelLower.includes('12') || modelLower.includes('2021')) return 0.7;
        if (modelLower.includes('11') || modelLower.includes('2020')) return 0.6;
        
        // Default age factors by device type
        switch (deviceType) {
          case 'laptop':
          case 'smartphone':
            return 0.75; // Tech depreciates faster
          case 'desktop':
          case 'tablet':
            return 0.85;
          case 'monitor':
          case 'printer':
            return 0.9; // Slower depreciation
          default:
            return 0.7;
        }
      };

      const baseValue = baseValues[formData.deviceType] || 2400;
      const brandMultiplier = getBrandMultiplier(formData.deviceType, formData.brand);
      const modelMultiplier = formData.model ? getModelMultiplier(formData.deviceType, formData.brand, formData.model) : 1.0;
      const conditionMultiplier = conditionMultipliers[formData.condition] || 0.15;
      const ageFactor = formData.model ? getAgeFactor(formData.deviceType, formData.model) : 0.8;
      const quantity = parseInt(formData.quantity) || 1;

      const estimated = baseValue * brandMultiplier * modelMultiplier * conditionMultiplier * ageFactor * quantity;
      setEstimatedValue(Math.round(estimated * 100) / 100); // Round to 2 decimal places
    };

    calculateEstimatedValue();
  }, [formData.deviceType, formData.brand, formData.model, formData.condition, formData.quantity]);

  return (
    <Layout userType="user">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Submit Pickup Request</h1>
          <p className="text-muted-foreground">Fill in the details below to schedule your e-waste pickup</p>
        </div>

        <div className="max-w-4xl">
          <Card className="border border-border shadow-sm">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Device Information */}
                <div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Device Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="deviceType" className="text-foreground">Device Type</label>
                      <select
                        id="deviceType"
                        name="deviceType"
                        value={formData.deviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                        required
                      >
                        <option value="">Select device type</option>
                        {Object.entries(deviceOptions).map(([key, device]) => (
                          <option key={key} value={key}>{device.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="brand" className="text-foreground">Brand</label>
                      <select
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                        required
                        disabled={!formData.deviceType}
                      >
                        <option value="">
                          {formData.deviceType ? 'Select brand' : 'Select device type first'}
                        </option>
                        {formData.deviceType && (() => {
                          const deviceData = deviceOptions[formData.deviceType as keyof typeof deviceOptions];
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
                      <label htmlFor="model" className="text-foreground">Model</label>
                      <select
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground"
                        required
                        disabled={!formData.brand}
                      >
                        <option value="">
                          {formData.brand ? 'Select model' : 'Select brand first'}
                        </option>
                        {formData.deviceType && formData.brand && (() => {
                          const deviceData = deviceOptions[formData.deviceType as keyof typeof deviceOptions];
                          if (deviceData && 'brands' in deviceData) {
                            const brands = deviceData.brands as Record<string, string[]>;
                            const models = brands[formData.brand];
                            return models?.map((model: string) => (
                              <option key={model} value={model}>{model}</option>
                            ));
                          }
                          return null;
                        })()}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="condition" className="text-foreground">Condition</label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
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
                      <label htmlFor="quantity" className="text-foreground">Quantity</label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="bg-input-background"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Estimated Value */}
                {estimatedValue > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h3 className="text-foreground mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Estimated Value (INR)
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold text-primary">₹{estimatedValue}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          For {formData.quantity} {formData.deviceType}(s)
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>This is an estimate only</p>
                        <p>Final value may vary</p>
                      </div>
                    </div>
                    
                    {/* Value Breakdown */}
                    <div className="border-t border-primary/20 pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Value factors:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>• Device: {deviceOptions[formData.deviceType as keyof typeof deviceOptions]?.name}</div>
                        <div>• Brand: {formData.brand}</div>
                        {formData.model && <div>• Model: {formData.model}</div>}
                        <div>• Condition: {formData.condition.replace('-', ' ')}</div>
                        <div>• Quantity: {formData.quantity}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Premium brands, newer models, and better conditions increase value
                      </p>
                    </div>
                  </div>
                )}

                {/* Pickup Information */}
                <div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Pickup Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="text-foreground">Pickup Address</label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter full pickup address"
                        value={formData.address}
                        onChange={handleChange}
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
                          value={formData.pickupDate}
                          onChange={handleChange}
                          className="pl-10 bg-input-background"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Image Upload */}
                <div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Device Images (Optional)
                  </h3>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                    <input type="file" className="hidden" accept="image/*" multiple />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6 border-t border-border">
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
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
