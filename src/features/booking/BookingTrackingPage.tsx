import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Booking, updateBookingStatus } from '../../api/bookingsApi';
import { useAuthStore } from '../../store/authStore';
import DeploymentRoadmap, { DeploymentStage } from '../../components/booking/DeploymentRoadmap';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

export default function BookingTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });

  const advanceMutation = useMutation({
    mutationFn: (nextStatus: DeploymentStage) => updateBookingStatus(id!, nextStatus as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-detail', id] });
      toast.success('Mission progress updated. Protocol synchronized.');
    },
    onError: () => toast.error('Failed to update deployment status.'),
  });

  if (isLoading) return <Loader fullPage />;
  if (!booking) return <div className="text-white">Mission Record Not Found</div>;

  const isProvider = user?.id === booking.services.business_id;
  const isClient = user?.id === booking.client_id;

  if (!isProvider && !isClient && user?.role !== 'admin') {
    return <div className="text-white">Access Denied: Encrypted Stream Restricted</div>;
  }

  const nextStatusMap: Record<string, DeploymentStage> = {
    'pending': 'contract_signed',
    'contract_signed': 'in_progress',
    'in_progress': 'draft_delivered',
    'draft_delivered': 'final_approval',
    'final_approval': 'deployed',
  };

  const nextStatus = nextStatusMap[booking.status];

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Deployment <span className="text-primary">Roadmap</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[9px]">Mission ID: #{booking.id.slice(0, 12)}</p>
          </div>
          
          {booking.status === 'deployed' && (
            <div className="ml-auto px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
              <CheckCircle2 size={14} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Mission Accomplished</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Roadmap */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 lg:p-12 glass border-zinc-800 rounded-4xl">
              <div className="mb-10">
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Tactical Lifecycle</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Real-time status of service deployment</p>
              </div>
              
              <DeploymentRoadmap currentStatus={booking.status} />

              {/* Provider Controls */}
              {isProvider && nextStatus && (
                <div className="mt-12 pt-8 border-t border-zinc-800/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                    <div>
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Commander Action Required</h4>
                      <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-tight">Advance mission to: <span className="text-white">{nextStatus.replace('_', ' ')}</span></p>
                    </div>
                    <Button 
                      onClick={() => advanceMutation.mutate(nextStatus)}
                      isLoading={advanceMutation.isPending}
                      className="w-full sm:w-auto px-10 h-12 text-xs font-black uppercase tracking-widest neon-glow"
                    >
                      Authorize Next Phase
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Mission Intel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-zinc-900/50 border-zinc-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-primary">
                    <Activity size={16} />
                  </div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Deployment Specs</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assigned Unit</span>
                    <span className="text-[10px] font-black text-white uppercase">{booking.services.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Schedule Date</span>
                    <span className="text-[10px] font-black text-white uppercase">{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Credit</span>
                    <span className="text-[10px] font-black text-primary uppercase">GHS {booking.total_price}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-zinc-900/50 border-zinc-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-blue-400">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Security Brief</h4>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wide">
                  This mission is protected under ServiceFlow Protocol v4.0. Payment is held in secure vault until final deployment verification.
                </p>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-8 glass border-zinc-800 rounded-4xl">
              <h3 className="font-black text-white uppercase tracking-tight mb-8">Mission Control</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Estimated T-Minus</p>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase mt-0.5 tracking-tighter">72 Hours to Next Phase</p>
                   </div>
                </div>
                
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <AlertCircle size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Incident Report</p>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase mt-0.5 tracking-tighter">No anomalies detected</p>
                   </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <Button variant="secondary" className="w-full text-[9px] font-black uppercase tracking-widest h-10 border-zinc-800 text-zinc-400">
                  Mission Logs
                </Button>
                <Button variant="secondary" className="w-full text-[9px] font-black uppercase tracking-widest h-10 border-zinc-800 text-zinc-400">
                  Open Support Channel
                </Button>
              </div>
            </Card>

            {/* Provider Bio */}
            <Card className="p-6 bg-zinc-900/30 border-zinc-800 rounded-3xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 overflow-hidden">
                     <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.services.business_name}`} 
                        alt={booking.services.business_name} 
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">{booking.services.business_name}</p>
                     <p className="text-[8px] text-primary font-bold uppercase tracking-tighter">Elite Merchant Unit</p>
                  </div>
               </div>
               <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                  Certified professional with 98% deployment success rate across 500+ missions.
               </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
