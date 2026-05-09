export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  packages?: any[]; // Using any for now to match the admin.types.ts structure
  briefingQuestions?: any[];
  businessId: string;
  businessName: string;
  location: string;
}

export type Category = 'All' | 'Technology' | 'Design' | 'Security' | 'Events' | 'Logistics' | 'Legal';

export interface ServiceFilter {
  category?: Category;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
