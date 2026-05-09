import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Star,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { getMyBookings, Booking } from '../../api/bookingsApi';
import Loader from '../../components/ui/Loader';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['client-bookings', user?.id],
    queryFn: () => getMyBookings(user!.id, 'client'),
    enabled: !!user?.id,
  });

  if (isLoading) return <Loader fullPage />;

  const stats = {
    total: bookings?.length || 0,
    active: bookings?.filter((b: Booking) => b.status !== 'pending' && b.status !== 'deployed' && b.status !== 'cancelled').length || 0,
    completed: bookings?.filter((b: Booking) => b.status === 'deployed').length || 0,
    pending: bookings?.filter((b: Booking) => b.status === 'pending').length || 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">System <span className="text-primary">Console</span></h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px] mt-1">Real-time activity and mission logs</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/marketplace')}
            className="flex gap-2 neon-glow h-10 text-xs font-black uppercase tracking-widest px-6"
          >
            <Calendar size={16} />
            Initialize Mission
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Missions" 
          value={stats.total.toString()} 
          icon={Activity} 
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Active Units" 
          value={stats.active.toString()} 
          icon={Clock} 
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Pending Auth" 
          value={stats.pending.toString()} 
          icon={AlertCircle} 
          colorClass=""
          iconColorClass=""
        />
        <StatCard 
          title="Success Rate" 
          value={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'} 
          icon={Star} 
          colorClass=""
          iconColorClass=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Deployment History</h2>
          </div>
          
          <Card className="overflow-hidden glass border-zinc-800 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50">
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Service Unit</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Schedule</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right whitespace-nowrap">Value</th>
                    <th className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {bookings?.map((booking: Booking) => (
                    <tr key={booking.id} className="hover:bg-primary/5 hover:shadow-[inset_0_0_20px_rgba(212,255,0,0.05)] transition-all group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                              <Activity size={14} className="text-primary" />
                           </div>
                           <div>
                            <p className="font-bold text-white text-sm uppercase tracking-tight font-mono">Mission #{booking.id.slice(0, 8)}</p>
                            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Encrypted Stream Active</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                      <td className="p-5">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-max",
                          booking.status === 'pending' && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                          ['contract_signed', 'in_progress', 'draft_delivered', 'final_approval'].includes(booking.status) && 'bg-primary/10 text-primary border-primary/20',
                          booking.status === 'deployed' && 'bg-zinc-800 text-primary border-primary',
                          booking.status === 'cancelled' && 'bg-red-500/10 text-red-500 border-red-500/20',
                        )}>
                          {booking.status !== 'cancelled' && booking.status !== 'deployed' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_5px_currentColor]" />
                          )}
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-5 font-black text-white text-sm text-right font-mono whitespace-nowrap">${booking.totalPrice}</td>
                      <td className="p-5 text-right whitespace-nowrap">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => navigate(`/bookings/${booking.id}/track`)}
                          className="h-8 text-[9px] font-black uppercase tracking-widest border-zinc-800 hover:border-primary/50 text-zinc-400 hover:text-primary transition-all px-4"
                        >
                          Track Mission
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!bookings || bookings.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-16 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: [ -50, 50, -50 ], opacity: [0, 0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="w-full h-px bg-primary/50 shadow-[0_0_20px_rgba(212,255,0,0.8)]"
                          />
                        </div>
                        <div className="text-center relative z-10 flex flex-col items-center gap-3">
                          <Activity className="w-8 h-8 text-zinc-800 animate-pulse" />
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Scanning for active deployment logs...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card className="bg-primary text-black border-none p-8 rounded-4xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="font-black text-2xl leading-none uppercase tracking-tighter">Need Elite <br />Support?</h3>
              <p className="text-black/70 text-xs font-bold leading-relaxed uppercase tracking-wide">
                Our concierge team is available 24/7 for premium assistance.
              </p>
              <Button className="bg-black text-white hover:bg-black/90 w-full font-black uppercase tracking-widest text-[10px] h-10">
                Contact Support
              </Button>
            </div>
            <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-black/5 group-hover:scale-110 transition-transform duration-500" />
          </Card>

          <Card className="p-8 space-y-6 glass border-zinc-800 rounded-4xl">
            <h3 className="font-black text-white uppercase tracking-tight">Mission Briefs</h3>
            <div className="space-y-6">
              {bookings?.slice(0, 3).map((booking: Booking, i: number) => (
                <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className={cn(
                    "p-2 rounded-lg bg-zinc-950 border border-zinc-800 transition-colors group-hover:border-primary/30",
                    booking.status !== 'pending' && booking.status !== 'cancelled' ? 'text-primary' : 'text-zinc-600'
                  )}>
                    {booking.status === 'deployed' ? <CheckCircle2 size={16} /> : <Activity size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">
                        {booking.status === 'pending' ? 'Request Transmitted' : 'Authorization Granted'}
                      </p>
                      <ArrowRight size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter font-mono">Mission #{booking.id.slice(0, 6)}</p>
                  </div>
                </div>
              ))}
              {(!bookings || bookings.length === 0) && (
                <div className="text-center py-4">
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">Awaiting initial transmission...</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
