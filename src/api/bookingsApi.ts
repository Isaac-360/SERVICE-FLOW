import { supabase } from '../lib/supabaseClient';

export interface CreateBookingRequest {
  serviceId: string;
  clientId: string;
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
  totalPrice: number;
  packageId?: string;
  packageDetails?: any;
  briefingAnswers?: Record<string, any>;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientId: string;
  status: 'pending' | 'contract_signed' | 'in_progress' | 'draft_delivered' | 'final_approval' | 'deployed' | 'cancelled';
  totalPrice: number;
  scheduledDate: string;
  notes?: string;
  packageId?: string;
  packageDetails?: any;
  briefingAnswers?: Record<string, any>;
  createdAt: string;
}

export const createBooking = async (bookingData: CreateBookingRequest): Promise<Booking> => {
  try {
    // 1. Create the booking in Supabase (Status defaults to 'pending' from SQL)
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          service_id: bookingData.serviceId,
          client_id: bookingData.clientId,
          scheduled_date: bookingData.scheduledDate,
          total_price: bookingData.totalPrice,
          notes: `${bookingData.timeSlot} - ${bookingData.notes || ''}`,
          status: 'pending',
          package_id: bookingData.packageId,
          package_details: bookingData.packageDetails,
          briefing_answers: bookingData.briefingAnswers,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      serviceId: data.service_id,
      clientId: data.client_id,
      status: data.status,
      totalPrice: data.total_price,
      scheduledDate: data.scheduled_date,
      notes: data.notes,
      packageId: data.package_id,
      packageDetails: data.package_details,
      briefingAnswers: data.briefing_answers,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getMyBookings = async (userId: string, role: 'client' | 'business'): Promise<Booking[]> => {
  try {
    let query = supabase.from('bookings').select('*, services(*)');

    if (role === 'client') {
      query = query.eq('client_id', userId);
    } else {
      // For providers, we'd typically filter by services they own
      // This is a simplified version
      query = query.filter('service_id', 'in', `(SELECT id FROM services WHERE business_id = '${userId}')`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string, 
  status: Booking['status']
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};
