import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../store/usePaymentStore';
import CheckoutForm from './CheckoutForm';
import { CheckoutFormData } from '../features/payment/paymentSchema';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const { paymentProcessing, confirmPayment, createPayment } = usePaymentStore();

  const bookingId = searchParams.get('bookingId');
  const serviceName = searchParams.get('service');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!bookingId || !serviceName || !amount) {
      toast.error('Invalid booking information');
      navigate('/dashboard');
    }

    setBookingData({
      bookingId,
      serviceName,
      amount: parseFloat(amount || '0'),
    });
  }, [bookingId, serviceName, amount, navigate]);

  const handleCheckoutSuccess = async (formData: CheckoutFormData) => {
    setPaymentStatus('processing');

    try {
      // Create payment intent
      await createPayment(bookingId!, parseFloat(amount!), formData.paymentMethod);

      // Confirm payment with form data
      await confirmPayment('pi_temp', {
        cardholderName: formData.cardholderName,
        email: formData.email,
        token: undefined, // This would come from Stripe API
        orderId: undefined, // This would come from PayPal API
      });

      setPaymentStatus('success');
      toast.success('Payment successful!');

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate(`/booking-success?bookingId=${bookingId}`);
      }, 2000);
    } catch (error) {
      setPaymentStatus('error');
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto">
        {paymentStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Payment Successful</h3>
                <p className="text-sm text-green-800">Redirecting to booking confirmation...</p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Payment Failed</h3>
                <p className="text-sm text-red-800">Please try again or contact support</p>
              </div>
            </div>
          </div>
        )}

        <CheckoutForm
          amount={bookingData.amount}
          serviceName={bookingData.serviceName}
          onSuccess={handleCheckoutSuccess}
          isProcessing={paymentProcessing}
        />

        {/* Support Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-2">Need help with payment?</p>
          <a href="/support" className="text-blue-600 hover:text-blue-800 font-semibold">
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}
