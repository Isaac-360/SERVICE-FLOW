export interface ServiceContact {
  phone: string;
  email: string;
  website?: string;
}

export interface ServiceLocation {
  region: string;
  regionId: string;
  city: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ServicePackage {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  features: string[];
}

export interface AdminService {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  packages?: ServicePackage[];
  briefingQuestions?: any[];
  contact: ServiceContact;
  locations: ServiceLocation[];
  businessId: string;
  businessName: string;
  image: string;
  gallery?: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  serviceDetails?: {
    availability?: string;
    responseTime?: string;
    warranty?: string;
    deliveryMethod?: string[];
  };
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  basePrice: number;
  businessId: string;
  businessName: string;
  contact: ServiceContact;
  locations: ServiceLocation[];
  image: string;
  gallery?: string[];
  videoUrl?: string;
  packages?: ServicePackage[];
  briefingQuestions?: any[];
  tags?: string[];
  serviceDetails?: AdminService['serviceDetails'];
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalRevenue: number;
  averageRating: number;
  topService: AdminService | null;
  totalUsers: number;
  totalMerchants: number;
}
