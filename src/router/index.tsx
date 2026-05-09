import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Loader from '../components/ui/Loader';

// Lazy loaded components
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/SignupPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const MarketplacePage = lazy(() => import('../features/marketplace/MarketplacePage'));
const ServiceDetailPage = lazy(() => import('../features/service-detail/ServiceDetailPage'));
const BookingPage = lazy(() => import('../features/booking/BookingPage'));
const BookingSuccess = lazy(() => import('../features/booking/BookingSuccess'));
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));
const MissionControlPage = lazy(() => import('../features/mission-control/MissionControlPage'));
const BookingTrackingPage = lazy(() => import('../features/booking/BookingTrackingPage'));
const CheckoutPage = lazy(() => import('../features/payment/CheckoutPage'));
const PaymentHistoryPage = lazy(() => import('../features/payment/PaymentHistoryPage'));
const InvoicesPage = lazy(() => import('../features/payment/InvoicesPage'));
const RefundAndDisputePage = lazy(() => import('../features/payment/RefundAndDisputePage'));
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));
const CreateServicePage = lazy(() => import('../features/admin/CreateServicePage'));
const EditServicePage = lazy(() => import('../features/admin/EditServicePage'));
const PlatformDashboard = lazy(() => import('../features/admin/PlatformDashboard'));
const UserManagement = lazy(() => import('../features/admin/UserManagement'));
const AdminLoginPage = lazy(() => import('../features/admin/AdminLoginPage'));
const CreateAdminPage = lazy(() => import('../features/admin/CreateAdminPage'));

import PlaceholderPage from '../components/ui/PlaceholderPage';
import AdminRoute from '../components/layout/AdminRoute';
import ProviderRoute from '../components/layout/ProviderRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loader fullPage />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<Loader fullPage />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<Loader fullPage />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader fullPage />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'marketplace',
        element: (
          <Suspense fallback={<Loader />}>
            <MarketplacePage />
          </Suspense>
        ),
      },
      {
        path: 'services/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <ServiceDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings/:id/track',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <BookingTrackingPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'mission-control',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <MissionControlPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="My Bookings" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'booking/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <BookingPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'booking-success',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <BookingSuccess />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <CheckoutPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'payments',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <PaymentHistoryPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoices',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <InvoicesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'refunds',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <RefundAndDisputePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <PlaceholderPage title="Page Not Found" />,
      },
    ],
  },
  // ── Admin Panel (with shared service management for providers) ──
  {
    path: '/admin',
    element: (
      <ProviderRoute>
        <AdminLayout />
      </ProviderRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/services" replace />,
      },
      {
        path: 'platform',
        element: (
          <AdminRoute>
            <Suspense fallback={<Loader fullPage />}>
              <PlatformDashboard />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <Suspense fallback={<Loader fullPage />}>
              <UserManagement />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<Loader fullPage />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'services/create',
        element: (
          <Suspense fallback={<Loader fullPage />}>
            <CreateServicePage />
          </Suspense>
        ),
      },
      {
        path: 'services/:id/edit',
        element: (
          <Suspense fallback={<Loader fullPage />}>
            <EditServicePage />
          </Suspense>
        ),
      },
      {
        path: 'create-admin',
        element: (
          <AdminRoute>
            <Suspense fallback={<Loader fullPage />}>
              <CreateAdminPage />
            </Suspense>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
