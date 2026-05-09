import { create } from 'zustand';
import {
  PaymentIntent,
  PaymentHistory,
  RefundRequest,
  DisputeCase,
  Invoice,
} from '../types/payment.types';
import * as paymentApi from '../api/paymentApi';

interface PaymentState {
  // Payment state
  currentPayment: PaymentIntent | null;
  payments: PaymentHistory[];
  invoices: Invoice[];
  refunds: RefundRequest[];
  disputes: DisputeCase[];
  
  // Loading states
  loading: boolean;
  paymentProcessing: boolean;
  
  // Error states
  error: string | null;
  paymentError: string | null;

  // Actions
  createPayment: (bookingId: string, amount: number, method: 'stripe' | 'paypal') => Promise<void>;
  confirmPayment: (paymentIntentId: string, details: any) => Promise<void>;
  fetchPaymentHistory: (userId: string) => Promise<void>;
  fetchInvoices: (userId: string) => Promise<void>;
  fetchRefunds: (userId: string) => Promise<void>;
  fetchDisputes: (userId: string) => Promise<void>;
  
  requestRefund: (paymentIntentId: string, reason: string, amount: number, description: string) => Promise<void>;
  reportDispute: (paymentIntentId: string, reason: string, description: string, evidence?: string[]) => Promise<void>;
  submitDisputeEvidence: (disputeId: string, evidence: string[]) => Promise<void>;
  
  setCurrentPayment: (payment: PaymentIntent | null) => void;
  setError: (error: string | null) => void;
  clearPaymentError: () => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Initial state
  currentPayment: null,
  payments: [],
  invoices: [],
  refunds: [],
  disputes: [],
  loading: false,
  paymentProcessing: false,
  error: null,
  paymentError: null,

  // Create Payment Intent
  createPayment: async (bookingId, amount, method) => {
    set({ paymentProcessing: true, paymentError: null });
    try {
      const payment = await paymentApi.createPaymentIntent(bookingId, amount, method);
      set({ currentPayment: payment, paymentProcessing: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create payment';
      set({ paymentError: errorMsg, paymentProcessing: false });
      throw error;
    }
  },

  // Confirm Payment
  confirmPayment: async (paymentIntentId, details) => {
    set({ paymentProcessing: true, paymentError: null });
    try {
      const payment = await paymentApi.confirmPayment(paymentIntentId, details);
      set({ currentPayment: payment, paymentProcessing: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment confirmation failed';
      set({ paymentError: errorMsg, paymentProcessing: false });
      throw error;
    }
  },

  // Fetch Payment History
  fetchPaymentHistory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const payments = await paymentApi.getPaymentHistory(userId);
      set({ payments, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch payment history';
      set({ error: errorMsg, loading: false });
    }
  },

  // Fetch Invoices
  fetchInvoices: async (userId) => {
    set({ loading: true, error: null });
    try {
      const invoices = await paymentApi.getUserInvoices(userId);
      set({ invoices, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch invoices';
      set({ error: errorMsg, loading: false });
    }
  },

  // Fetch Refunds
  fetchRefunds: async (userId) => {
    set({ loading: true, error: null });
    try {
      const refunds = await paymentApi.getUserRefunds(userId);
      set({ refunds, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch refunds';
      set({ error: errorMsg, loading: false });
    }
  },

  // Fetch Disputes
  fetchDisputes: async (userId) => {
    set({ loading: true, error: null });
    try {
      const disputes = await paymentApi.getUserDisputes(userId);
      set({ disputes, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch disputes';
      set({ error: errorMsg, loading: false });
    }
  },

  // Request Refund
  requestRefund: async (paymentIntentId, reason, amount, description) => {
    set({ loading: true, error: null });
    try {
      const refund = await paymentApi.requestRefund(
        paymentIntentId,
        reason,
        amount,
        description
      );
      const refunds = [...get().refunds, refund];
      set({ refunds, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to request refund';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Report Dispute
  reportDispute: async (paymentIntentId, reason, description, evidence) => {
    set({ loading: true, error: null });
    try {
      const dispute = await paymentApi.reportDispute(
        paymentIntentId,
        reason,
        description,
        evidence
      );
      const disputes = [...get().disputes, dispute];
      set({ disputes, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to report dispute';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Submit Dispute Evidence
  submitDisputeEvidence: async (disputeId, evidence) => {
    set({ loading: true, error: null });
    try {
      const updatedDispute = await paymentApi.submitDisputeEvidence(disputeId, evidence);
      const disputes = get().disputes.map(d => d.id === disputeId ? updatedDispute : d);
      set({ disputes, loading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit evidence';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Set Current Payment
  setCurrentPayment: (payment) => {
    set({ currentPayment: payment });
  },

  // Set Error
  setError: (error) => {
    set({ error });
  },

  // Clear Payment Error
  clearPaymentError: () => {
    set({ paymentError: null });
  },

  // Reset Store
  reset: () => {
    set({
      currentPayment: null,
      payments: [],
      invoices: [],
      refunds: [],
      disputes: [],
      loading: false,
      paymentProcessing: false,
      error: null,
      paymentError: null,
    });
  },
}));
