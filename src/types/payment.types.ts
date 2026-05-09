export type PaymentMethod = 'stripe' | 'paypal' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  paymentIntentId: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  providerName: string;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
  issuedDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  paymentIntentId: string;
  invoiceId: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description: string;
  transactionDate: string;
  bookingDetails?: {
    bookingId: string;
    serviceName: string;
    providerName: string;
  };
}

export interface RefundRequest {
  id: string;
  paymentIntentId: string;
  reason: string;
  amount: number;
  description: string;
  status: RefundStatus;
  requestedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface DisputeCase {
  id: string;
  paymentIntentId: string;
  claimantId: string;
  respondentId: string;
  reason: string;
  description: string;
  evidence: string[];
  status: 'open' | 'under_review' | 'resolved' | 'appealed';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface PaymentConfig {
  stripePublicKey: string;
  paypalClientId: string;
  platformFeePercentage: number;
  currency: string;
}

export interface CheckoutSession {
  sessionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  clientEmail: string;
  clientName: string;
  serviceName: string;
  status: 'initiated' | 'completed' | 'cancelled' | 'expired';
}
