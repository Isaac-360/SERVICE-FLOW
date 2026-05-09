import { useEffect, useState } from 'react';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useAuthStore } from '../../store/authStore';
import { Invoice } from '../../types/payment.types';
import Loader from '../../components/ui/Loader';
import { Download, Eye, FileText } from 'lucide-react';
import * as paymentApi from '../../api/paymentApi';
import toast from 'react-hot-toast';

export default function InvoicesPage() {
  const { invoices, loading, fetchInvoices } = usePaymentStore();
  const { user } = useAuthStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'draft' | 'sent'>('all');

  useEffect(() => {
    if (user?.id) {
      fetchInvoices(user.id);
    }
  }, [user?.id, fetchInvoices]);

  const filteredInvoices = invoices.filter(
    inv => statusFilter === 'all' || inv.status === statusFilter
  );

  const handleDownload = async (invoiceId: string) => {
    try {
      toast.loading('Generating PDF...');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-800';
      case 'draft':
        return 'bg-gray-50 text-gray-800';
      case 'sent':
        return 'bg-blue-50 text-blue-800';
      case 'overdue':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoices</h1>
        <p className="text-gray-600">View and manage your invoices</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filter</h3>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Invoices</option>
          <option value="paid">Paid</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{invoice.serviceName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Invoice #{invoice.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {invoice.clientName} → {invoice.providerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mt-2 ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-xs text-gray-600">
                      Issued: {new Date(invoice.issuedDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(invoice.id);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoice Preview */}
        <div className="lg:col-span-1">
          {selectedInvoice ? (
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Preview</h3>
              
              <div className="space-y-4 text-sm">
                <div className="border-b pb-4">
                  <p className="text-gray-600">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.id}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-gray-600">Service</p>
                  <p className="font-semibold">{selectedInvoice.serviceName}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-gray-600">From</p>
                  <p className="font-semibold">{selectedInvoice.providerName}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-gray-600">To</p>
                  <p className="font-semibold">{selectedInvoice.clientName}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-semibold">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(selectedInvoice.total - selectedInvoice.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(selectedInvoice.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Eye className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">Select an invoice to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
