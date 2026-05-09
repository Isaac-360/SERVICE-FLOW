import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  totalBookings: number;
  activeServices: number;
  completedBookings: number;
  avgRating: number;
  walletBalance: number;
  
  // Actions
  addBooking: () => void;
  completeBooking: () => void;
  cancelBooking: () => void;
  updateRating: (newRating: number) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      totalBookings: 12,
      activeServices: 3,
      completedBookings: 8,
      avgRating: 4.9,
      walletBalance: 240.00,

      addBooking: () => set((state) => ({ 
        totalBookings: state.totalBookings + 1,
        activeServices: state.activeServices + 1 
      })),

      completeBooking: () => set((state) => ({ 
        activeServices: Math.max(0, state.activeServices - 1),
        completedBookings: state.completedBookings + 1 
      })),

      cancelBooking: () => set((state) => ({ 
        activeServices: Math.max(0, state.activeServices - 1),
        totalBookings: Math.max(0, state.totalBookings - 1)
      })),

      updateRating: (newRating: number) => set((state) => ({
        avgRating: Number(((state.avgRating * state.completedBookings + newRating) / (state.completedBookings + 1)).toFixed(1))
      })),
    }),
    {
      name: 'serviceflow-dashboard-storage',
    }
  )
);
