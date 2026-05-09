import { useAuthStore } from '../../store/authStore';
import ClientDashboard from './ClientDashboard';
import ProviderDashboard from './ProviderDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const mode = user?.mode || 'client';

  if (mode === 'provider') {
    return <ProviderDashboard />;
  }

  return <ClientDashboard />;
}
