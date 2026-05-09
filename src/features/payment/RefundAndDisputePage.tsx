import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { refundRequestSchema, RefundRequestData } from './paymentSchema';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { RefundRequest } from '../../types/payment.types';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RefundAndDisputePage() {
  const { refunds, loading, requestRefund, fetchRefunds } = usePaymentStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('history');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<RefundRequestData>({
    resolver: zodResolver(refundRequestSchema),
  });

  useEffect(() => {
    if (user?.id) {
      fetchRefunds(user.id);
    }
  }, [user?.id, fetchRefunds]);

  const onSubmit = async (data: RefundRequestData) => {
    setIsSubmitting(true);
    try {
      await requestRefund(
        data.paymentIntentId,
        data.reason,
        data.amount,
        data.description
      );
      toast.success('Refund request submitted successfully');
      resetForm();
      setActiveTab('history');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit refund request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-800';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'rejected':
        return 'bg-red-50 text-red-800';
      case 'completed':
        return 'bg-blue-50 text-blue-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Refunds & Disputes</h1>
        <p className="text-gray-600">Manage your refund requests and dispute cases</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Refund History
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'request'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Request Refund
        </button>
      </div>

      {/* Request Refund Tab */}
      {activeTab === 'request' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Before requesting a refund</h3>
              <p className="text-sm text-blue-800">
                Please provide detailed information about your refund request. Our support team will review your request within 48 hours.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Payment ID</label>
              <Input
                placeholder="pi_1A2B3C4D5E6F7G8H"
                {...register('paymentIntentId')}
                error={errors.paymentIntentId?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason for Refund</label>
              <select
                {...register('reason')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a reason</option>
                <option value="service_not_provided">Service Not Provided</option>
                <option value="service_quality_issue">Service Quality Issue</option>
                <option value="duplicate_charge">Duplicate Charge</option>
                <option value="unauthorized_transaction">Unauthorized Transaction</option>
                <option value="other">Other</option>
              </select>
              {errors.reason && (
                <p className="text-red-600 text-sm mt-1">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Refund Amount ($)</label>
              <Input
                type="number"
                placeholder="100.00"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                {...register('description')}
                placeholder="Please explain why you're requesting a refund..."
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={5}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4" />
                  Submitting...
                </div>
              ) : (
                'Submit Refund Request'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Refund History Tab */}
      {activeTab === 'history' && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : refunds.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">No refund requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {refunds.map((refund) => (
                <div key={refund.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 capitalize">
                        {refund.reason.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-gray-600 mb-3">{refund.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Amount</p>
                          <p className="text-lg font-semibold">${refund.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Requested</p>
                          <p className="text-sm">{new Date(refund.requestedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">ID</p>
                          <p className="text-sm font-mono">{refund.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap ml-4 ${getStatusColor(refund.status)}`}>
                      {getStatusIcon(refund.status)}
                      <span className="text-xs font-semibold capitalize">{refund.status}</span>
                    </div>
                  </div>

                  {refund.resolution && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Resolution</p>
                      <p className="text-sm text-gray-800">{refund.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
