import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Mail, Shield, MapPin, Briefcase, Calendar, Edit3, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDashboardStore } from '../../store/useDashboardStore';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { totalBookings, avgRating } = useDashboardStore();
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Professional member focused on quality service and reliability.',
      location: 'New York, USA',
    }
  });

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile updated successfully');
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Professional Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-zinc-900/20 p-10 rounded-3xl border border-zinc-800/50">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 overflow-hidden bg-zinc-900">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <button className="absolute bottom-1 right-1 p-2 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-all border-4 border-zinc-950">
            <Camera size={16} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">{user.name}</h1>
            <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              {user.role} Member
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-5 text-zinc-500 text-sm font-medium">
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-primary/60" /> {user.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-primary/60" /> New York, USA
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-primary/60" /> Joined March 2024
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Summary */}
        <div className="space-y-6">
          <Card className="glass p-8 border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-6">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500">Member Status</span>
                <span className="text-sm font-bold text-green-500">Active</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500">Total Bookings</span>
                <span className="text-sm font-bold text-white">{totalBookings}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-500">Service Rating</span>
                <span className="text-sm font-bold text-primary">{avgRating}/5.0</span>
              </div>
            </div>
          </Card>

          <Card className="glass p-8 border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Design', 'Marketing', 'Legal'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="glass border-zinc-800 overflow-hidden">
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Personal Information</h3>
                <p className="text-sm text-zinc-500 mt-1">Update your account details and bio.</p>
              </div>
              <Edit3 size={20} className="text-zinc-500" />
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                    <Input {...register('name')} placeholder="Your name" className="bg-zinc-950" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                    <Input {...register('email')} type="email" disabled className="bg-zinc-900 text-zinc-600" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</label>
                    <Input {...register('location')} placeholder="Your location" className="bg-zinc-950" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Member Role</label>
                    <div className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 flex items-center px-4 text-sm text-zinc-600 font-medium capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Short Biography</label>
                  <textarea 
                    {...register('bio')}
                    className="w-full min-h-[120px] rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={isSubmitting} className="px-10 h-12">
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
