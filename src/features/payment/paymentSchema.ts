import { z } from 'zod';

export const paymentMethodSchema = z.enum(['stripe', 'paypal', 'card']);

export const checkoutFormSchema = z.object({
  cardholderName: z.string().min(2, 'Cardholder name required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State/Province required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
  paymentMethod: z.enum(['stripe', 'paypal']),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to payment terms',
  }),
  savePaymentMethod: z.boolean().optional(),
});

export const refundRequestSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment ID required'),
  reason: z.enum([
    'service_not_provided',
    'service_quality_issue',
    'duplicate_charge',
    'unauthorized_transaction',
    'other',
  ]),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(10, 'Please provide details (min 10 characters)').max(500),
});

export const disputeReportSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment ID required'),
  reason: z.enum([
    'non_delivery',
    'quality_issue',
    'fraud',
    'unauthorized',
    'other',
  ]),
  description: z.string().min(20, 'Please provide detailed description (min 20 characters)').max(1000),
  evidence: z.array(z.string().url('Invalid file URL')).optional(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Price must be positive'),
});

export const invoiceSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID required'),
  serviceId: z.string().min(1, 'Service ID required'),
  serviceName: z.string().min(1, 'Service name required'),
  clientName: z.string().min(1, 'Client name required'),
  providerName: z.string().min(1, 'Provider name required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item required'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type RefundRequestData = z.infer<typeof refundRequestSchema>;
export type DisputeReportData = z.infer<typeof disputeReportSchema>;
export type InvoiceData = z.infer<typeof invoiceSchema>;
