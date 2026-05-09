export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'contract_signed' | 'in_progress' | 'draft_delivered' | 'final_approval' | 'deployed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  date: string;
  timeSlot: string;
}
