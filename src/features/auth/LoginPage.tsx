import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldAlert, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema, LoginFormValues } from './authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
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
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.user && authData.session) {
        // Fetch profile to get role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const role = profile?.role || 'client';
        
        const userProfile = {
          id: authData.user.id,
          email: authData.user.email!,
          name: profile?.full_name || 'Guest User',
          role: role as any,
          avatar: profile?.avatar_url,
          mode: (role === 'admin' || role === 'business' ? 'provider' : 'client') as any
        };

        setAuth(userProfile, authData.session.access_token);

        toast.success(role === 'admin' ? 'Authorized: Platform Access Granted' : 'Welcome back!');
        
        if (role === 'admin') {
          navigate('/admin/platform');
        } else if (role === 'business') {
          navigate('/dashboard'); // → ProviderDashboard
        } else {
          navigate('/marketplace');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black group-hover:rotate-12 transition-transform">
              <Briefcase size={24} />
            </div>
            <span className="font-black text-2xl text-white tracking-tighter uppercase italic">Service<span className="text-primary">Flow.</span></span>
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Welcome Back</h2>
          <p className="text-zinc-500 text-sm font-medium mt-2">Initialize your session to continue</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <Card.Content className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="commander@serviceflow.io"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" className="w-full h-12 text-base neon-glow" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>
          </Card.Content>
          <Card.Footer className="text-center border-zinc-800/50">
            <p className="text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                Create one <ArrowRight size={14} />
              </Link>
            </p>
          </Card.Footer>
        </Card>

        <div className="mt-8 flex justify-center">
          <Link 
            to="/admin/login" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-red-500 transition-all group"
          >
            <ShieldAlert className="w-3.5 h-3.5 group-hover:animate-pulse" />
            Secure Terminal Access
          </Link>
        </div>
      </div>
    </div>
  );
}
