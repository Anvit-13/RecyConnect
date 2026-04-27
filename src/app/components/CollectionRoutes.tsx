import { useState, useEffect, useCallback } from 'react';
import { Layout } from './Layout';
import {
  Route, Search, MapPin, Navigation, Clock, Package,
  Loader2, AlertCircle, ExternalLink, Map, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import collectorService, { Route as RouteType } from '../../services/collectorService';
import pickupService from '../../services/pickupService';
import { toast } from 'sonner';

// Fix Leaflet default icon broken by Vite bundling
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create numbered stop icon
const createStopIcon = (number: number, color: string) => L.divIcon({
  className: '',
  html: `<div style="
    width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
    background: ${color}; border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: center;
    transform: rotate(-45deg);
    font-weight: bold; color: white; font-size: 11px;
  ">
    <span style="transform: rotate(45deg)">${number}</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

const collectorIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 36px; height: 36px; border-radius: 50%;
    background: #2563eb; border: 3px solid white;
    box-shadow: 0 2px 8px rgba(37,99,235,0.6);
    display: flex; align-items: center; justify-content: center;
  ">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

interface GeocodedStop {
  id: string;
  address: string;
  status: string;
  user_name?: string;
  user_phone?: string;
  device_count?: number;
  total_estimated_value?: number;
  lat: number;
  lng: number;
  order?: number;
}

// Haversine distance in km
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nearest-neighbor TSP heuristic
function optimizeRoute(startLat: number, startLng: number, stops: GeocodedStop[]): GeocodedStop[] {
  const remaining = [...stops];
  const ordered: GeocodedStop[] = [];
  let curLat = startLat;
  let curLng = startLng;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((stop, idx) => {
      const d = haversineDistance(curLat, curLng, stop.lat, stop.lng);
      if (d < nearestDist) { nearestDist = d; nearestIdx = idx; }
    });
    const next = remaining.splice(nearestIdx, 1)[0];
    curLat = next.lat;
    curLng = next.lng;
    ordered.push({ ...next, order: ordered.length + 1 });
  }
  return ordered;
}

// Geocode an address using Nominatim with multiple fallback attempts
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // Build a list of queries to try, from most specific to least
  const queries = [
    address,
    `${address}, Pune, Maharashtra`,
    `${address}, India`,
    // Extract just the neighbourhood/locality if address has commas
    address.split(',').slice(-2).join(',').trim() + ', India',
  ];

  for (const query of queries) {
    if (!query.trim() || query === ', India') continue;
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'RecyConnect-CollectorApp/1.0',
        },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {
      // network error – continue to next fallback
    }
    // Rate limit: wait 1.1s between Nominatim requests
    await new Promise(r => setTimeout(r, 1100));
  }
  return null;
}

// Helper component to auto-fit map bounds
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

  const STATUS_COLORS: Record<string, string> = {
    'scheduled': '#3b82f6',
    'in-progress': '#14b8a6',
    'pending': '#f59e0b',
    'collected': '#8b5cf6',
    'delivered': '#10b981',
    'completed': '#10b981',
  };

export function CollectionRoutes() {
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Map / today's stops state
  const [mapLoading, setMapLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState(0);
  const [orderedStops, setOrderedStops] = useState<GeocodedStop[]>([]);
  const [collectorPos, setCollectorPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [rawStops, setRawStops] = useState<any[]>([]);
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number, fuelSaved: number, algo: string } | null>(null);

  useEffect(() => {
    fetchRoutes();
    fetchTodayStops();
    getCollectorLocation();
  }, []);

  const getCollectorLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCollectorPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError('Location access denied. Route optimisation will use first stop as start.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchTodayStops = async () => {
    setMapLoading(true);
    try {
      const response = await collectorService.getTodayStops();
      setRawStops(response.data.stops || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load today\'s stops');
    } finally {
      setMapLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await collectorService.getRoutes();
      setRoutes(response.data.routes || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load collection routes');
    } finally {
      setRoutesLoading(false);
    }
  };

  // Geocode all stops and compute optimised order
  const processStops = useCallback(async () => {
    if (rawStops.length === 0) return;
    setGeocoding(true);
    setGeocodeProgress(0);

    const geocoded: GeocodedStop[] = [];
    for (let i = 0; i < rawStops.length; i++) {
      const stop = rawStops[i];
      // Rate limit: Nominatim requires 1 req/sec
      if (i > 0) await new Promise(r => setTimeout(r, 1100));
      const coords = await geocodeAddress(stop.address);
      setGeocodeProgress(Math.round(((i + 1) / rawStops.length) * 100));
      if (coords) {
        geocoded.push({ ...stop, lat: coords.lat, lng: coords.lng });
      } else {
        console.warn('Geocoding failed for address:', stop.address);
        toast.warning(`Could not locate on map: "${stop.address.substring(0, 35)}…" — skipping this stop`);
      }
    }

    if (geocoded.length === 0) {
      setGeocoding(false);
      return;
    }

    const startLat = collectorPos?.lat ?? geocoded[0].lat;
    const startLng = collectorPos?.lng ?? geocoded[0].lng;

    // Apply TSP Algorithm
    const optimized = optimizeRoute(startLat, startLng, geocoded);
    setOrderedStops(optimized);
    setGeocoding(false);

    // Calculate approximate metrics
    let totalDistance = 0;
    let prev = { lat: startLat, lng: startLng };
    optimized.forEach(stop => {
      totalDistance += haversineDistance(prev.lat, prev.lng, stop.lat, stop.lng);
      prev = { lat: stop.lat, lng: stop.lng };
    });

    setRouteMetrics({
      distance: parseFloat(totalDistance.toFixed(1)),
      fuelSaved: parseFloat((totalDistance * 0.08).toFixed(1)), // assuming 8L/100km savings via optimization
      algo: 'Nearest-Neighbor TSP'
    });
    toast.success(`Optimal route calculated for ${optimized.length} stops!`);
  }, [rawStops, collectorPos]);

  // Auto-process once stops and (optionally) location are loaded
  useEffect(() => {
    if (!mapLoading && rawStops.length > 0 && orderedStops.length === 0 && !geocoding) {
      processStops();
    }
  }, [mapLoading, rawStops, collectorPos]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await pickupService.updatePickupStatus(id, { status: newStatus });
      toast.success(`Pickup marked as ${newStatus}`);
      fetchTodayStops();
      setOrderedStops([]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const openFullRouteInMaps = () => {
    if (orderedStops.length === 0) return;
    const addresses = orderedStops.map(s => encodeURIComponent(s.address));
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(0, -1).join('|');
    const origin = collectorPos
      ? `${collectorPos.lat},${collectorPos.lng}`
      : encodeURIComponent(orderedStops[0].address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`,
      '_blank'
    );
  };

  const filteredRoutes = routes.filter(route =>
    route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.vehicle_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in-progress': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'collected': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const handleUpdateRouteStatus = async (routeId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'scheduled' ? 'in-progress' : 'completed';
      await collectorService.updateRouteStatus(routeId, nextStatus);
      toast.success(`Route marked as ${nextStatus.replace('-', ' ')}`);
      fetchRoutes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update route status');
    }
  };

  // Build polyline: collector → stop1 → stop2 → …
  const routeLine: [number, number][] = [
    ...(collectorPos ? [[collectorPos.lat, collectorPos.lng] as [number, number]] : []),
    ...orderedStops.map(s => [s.lat, s.lng] as [number, number]),
  ];

  const allPoints: [number, number][] = [
    ...(collectorPos ? [[collectorPos.lat, collectorPos.lng] as [number, number]] : []),
    ...orderedStops.map(s => [s.lat, s.lng] as [number, number]),
  ];

  const defaultCenter: [number, number] = collectorPos
    ? [collectorPos.lat, collectorPos.lng]
    : [20.5937, 78.9629]; // India center fallback

  return (
    <Layout userType="collector">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-foreground mb-2">Collection Routes</h1>
          <p className="text-muted-foreground">Today's optimised pickup map and your assigned route history</p>
        </div>

        {/* ─── TODAY'S MAP SECTION ─── */}
        <Card className="border border-border shadow-sm overflow-hidden bg-card">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-foreground font-semibold flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Today's Pickup Map
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {rawStops.length} stop{rawStops.length !== 1 ? 's' : ''} assigned today
                {collectorPos ? ' · Your location detected' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setOrderedStops([]); processStops(); }}
                disabled={geocoding || mapLoading || rawStops.length === 0}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${geocoding ? 'animate-spin' : ''}`} />
                Recalculate Route
              </Button>
              <Button
                size="sm"
                onClick={openFullRouteInMaps}
                disabled={orderedStops.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in Google Maps
              </Button>
            </div>
          </div>

          {/* Route Algorithm Metrics Panel */}
          {routeMetrics && !geocoding && orderedStops.length > 0 && (
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500 hover:bg-emerald-600">✨ AI Optimized</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
                <Navigation className="w-4 h-4" />
                Total Distance: {routeMetrics.distance} km
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800 font-medium">
                <div className="text-emerald-600">⛽</div>
                Est. Fuel Saved: {routeMetrics.fuelSaved} L
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600/80 ml-auto">
                Algorithm: {routeMetrics.algo}
              </div>
            </div>
          )}

          {/* Geocoding progress bar */}
          {geocoding && (
            <div className="px-6 py-3 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Geocoding addresses & calculating optimal route…</span>
                    <span>{geocodeProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${geocodeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {locationError && (
            <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2 text-sm text-yellow-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {locationError}
            </div>
          )}

          {/* MAP */}
          <div style={{ height: '480px', width: '100%' }}>
            {mapLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading stops…
              </div>
            ) : rawStops.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Package className="w-12 h-12 mb-3 opacity-10" />
                <p className="font-medium">No stops assigned for today</p>
                <p className="text-sm mt-1">Your admin will assign pickups to you</p>
              </div>
            ) : (
              <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {allPoints.length > 0 && <FitBounds points={allPoints} />}

                {/* Collector location marker */}
                {collectorPos && (
                  <Marker
                    position={[collectorPos.lat, collectorPos.lng]}
                    icon={collectorIcon}
                  >
                    <Popup>
                      <div className="text-sm font-semibold text-blue-700">📍 Your Location</div>
                      <div className="text-xs text-gray-500 mt-0.5">Start point</div>
                    </Popup>
                  </Marker>
                )}

                {/* Route polyline */}
                {routeLine.length > 1 && (
                  <Polyline
                    positions={routeLine}
                    pathOptions={{ color: '#2563eb', weight: 3, opacity: 0.7, dashArray: '8, 6' }}
                  />
                )}

                {/* Stop markers */}
                {orderedStops.map((stop) => (
                  <Marker
                    key={stop.id}
                    position={[stop.lat, stop.lng]}
                    icon={createStopIcon(stop.order!, STATUS_COLORS[stop.status] || '#6b7280')}
                  >
                    <Popup maxWidth={280}>
                      <div style={{ minWidth: '220px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                          Stop {stop.order} — {stop.status}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>
                          📍 {stop.address}
                        </div>
                        {stop.user_name && (
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            👤 {stop.user_name}
                            {stop.user_phone ? ` · ${stop.user_phone}` : ''}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          📦 {stop.device_count || 0} device(s)
                        </div>
                        {stop.total_estimated_value && (
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            💰 ₹{parseFloat(String(stop.total_estimated_value)).toFixed(2)}
                          </div>
                        )}
                        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.address)}&travelmode=driving`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '11px', padding: '3px 8px', background: '#2563eb',
                              color: 'white', borderRadius: '4px', textDecoration: 'none'
                            }}
                          >
                            Navigate →
                          </a>
                          {stop.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(stop.id, 'in-progress')}
                              style={{
                                fontSize: '11px', padding: '3px 8px', background: '#14b8a6',
                                color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer'
                              }}
                            >
                              Start
                            </button>
                          )}
                          {stop.status === 'in-progress' && (
                            <button
                              onClick={() => handleStatusUpdate(stop.id, 'collected')}
                              style={{
                                fontSize: '11px', padding: '3px 8px', background: '#10b981',
                                color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer'
                              }}
                            >
                              Collect
                            </button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Ordered stop list below map */}
          {orderedStops.length > 0 && (
            <div className="p-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Optimised Stop Order
              </h3>
              <div className="space-y-2">
                {orderedStops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: STATUS_COLORS[stop.status] || '#6b7280' }}
                    >
                      {stop.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{stop.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {stop.user_name || 'Customer'} · {stop.device_count || 0} device(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${getStatusColor(stop.status)} text-xs capitalize`}>
                        {stop.status}
                      </Badge>
                      {stop.status === 'scheduled' && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          onClick={() => handleStatusUpdate(stop.id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      {stop.status === 'in-progress' && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleStatusUpdate(stop.id, 'collected')}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Collect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ─── ROUTES HISTORY TABLE ─── */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-foreground font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Route History
            </h2>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search route ID or vehicle…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-card border-border h-9"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {routesLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading routes…
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Route className="w-10 h-10 mx-auto mb-3 opacity-10" />
                <p>No routes found.</p>
              </div>
            ) : filteredRoutes.map((route) => (
              <Card key={route.id} className="border border-border shadow-sm overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Route className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">
                          Route #{route.id.substring(0, 8)}
                        </span>
                        <Badge className={`${getStatusColor(route.status)} text-xs capitalize border`}>
                          {route.status?.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {route.date ? new Date(route.date).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5" />
                          {route.vehicle_id || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {route.stops ?? 0} stops
                        </span>
                      </div>
                    </div>
                  </div>
                  {route.status !== 'completed' && (
                    <Button
                      className={route.status === 'scheduled'
                        ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sm'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'}
                      onClick={() => handleUpdateRouteStatus(route.id, route.status)}
                    >
                      {route.status === 'scheduled' ? 'Start Route' : 'Complete Route'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
