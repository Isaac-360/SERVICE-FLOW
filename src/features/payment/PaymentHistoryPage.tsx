import { useEffect, useState } from 'react';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useAuthStore } from '../../store/authStore';
import { PaymentHistory } from '../../types/payment.types';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Download, Eye, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import * as paymentApi from '../../api/paymentApi';
import toast from 'react-hot-toast';

export default function PaymentHistoryPage() {
  const { payments, loading, fetchPaymentHistory } = usePaymentStore();
  const { user } = useAuthStore();
  const [filteredPayments, setFilteredPayments] = useState<PaymentHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'stripe' | 'paypal'>('all');

  useEffect(() => {
    if (user?.id) {
      fetchPaymentHistory(user.id);
    }
  }, [user?.id, fetchPaymentHistory]);

  useEffect(() => {
    let filtered = [...payments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(p => p.paymentMethod === methodFilter);
    }

    setFilteredPayments(filtered.sort((a, b) =>
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    ));
  }, [payments, statusFilter, methodFilter]);

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      toast.loading('Downloading invoice...');
      const blob = await paymentApi.downloadInvoicePDF(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download invoice');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-800';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      case 'failed':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-gray-600">View all your transactions and manage payments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="stripe">Stripe (Card)</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Amount</label>
            <div className="text-2xl font-bold text-blue-600">
              ${filteredPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(payment.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.description}</p>
                        {payment.bookingDetails && (
                          <p className="text-sm text-gray-600">
                            {payment.bookingDetails.providerName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {payment.paymentMethod === 'stripe' ? 'Card' : 'PayPal'}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="text-xs font-semibold capitalize">{payment.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(payment.invoiceId)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`View details for payment ${payment.id}`)}
                          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
