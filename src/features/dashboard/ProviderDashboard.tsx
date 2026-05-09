import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StatCard from './StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { getMyBookings, updateBookingStatus } from '../../api/bookingsApi';
import { getAllServices } from '../../api/adminApi';
import Loader from '../../components/ui/Loader';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch Merchant's Services
  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ['merchant-services', user?.id],
    queryFn: () => getAllServices(user?.id),
    enabled: !!user?.id,
  });

  // Fetch Merchant's Bookings
  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryKey: ['merchant-bookings', user?.id],
    queryFn: () => getMyBookings(user!.id, 'business'),
    enabled: !!user?.id,
  });

  // Mutation to accept booking
  const acceptMutation = useMutation({
    mutationFn: (id: string) => updateBookingStatus(id, 'contract_signed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-bookings'] });
      toast.success('Mission Authorized! SMS notification triggered for client.');
    },
    onError: () => toast.error('Authorization failed.'),
  });

  if (isServicesLoading || isBookingsLoading) return <Loader fullPage />;

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Merchant <span className="text-primary">Control</span></h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px] mt-1">Manage your services, earnings and mission logs</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/admin/services/create')}
            className="flex gap-2 neon-glow h-10 text-xs font-black uppercase tracking-widest px-6"
          >
            <Plus size={16} />
            Create Service
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value="$4,280.00" 
          icon={DollarSign} 
          trend={{ value: '24%', isPositive: true }}
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Total Bookings" 
          value={bookings?.length.toString() || '0'} 
          icon={TrendingUp} 
          trend={{ value: '12%', isPositive: true }}
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Active Missions" 
          value={bookings?.filter(b => b.status !== 'pending' && b.status !== 'deployed' && b.status !== 'cancelled').length.toString() || '0'} 
          icon={Users} 
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Success Rate" 
          value="98%" 
          icon={Star} 
          colorClass=""
          iconColorClass=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Your Registry</h2>
            <button 
              onClick={() => navigate('/admin/services')}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80 transition-colors"
            >
              Manage All
            </button>
          </div>
          
          <Card className="overflow-hidden glass border-zinc-800 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50">
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Service Unit</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Pricing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {services?.map((service) => (
                    <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-white text-sm">{service.title}</p>
                          <ExternalLink size={12} className="text-zinc-600 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/services/${service.id}`)} />
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                          service.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        )}>
                          {service.isActive ? 'Active' : 'Offline'}
                        </span>
                      </td>
                      <td className="p-5 font-black text-white text-sm text-right">${service.basePrice}</td>
                    </tr>
                  ))}
                  {(!services || services.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-zinc-500 text-xs font-bold uppercase">No active service units found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Active Missions Log */}
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight px-2">Active Mission Log</h2>
            <Card className="overflow-hidden glass border-zinc-800 rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/50">
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deployment Phase</th>
                      <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {bookings?.filter(b => b.status !== 'pending' && b.status !== 'cancelled').map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-5">
                          <p className="font-bold text-white text-sm uppercase">Mission #{booking.id.slice(0, 8)}</p>
                          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Deployment Live</p>
                        </td>
                        <td className="p-5">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                            booking.status === 'deployed' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          )}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => navigate(`/bookings/${booking.id}/track`)}
                            className="h-8 text-[9px] font-black uppercase tracking-widest border-zinc-800 hover:border-primary/50 text-zinc-400 hover:text-primary transition-all px-4"
                          >
                            Manage Deployment
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(!bookings || bookings.filter(b => b.status !== 'pending' && b.status !== 'cancelled').length === 0) && (
                      <tr>
                        <td colSpan={3} className="p-10 text-center text-zinc-500 text-xs font-bold uppercase">No active missions in progress</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Pending Missions Widget */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6 glass border-zinc-800 rounded-4xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white uppercase tracking-tight">Pending Missions</h3>
              <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded">
                {pendingBookings.length}
              </div>
            </div>
            
            <div className="space-y-6">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 group hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                          <Clock size={18} className="text-primary animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Incoming Request</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-white">${booking.totalPrice}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => acceptMutation.mutate(booking.id)}
                        isLoading={acceptMutation.isPending}
                        className="flex-1 h-9 text-[9px] font-black uppercase tracking-widest neon-glow"
                      >
                        Authorize
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled').then(() => queryClient.invalidateQueries({ queryKey: ['merchant-bookings'] }))}
                        className="h-9 w-9 p-0 border-zinc-800 text-zinc-500 hover:text-red-500"
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No pending missions detected</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-8 rounded-4xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="font-black text-white text-lg uppercase tracking-tight">Need More <br />Exposure?</h3>
              <p className="text-zinc-500 text-[10px] font-bold leading-relaxed uppercase tracking-wide">
                Boost your listings to the top of the marketplace with ServiceFlow Ads.
              </p>
              <Button className="w-full font-black uppercase tracking-widest text-[9px] h-9 bg-white text-black hover:bg-zinc-200">
                Boost Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
