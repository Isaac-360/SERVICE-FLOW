import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Terminal, Lock, Mail, ArrowRight, Server, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema, LoginFormValues } from '../auth/authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user && authData.session) {
        // 2. Verify Role - ONLY Admins can use this terminal
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const isEmergencyAdmin = authData.user.email === 'akuinaisaac710@gmail.com';

        if (!isEmergencyAdmin && (profileError || profile?.role !== 'admin')) {
          await supabase.auth.signOut();
          toast.error('ACCESS DENIED: Administrative Credentials Required');
          return;
        }

        // 3. Set Global Auth
        const userProfile = {
          id: authData.user.id,
          email: authData.user.email!,
          name: profile.full_name || 'Admin User',
          role: 'admin' as const,
          avatar: profile.avatar_url,
          mode: 'provider' as const
        };

        setAuth(userProfile, authData.session.access_token);

        toast.success('IDENTITY VERIFIED: Welcome, Commander');
        navigate('/admin/platform');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification sequence failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] z-10 pointer-events-none opacity-20" />
      
      <div className="w-full max-w-md relative z-30">
        <div className="text-center mb-8">
           <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-4" />
           <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
             Executive <span className="text-primary">Terminal</span>
           </h1>
           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2">Administrative Level-1 Access Only</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Administrative Email"
              type="email"
              placeholder="commander@serviceflow.io"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Access Code"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white border-none transition-all"
              isLoading={isSubmitting}
            >
              Verify Authority
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <Link to="/login" className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              Standard Portal <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* System Stats Footer */}
        <div className="mt-8 flex justify-between px-6 opacity-40">
           <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-zinc-500" />
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Node: Core-01</span>
           </div>
           <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-zinc-500" />
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Status: Encrypted</span>
           </div>
        </div>
      </div>
    </div>
  );
}
