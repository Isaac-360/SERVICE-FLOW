import { Service, Category } from '../types/service.types';
import { supabase } from '../lib/supabaseClient';

export const getServices = async (category?: Category, search?: string): Promise<Service[]> => {
  try {
    let query = supabase
      .from('services')
      .select('*')
      .eq('status', 'active');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data) return [];

    return data.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      price: s.base_price,
      category: s.category,
      rating: s.rating,
      reviewCount: s.review_count,
      image: s.image,
      businessId: s.business_id,
      businessName: s.business_name,
      gallery: s.gallery,
      videoUrl: s.video_url,
      packages: s.packages,
      briefingQuestions: s.briefing_questions,
      location: Array.isArray(s.locations) && s.locations.length > 0 ? s.locations[0]?.city : 'Global'
    }));
  } catch (error) {
    console.error('Error fetching marketplace services:', error);
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | undefined> => {
  try {
    // Basic validation to avoid sending non-UUIDs to Supabase
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
       console.warn('Invalid UUID format provided to getServiceById:', id);
       return undefined;
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return undefined;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.base_price,
      category: data.category,
      rating: data.rating,
      reviewCount: data.review_count,
      image: data.image,
      businessId: data.business_id,
      businessName: data.business_name,
      gallery: data.gallery,
      videoUrl: data.video_url,
      packages: data.packages,
      briefingQuestions: data.briefing_questions,
      location: Array.isArray(data.locations) && data.locations.length > 0 ? data.locations[0]?.city : 'Global'
    };
  } catch (error) {
    console.error('Error fetching service detail:', error);
    return undefined;
  }
};
