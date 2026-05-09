import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabaseClient';
import {
  AdminService,
  CreateServiceRequest,
  ServiceStats,
} from '../types/admin.types';

// Helper to map DB snake_case to UI camelCase
const mapServiceFromDb = (s: any): AdminService => ({
  id: s.id,
  title: s.title,
  description: s.description,
  category: s.category,
  basePrice: s.base_price,
  contact: s.contact,
  locations: s.locations,
  businessId: s.business_id,
  businessName: s.business_name,
  image: s.image,
  rating: s.rating,
  reviewCount: s.review_count,
  isActive: s.is_active,
  status: s.status,
  createdAt: s.created_at,
  updatedAt: s.updated_at,
  gallery: s.gallery,
  videoUrl: s.video_url,
  packages: s.packages,
  briefingQuestions: s.briefing_questions,
  tags: s.tags,
  serviceDetails: s.service_details,
});

// Helper to map UI camelCase to DB snake_case
const mapServiceToDb = (s: any) => ({
  title: s.title,
  description: s.description,
  category: s.category,
  base_price: s.basePrice,
  contact: s.contact,
  locations: s.locations,
  business_id: s.businessId,
  business_name: s.businessName,
  image: s.image,
  is_active: s.isActive,
  tags: s.tags,
  status: s.status,
  gallery: s.gallery,
  video_url: s.videoUrl,
  packages: s.packages,
  briefing_questions: s.briefingQuestions,
  service_details: s.serviceDetails,
});

export const createService = async (serviceData: CreateServiceRequest): Promise<AdminService> => {
  try {
    const dbData = mapServiceToDb(serviceData);
    const { data, error } = await supabase
      .from('services')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return mapServiceFromDb(data);
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (
  serviceId: string,
  serviceData: Partial<CreateServiceRequest>
): Promise<AdminService> => {
  try {
    const dbData = mapServiceToDb(serviceData);
    const { data, error } = await supabase
      .from('services')
      .update(dbData)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return mapServiceFromDb(data);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const getService = async (serviceId: string): Promise<AdminService> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) throw error;
    return mapServiceFromDb(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const getAllServices = async (businessId?: string): Promise<AdminService[]> => {
  try {
    let query = supabase.from('services').select('*');
    
    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data ? data.map(mapServiceFromDb) : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const toggleServiceStatus = async (
  serviceId: string,
  isActive: boolean
): Promise<AdminService> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({ is_active: isActive })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return mapServiceFromDb(data);
  } catch (error) {
    console.error('Error toggling service status:', error);
    throw error;
  }
};

export const getServiceStats = async (businessId?: string): Promise<ServiceStats> => {
  try {
    // 1. Total Services
    let totalQuery = supabase.from('services').select('*', { count: 'exact', head: true });
    if (businessId) totalQuery = totalQuery.eq('business_id', businessId);
    const { count: totalServices } = await totalQuery;

    // 2. Active Services
    let activeQuery = supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true);
    if (businessId) activeQuery = activeQuery.eq('business_id', businessId);
    const { count: activeServices } = await activeQuery;

    // 3. Revenue Calculation
    let revenueQuery = supabase.from('bookings').select('total_price').not('status', 'in', '("pending", "cancelled")');
    if (businessId) {
      // For merchants, we need to join with services to filter by their ID
      // Simplified: if we have businessId, we fetch bookings for their services
      const { data: merchantServices } = await supabase.from('services').select('id').eq('business_id', businessId);
      const serviceIds = merchantServices?.map(s => s.id) || [];
      revenueQuery = revenueQuery.in('service_id', serviceIds);
    }
    const { data: revenueData } = await revenueQuery;
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

    // 4. User Stats (Global Only)
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalMerchants } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'business');

    return {
      totalServices: totalServices || 0,
      activeServices: activeServices || 0,
      inactiveServices: (totalServices || 0) - (activeServices || 0),
      totalRevenue: totalRevenue,
      averageRating: 4.8,
      topService: null,
      totalUsers: totalUsers || 0,
      totalMerchants: totalMerchants || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalServices: 0,
      activeServices: 0,
      inactiveServices: 0,
      totalRevenue: 0,
      averageRating: 0,
      topService: null,
      totalUsers: 0,
      totalMerchants: 0
    };
  }
};

export const uploadServiceImage = async (file: File): Promise<{ url: string }> => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    const compressedFile = await imageCompression(file, options);
    const fileExt = 'webp';
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `service-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, compressedFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error) {
    console.error('Error uploading compressed image:', error);
    throw error;
  }
};
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadServiceImage(file));
  const results = await Promise.all(uploadPromises);
  return results.map(res => res.url);
};

export const updateServiceStatus = async (
  serviceId: string,
  status: 'pending' | 'active' | 'rejected'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('services')
      .update({ 
        status,
        is_active: status === 'active'
      })
      .eq('id', serviceId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};
