import { create } from 'zustand';
import {
  AdminService,
  CreateServiceRequest,
  ServiceStats,
} from '../types/admin.types';
import * as adminApi from '../api/adminApi';

interface AdminStore {
  // State
  services: AdminService[];
  selectedService: AdminService | null;
  stats: ServiceStats | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    status?: 'active' | 'inactive' | 'all';
    search?: string;
  };

  // Actions
  fetchServices: (businessId?: string) => Promise<void>;
  createService: (data: CreateServiceRequest) => Promise<AdminService>;
  updateService: (id: string, data: Partial<CreateServiceRequest>) => Promise<AdminService>;
  deleteService: (id: string) => Promise<void>;
  selectService: (service: AdminService | null) => void;
  toggleServiceStatus: (id: string, isActive: boolean) => Promise<void>;
  updateServiceStatus: (id: string, status: 'pending' | 'active' | 'rejected') => Promise<void>;
  fetchStats: (businessId?: string) => Promise<void>;
  setFilter: (filter: Partial<AdminStore['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  services: [],
  selectedService: null,
  stats: null,
  loading: false,
  error: null,
  filters: { status: 'all' },

  // Fetch all services
  fetchServices: async (businessId) => {
    set({ loading: true, error: null });
    try {
      const services = await adminApi.getAllServices(businessId);
      const filters = get().filters;
      
      let filtered = services;
      if (filters.category) {
        filtered = filtered.filter(s => s.category === filters.category);
      }
      if (filters.status === 'active') {
        filtered = filtered.filter(s => s.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(s => !s.isActive);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
        );
      }

      set({ services: filtered, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch services';
      set({ error: errorMsg, loading: false });
    }
  },

  // Create service
  createService: async (data) => {
    set({ loading: true, error: null });
    try {
      const service = await adminApi.createService(data);
      set((state) => ({
        services: [service, ...state.services],
        loading: false,
      }));
      return service;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create service';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Update service
  updateService: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const service = await adminApi.updateService(id, data);
      set((state) => ({
        services: state.services.map(s => s.id === id ? service : s),
        selectedService: state.selectedService?.id === id ? service : state.selectedService,
        loading: false,
      }));
      return service;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update service';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Delete service
  deleteService: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminApi.deleteService(id);
      set((state) => ({
        services: state.services.filter(s => s.id !== id),
        selectedService: state.selectedService?.id === id ? null : state.selectedService,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete service';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Select service
  selectService: (service) => {
    set({ selectedService: service });
  },

  // Toggle service status
  toggleServiceStatus: async (id, isActive) => {
    set({ loading: true, error: null });
    try {
      const service = await adminApi.toggleServiceStatus(id, isActive);
      set((state) => ({
        services: state.services.map(s => s.id === id ? service : s),
        selectedService: state.selectedService?.id === id ? service : state.selectedService,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to toggle status';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Update service status (approval flow)
  updateServiceStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await adminApi.updateServiceStatus(id, status);
      set((state) => ({
        services: state.services.map(s => 
          s.id === id ? { ...s, status, isActive: status === 'active' } : s
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update status';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Fetch stats
  fetchStats: async (businessId) => {
    try {
      const stats = await adminApi.getServiceStats(businessId);
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  // Set filter
  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
    get().fetchServices();
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      services: [],
      selectedService: null,
      stats: null,
      loading: false,
      error: null,
      filters: { status: 'all' },
    });
  },
}));
