import api from './api';

export interface Device {
  id?: string;
  deviceType?: string;       // camelCase (sent by frontend)
  device_type?: string;      // snake_case (returned by backend)
  brand: string;
  model: string;
  condition: 'working' | 'partially-working' | 'not-working' | 'broken';
  quantity: string | number;
  estimated_value?: number;
}

export interface PickupRequest {
  id?: string;
  user_id?: string;
  devices?: Device[];
  address?: string;
  pickupDate?: string;       // camelCase (sent by frontend)
  pickup_date?: string;      // snake_case (returned by backend)
  status?: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  total_estimated_value?: number | string;
  collector_id?: string;
  recycler_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
  user_email?: string;
  collector_name?: string;
  recycler_name?: string;
  device_count?: number | string;
}

class PickupService {
  async createPickupRequest(formData: FormData): Promise<{ success: boolean; data: { pickupRequest: PickupRequest; devices: Device[] }; message: string }> {
    const response = await api.post('/pickups', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getUserPickupRequests(): Promise<{ success: boolean; data: { pickupRequests: PickupRequest[] } }> {
    const response = await api.get('/pickups/my-requests');
    return response.data;
  }

  async getAllPickupRequests(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      pickupRequests: PickupRequest[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await api.get('/pickups/all', { params });
    return response.data;
  }

  async getPickupRequestById(id: string): Promise<{ success: boolean; data: { pickupRequest: PickupRequest } }> {
    const response = await api.get(`/pickups/${id}`);
    return response.data;
  }

  async updatePickupStatus(
    id: string,
    data: {
      status?: string;
      collectorId?: string;
      recyclerId?: string;
      notes?: string;
    }
  ): Promise<{ success: boolean; data: { pickupRequest: PickupRequest }; message: string }> {
    const response = await api.put(`/pickups/${id}`, data);
    return response.data;
  }

  async deletePickupRequest(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/pickups/${id}`);
    return response.data;
  }
}

export default new PickupService();
