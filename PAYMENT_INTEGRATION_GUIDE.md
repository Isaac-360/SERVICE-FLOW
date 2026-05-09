# Payment Integration Guide

This document provides comprehensive instructions for integrating Stripe and PayPal into your business service marketplace.

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Installation & Setup](#installation--setup)
3. [Stripe Integration](#stripe-integration)
4. [PayPal Integration](#paypal-integration)
5. [Environment Configuration](#environment-configuration)
6. [API Backend Requirements](#api-backend-requirements)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Project Structure

```
src/
├── features/payment/
│   ├── CheckoutPage.tsx          # Main checkout page
│   ├── CheckoutForm.tsx          # Multi-step checkout form
│   ├── PaymentHistoryPage.tsx    # View all payments
│   ├── InvoicesPage.tsx          # View and download invoices
│   ├── RefundAndDisputePage.tsx  # Request refunds & disputes
│   └── paymentSchema.ts          # Zod validation schemas
├── api/
│   └── paymentApi.ts             # API service calls
├── store/
│   └── usePaymentStore.ts        # Zustand payment state
├── types/
│   └── payment.types.ts          # TypeScript interfaces
└── utils/
    └── invoiceService.ts         # Invoice generation utilities
```

---

## Installation & Setup

### 1. Install Required Dependencies

```bash
npm install stripe @stripe/react-stripe-js @stripe/js paypal-checkout-sdk
```

### 2. Update Environment Variables

Create or update `.env.local`:

```env
# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY

# PayPal
REACT_APP_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
VITE_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID

# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Stripe Integration

### 1. Create Stripe Account & Get Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for an account
3. Navigate to **Developers > API Keys**
4. Copy your **Publishable Key** and **Secret Key**
5. Update your environment variables

### 2. Create Enhanced Checkout Component

Create `src/features/payment/StripeCheckout.tsx`:

```tsx
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutProps {
  amount: number;
  bookingId: string;
  onSuccess: (paymentIntentId: string) => void;
}

function StripeCheckoutForm({ amount, bookingId, onSuccess }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);

      // Call your backend to create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          bookingId,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: { name: 'Customer' },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess(result.paymentIntent.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={loading} type="submit">
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm {...props} />
    </Elements>
  );
}
```

### 3. Backend Stripe Integration (Node.js/Express)

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create Payment Intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { bookingId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook Handler
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update payment status in database
      const paymentIntent = event.data.object;
      await Payment.update(
        { status: 'completed', stripePaymentIntentId: paymentIntent.id },
        { where: { bookingId: paymentIntent.metadata.bookingId } }
      );
      break;
    case 'payment_intent.payment_failed':
      // Handle payment failure
      break;
  }

  res.json({received: true});
});
```

---

## PayPal Integration

### 1. Create PayPal Developer Account

1. Go to [PayPal Developer](https://developer.paypal.com)
2. Sign up or log in
3. Create an app in the Sandbox
4. Get your **Client ID**
5. Add to environment variables

### 2. Create PayPal Checkout Component

Create `src/features/payment/PayPalCheckout.tsx`:

```tsx
import { PayPalScriptProvider, PayPalButtons } from '@paypal/checkout-sdk';
import toast from 'react-hot-toast';

interface PayPalCheckoutProps {
  amount: number;
  bookingId: string;
  onSuccess: (orderId: string) => void;
}

export default function PayPalCheckout({
  amount,
  bookingId,
  onSuccess,
}: PayPalCheckoutProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      <PayPalButtons
        createOrder={async () => {
          const response = await fetch('/api/payments/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount,
              bookingId,
            }),
          });
          const { id } = await response.json();
          return id;
        }}
        onApprove={async (data, actions) => {
          const response = await fetch('/api/payments/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderID,
              bookingId,
            }),
          });
          const result = await response.json();
          
          if (result.status === 'COMPLETED') {
            toast.success('Payment successful!');
            onSuccess(data.orderID);
          }
        }}
        onError={(err) => {
          toast.error('Payment failed');
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
```

### 3. Backend PayPal Integration (Node.js)

```typescript
import paypalClient from '@paypal/checkout-server-sdk';

const client = new paypalClient.core.PayPalHttpClient(environment);

// Create Order
app.post('/api/payments/paypal/create-order', async (req, res) => {
  const { amount, bookingId } = req.body;

  const request = new paypalClient.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount.toString(),
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture Order
app.post('/api/payments/paypal/capture-order', async (req, res) => {
  const { orderId, bookingId } = req.body;

  const request = new paypalClient.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    
    // Update payment in database
    await Payment.update(
      { status: 'completed', paypalOrderId: orderId },
      { where: { bookingId } }
    );

    res.json({ status: capture.result.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## Environment Configuration

### Development (.env.local)

```env
# Stripe (Test Keys)
VITE_STRIPE_PUBLIC_KEY=pk_test_51234567890
VITE_STRIPE_SECRET_KEY=sk_test_51234567890

# PayPal (Sandbox)
VITE_PAYPAL_CLIENT_ID=AT-client-id-sandbox
VITE_PAYPAL_SECRET=secret-sandbox

# Webhooks
VITE_STRIPE_WEBHOOK_SECRET=whsec_test_123

# API
VITE_API_BASE_URL=http://localhost:3000
```

### Production (.env.production)

```env
# Stripe (Live Keys)
VITE_STRIPE_PUBLIC_KEY=pk_live_51234567890
VITE_STRIPE_SECRET_KEY=sk_live_51234567890

# PayPal (Live)
VITE_PAYPAL_CLIENT_ID=AT-client-id-live
VITE_PAYPAL_SECRET=secret-live

# Webhooks
VITE_STRIPE_WEBHOOK_SECRET=whsec_live_123

# API
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## API Backend Requirements

Your backend API should support these endpoints:

### Payments

- `POST /api/payments/intents` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/history/:userId` - Payment history

### Invoices

- `POST /api/invoices/generate` - Generate invoice
- `GET /api/invoices/:id` - Get invoice
- `GET /api/invoices/user/:userId` - User invoices
- `GET /api/invoices/:id/download` - Download PDF

### Refunds

- `POST /api/refunds/request` - Request refund
- `GET /api/refunds/:id` - Get refund status
- `GET /api/refunds/user/:userId` - User refunds

### Disputes

- `POST /api/disputes/report` - Report dispute
- `GET /api/disputes/:id` - Get dispute
- `GET /api/disputes/user/:userId` - User disputes

---

## Testing

### Stripe Test Cards

| Card Number | Expiry | CVC | Result |
|---|---|---|---|
| 4242 4242 4242 4242 | Any future | Any | Visa - Succeeds |
| 5555 5555 5555 4444 | Any future | Any | Mastercard - Succeeds |
| 4000 0000 0000 0002 | Any future | Any | Visa - Fails |

### PayPal Sandbox

1. Create test accounts at [PayPal Sandbox](https://www.sandbox.paypal.com)
2. Use test buyer account for payments
3. Check transaction logs in Developer Dashboard

### Manual Testing Checklist

- [ ] Checkout form validates correctly
- [ ] Payment intent is created
- [ ] Card/PayPal payment processes
- [ ] Invoice is generated after payment
- [ ] Payment appears in history
- [ ] Refund request submits successfully
- [ ] Email receipts are sent
- [ ] Webhooks update payment status

---

## Deployment

### Vercel

1. Add environment variables in Vercel Dashboard
2. Update API endpoints for production
3. Set up Stripe & PayPal webhooks to production URLs
4. Deploy and test with live keys

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Webhook Setup

**Stripe Webhook URL:**
```
https://yourdomain.com/api/webhooks/stripe
```

**PayPal Webhook URL:**
```
https://yourdomain.com/api/webhooks/paypal
```

---

## Security Best Practices

✅ **Do:**
- Never expose secret keys in frontend code
- Use environment variables for sensitive data
- Implement server-side payment verification
- Store encrypted payment data only
- Use HTTPS for all transactions
- Validate amounts on backend
- Implement rate limiting on payment endpoints
- Log all payment activities

❌ **Don't:**
- Store full credit card numbers
- Send payment tokens via email
- Log sensitive payment data
- Trust frontend validation alone
- Hardcode API keys

---

## Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)
- [Invoice Generation Libraries](https://github.com/parallax/jsPDF)
- [Email Service Providers](https://sendgrid.com, https://mailgun.com)

---

## Next Steps

1. Create backend API endpoints
2. Integrate Stripe & PayPal SDKs
3. Set up webhook handlers
4. Configure invoice PDF generation
5. Implement email notifications
6. Test payment flows thoroughly
7. Set up production credentials
8. Deploy and monitor payments
