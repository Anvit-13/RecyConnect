import api from './api';
import { PickupRequest } from './pickupService';

export interface Route {
  id: string;
  date: string;
  status: string;
  vehicle_id: string;
  stops: number;
}

export interface Collection {
  id: string;
  status: string;
  date: string;
  address: string;
  device_count: number;
  recycler_id?: string;
  user_name?: string;
}

export interface CollectorDashboardStats {
  todays_pickups: number;
  completed_today: number;
  completed_this_week: number;
  devices_collected: number;
}

class CollectorService {
  async getDashboardStats(): Promise<{ 
    success: boolean; 
    data: { 
      stats: CollectorDashboardStats,
      todayRoute: PickupRequest[],
      weeklyData: { day: string, count: number }[]
    }
  }> {
    const response = await api.get('/collector/dashboard/stats');
    return response.data;
  }

  async getRoutes(): Promise<{ success: boolean; data: { routes: Route[] } }> {
    const response = await api.get('/collector/routes');
    return response.data;
  }

  async getCollections(): Promise<{ success: boolean; data: { collections: Collection[] } }> {
    const response = await api.get('/collector/collections');
    return response.data;
  }

  async updateRouteStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
    const response = await api.patch(`/collector/routes/${id}/status`, { status });
    return response.data;
  }

  async getTodayStops(): Promise<{ success: boolean; data: { stops: any[] } }> {
    const response = await api.get('/collector/today-stops');
    return response.data;
  }

  async getRecyclers(): Promise<{ success: boolean; data: { recyclers: any[] } }> {
    const response = await api.get('/collector/recyclers');
    return response.data;
  }
}

export default new CollectorService();
