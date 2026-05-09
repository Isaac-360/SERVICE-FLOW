import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormData } from './paymentSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  amount: number;
  serviceName: string;
  onSuccess: (data: CheckoutFormData) => void;
  isProcessing?: boolean;
}

export default function CheckoutForm({
  amount,
  serviceName,
  onSuccess,
  isProcessing = false,
}: CheckoutFormProps) {
  const [paymentStep, setPaymentStep] = useState<'billing' | 'payment'>('billing');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const selectedMethod = watch('paymentMethod');
  const platformFee = amount * 0.025;
  const total = amount + platformFee;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      onSuccess(data);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>{serviceName}</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Platform Fee (2.5%)</span>
            <span>${platformFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Billing Address Step */}
        {paymentStep === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                {...register('cardholderName')}
                error={errors.cardholderName?.message}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Street Address"
              placeholder="123 Main Street"
              {...register('address')}
              error={errors.address?.message}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="New York"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State/Province"
                placeholder="NY"
                {...register('state')}
                error={errors.state?.message}
              />
              <Input
                label="Postal Code"
                placeholder="10001"
                {...register('postalCode')}
                error={errors.postalCode?.message}
              />
            </div>

            <Input
              label="Country"
              placeholder="United States"
              {...register('country')}
              error={errors.country?.message}
            />

            <button
              type="button"
              onClick={() => setPaymentStep('payment')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Payment Method Step */}
        {paymentStep === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50" style={{
                borderColor: selectedMethod === 'stripe' ? '#3B82F6' : '#E5E7EB'
              }}>
                <input
                  type="radio"
                  value="stripe"
                  {...register('paymentMethod')}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Secure payment via Stripe</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50" style={{
                borderColor: selectedMethod === 'paypal' ? '#3B82F6' : '#E5E7EB'
              }}>
                <input
                  type="radio"
                  value="paypal"
                  {...register('paymentMethod')}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">PayPal</div>
                  <div className="text-sm text-gray-600">Fast and secure checkout</div>
                </div>
              </label>
            </div>

            {errors.paymentMethod && (
              <p className="text-red-600 text-sm">{errors.paymentMethod.message}</p>
            )}

            {/* Save Payment Method */}
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('savePaymentMethod')}
                className="rounded"
              />
              <span className="ml-2 text-gray-700">Save this payment method for future use</span>
            </label>

            {/* Terms Agreement */}
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register('agreeToTerms')}
                className="rounded mt-1"
              />
              <span className="ml-2 text-gray-700">
                I agree to the payment terms and conditions. I understand that my payment is non-refundable unless a dispute is approved.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-600 text-sm">{errors.agreeToTerms.message}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentStep('billing')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Back
              </button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader size={16} />
                    Processing...
                  </div>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Your payment is secure and encrypted. We never store your full card details.
      </p>
    </div>
  );
}
