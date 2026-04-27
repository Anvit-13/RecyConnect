import api from './api';
import { User } from './authService';

export interface InactiveUser extends User {
  inactive_days: number;
  total_requests: number;
}

export interface DashboardStats {
  total_users: number;
  total_customers: number;
  total_collectors: number;
  total_recyclers: number;
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  total_value_recycled: number;
}

export interface MonthlyTrend {
  month: string;
  requests: number;
  completed: number;
  pending: number;
}

export interface DeviceDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RecyclingStat {
  category: string;
  weight: number;
  color: string;
}

class AdminService {
  async getAllUsers(params?: {
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }

  async getInactiveUsers(days: number = 90): Promise<{ success: boolean; data: { inactiveUsers: InactiveUser[] } }> {
    const response = await api.get('/admin/users/inactive', { params: { days } });
    return response.data;
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }

  async toggleUserStatus(id: string): Promise<{ success: boolean; data: { user: User }; message: string }> {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<{ success: boolean; data: { user: User }; message: string }> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data: { user: User }; message: string }> {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  async getDashboardStats(): Promise<{ 
    success: boolean; 
    data: { 
      stats: DashboardStats,
      monthlyRequests: MonthlyTrend[],
      deviceTypes: DeviceDistribution[],
      recyclingStats: RecyclingStat[]
    }
  }> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }
}

export default new AdminService();
