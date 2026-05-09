import { z } from 'zod';

const categories = [
  'Technology',
  'Design',
  'Security',
  'Events',
  'Logistics',
  'Legal',
  'Marketing',
  'Consulting',
  'Health',
  'Education',
];

export const serviceContactSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  website: z.string().url('Valid URL required').optional().or(z.literal('')),
});

export const serviceLocationSchema = z.object({
  region: z.string().min(1, 'Region required'),
  regionId: z.string().min(1, 'Region ID required'),
  city: z.string().min(1, 'City required'),
  address: z.string().optional(),
});

export const servicePackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Package name required'),
  description: z.string().min(10, 'Description required'),
  price: z.number().positive('Price must be positive'),
  duration: z.string().optional(),
  features: z.array(z.string()).min(1, 'At least one feature required'),
});

export const createServiceSchema = z.object({
  title: z.string().min(3, 'Service title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(categories as [string, ...string[]]),
  basePrice: z.number().positive('Price must be positive'),
  contact: serviceContactSchema,
  locations: z.array(serviceLocationSchema).min(1, 'At least one location required'),
  image: z.string().url('Valid image URL required'),
  gallery: z.array(z.string().url()).optional(),
  videoUrl: z.string().url('Valid video URL required').optional().or(z.literal('')),
  packages: z.array(servicePackageSchema).optional(),
  briefingQuestions: z.array(z.object({
    id: z.string().optional(),
    question: z.string().min(5, 'Question too short'),
    type: z.enum(['text', 'textarea', 'select', 'file']),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().min(1, 'Service ID required'),
});

export type ServiceContactData = z.infer<typeof serviceContactSchema>;
export type ServiceLocationData = z.infer<typeof serviceLocationSchema>;
export type ServicePackageData = z.infer<typeof servicePackageSchema>;
export type CreateServiceData = z.infer<typeof createServiceSchema>;
export type UpdateServiceData = z.infer<typeof updateServiceSchema>;
