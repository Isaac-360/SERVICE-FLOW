import axiosInstance from './axios';
import {
  PaymentIntent,
  Invoice,
  PaymentHistory,
  RefundRequest,
  DisputeCase,
  CheckoutSession,
  PaymentConfig,
} from '../types/payment.types';

const PAYMENT_API = '/api/payments';
const INVOICES_API = '/api/invoices';
const REFUNDS_API = '/api/refunds';
const DISPUTES_API = '/api/disputes';

// Payment Configuration
export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  // Mock configuration - replace with actual API call
  return {
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_demo',
    paypalClientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'demo_client_id',
    platformFeePercentage: 2.5,
    currency: 'USD',
  };
};

// Payment Intent Creation
export const createPaymentIntent = async (
  bookingId: string,
  amount: number,
  paymentMethod: 'stripe' | 'paypal'
): Promise<PaymentIntent> => {
  try {
    const response = await axiosInstance.post(`${PAYMENT_API}/intents`, {
      bookingId,
      amount,
      paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Confirm Payment
export const confirmPayment = async (
  paymentIntentId: string,
  paymentDetails: {
    token?: string; // For Stripe
    orderId?: string; // For PayPal
    cardholderName: string;
    email: string;
  }
): Promise<PaymentIntent> => {
  try {
    const response = await axiosInstance.post(`${PAYMENT_API}/confirm`, {
      paymentIntentId,
      ...paymentDetails,
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Get Payment by ID
export const getPayment = async (paymentIntentId: string): Promise<PaymentIntent> => {
  try {
    const response = await axiosInstance.get(`${PAYMENT_API}/${paymentIntentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

// Get Payment History
export const getPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  try {
    const response = await axiosInstance.get(`${PAYMENT_API}/history/${userId}`);
    // Simulate with mock data if needed
    return response.data || generateMockPaymentHistory(userId);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return generateMockPaymentHistory(userId);
  }
};

// Generate Invoice
export const generateInvoice = async (bookingId: string): Promise<Invoice> => {
  try {
    const response = await axiosInstance.post(`${INVOICES_API}/generate`, { bookingId });
    return response.data;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

// Get Invoice
export const getInvoice = async (invoiceId: string): Promise<Invoice> => {
  try {
    const response = await axiosInstance.get(`${INVOICES_API}/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

// Get All Invoices for User
export const getUserInvoices = async (userId: string): Promise<Invoice[]> => {
  try {
    const response = await axiosInstance.get(`${INVOICES_API}/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

// Download Invoice as PDF
export const downloadInvoicePDF = async (invoiceId: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`${INVOICES_API}/${invoiceId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Request Refund
export const requestRefund = async (
  paymentIntentId: string,
  reason: string,
  amount: number,
  description: string
): Promise<RefundRequest> => {
  try {
    const response = await axiosInstance.post(`${REFUNDS_API}/request`, {
      paymentIntentId,
      reason,
      amount,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error;
  }
};

// Get Refund Status
export const getRefundStatus = async (refundId: string): Promise<RefundRequest> => {
  try {
    const response = await axiosInstance.get(`${REFUNDS_API}/${refundId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching refund status:', error);
    throw error;
  }
};

// Get User Refunds
export const getUserRefunds = async (userId: string): Promise<RefundRequest[]> => {
  try {
    const response = await axiosInstance.get(`${REFUNDS_API}/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return [];
  }
};

// Report Dispute
export const reportDispute = async (
  paymentIntentId: string,
  reason: string,
  description: string,
  evidence?: string[]
): Promise<DisputeCase> => {
  try {
    const response = await axiosInstance.post(`${DISPUTES_API}/report`, {
      paymentIntentId,
      reason,
      description,
      evidence,
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting dispute:', error);
    throw error;
  }
};

// Get Dispute Details
export const getDispute = async (disputeId: string): Promise<DisputeCase> => {
  try {
    const response = await axiosInstance.get(`${DISPUTES_API}/${disputeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dispute:', error);
    throw error;
  }
};

// Get User Disputes
export const getUserDisputes = async (userId: string): Promise<DisputeCase[]> => {
  try {
    const response = await axiosInstance.get(`${DISPUTES_API}/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return [];
  }
};

// Submit Dispute Evidence
export const submitDisputeEvidence = async (
  disputeId: string,
  evidence: string[]
): Promise<DisputeCase> => {
  try {
    const response = await axiosInstance.post(`${DISPUTES_API}/${disputeId}/evidence`, {
      evidence,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting evidence:', error);
    throw error;
  }
};

// Mock Payment History Generation
function generateMockPaymentHistory(userId: string): PaymentHistory[] {
  const now = new Date();
  return [
    {
      id: 'ph_1',
      userId,
      paymentIntentId: 'pi_1',
      invoiceId: 'inv_1',
      amount: 450,
      fee: 11.25,
      netAmount: 438.75,
      paymentMethod: 'stripe',
      status: 'completed',
      description: 'Cybersecurity Audit',
      transactionDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      bookingDetails: {
        bookingId: 'b_1',
        serviceName: 'Cybersecurity Audit',
        providerName: 'Cipher Guard',
      },
    },
    {
      id: 'ph_2',
      userId,
      paymentIntentId: 'pi_2',
      invoiceId: 'inv_2',
      amount: 150,
      fee: 3.75,
      netAmount: 146.25,
      paymentMethod: 'paypal',
      status: 'completed',
      description: 'Elite Home Automation',
      transactionDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      bookingDetails: {
        bookingId: 'b_2',
        serviceName: 'Elite Home Automation',
        providerName: 'Aether Systems',
      },
    },
  ];
}
