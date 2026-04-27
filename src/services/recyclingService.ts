import api from './api';
import { PickupRequest } from './pickupService';

export interface RecyclingRecord {
  id: string;
  material_type: string;
  weight_kg: string;
  value_usd: string;
  processed_date: string;
  pickup_id?: string;
  recycler_name?: string;
}

export interface MaterialStat {
  name: string;
  batches: number;
  weight: number;
  value: number;
  color: string;
}

export interface MonthlyRecovery {
  month: string;
  electronics: number;
  batteries: number;
  metals: number;
  plastics: number;
}

class RecyclingService {
  async getDashboardStats(): Promise<{ 
    success: boolean; 
    data: { 
      stats: { total_processed: number, processing: number, materials_recovered: string, value_generated: string },
      processingQueue: PickupRequest[],
      weeklyData: { day: string, amount: string }[]
    }
  }> {
    const response = await api.get('/recycling/dashboard/stats');
    return response.data;
  }

  async getRecords(): Promise<{ success: boolean; data: { records: RecyclingRecord[] } }> {
    const response = await api.get('/recycling/records');
    return response.data;
  }

  async getMaterials(): Promise<{ success: boolean; data: { materialStats: MaterialStat[], monthlyRecovery: MonthlyRecovery[] } }> {
    const response = await api.get('/recycling/materials');
    return response.data;
  }

  async createRecord(data: { pickupId: string, materialType: string, weight: number, value: number }): Promise<{ success: boolean }> {
    const response = await api.post('/recycling/records', data);
    return response.data;
  }
}

export default new RecyclingService();
