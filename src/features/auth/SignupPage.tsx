import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { signupSchema, SignupFormValues } from './authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabaseClient';

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'customer',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // Step 1: Sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.name }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const role = data.role === 'business' ? 'business' : 'client';

        // Step 2: Upsert profile (safe for both new and existing users)
        await supabase.from('profiles').upsert([{
          id: authData.user.id,
          full_name: data.name,
          email: data.email,
          role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        }], { onConflict: 'id' });

        // Step 3: If Supabase returned a session directly (email confirm OFF)
        // auto-login immediately
        if (authData.session) {
          setAuth({
            id: authData.user.id,
            email: authData.user.email!,
            name: data.name,
            role: role as any,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            mode: role === 'business' ? 'provider' : 'client' as any,
          }, authData.session.access_token);

          toast.success('Account activated! Welcome to ServiceFlow.');
          navigate(role === 'business' ? '/dashboard' : '/marketplace');
          return;
        }

        // Step 4: Email confirmation is ON — try to sign in directly
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (!loginError && loginData.session) {
          setAuth({
            id: authData.user.id,
            email: authData.user.email!,
            name: data.name,
            role: role as any,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            mode: role === 'business' ? 'provider' : 'client' as any,
          }, loginData.session.access_token);

          toast.success('Welcome to ServiceFlow!');
          navigate(role === 'business' ? '/dashboard' : '/marketplace');
        } else {
          // Email confirmation required
          toast.success('Account created! Check your email to confirm, then log in.');
          navigate('/login');
        }
      }
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered. Please log in instead.');
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background bg-linear-to-br from-black via-zinc-950 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse delay-500"></div>

      <div className="w-full max-w-md my-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl text-black mb-6 neon-glow transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Briefcase size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Initialize <br /><span className="text-primary">Operational</span> Account</h1>
          <p className="text-zinc-500 mt-4 text-[10px] font-bold uppercase tracking-[0.2em]">Deployment: Marketplace Protocol v4.0</p>
        </div>

        <Card className="glass border-zinc-800/50 rounded-4xl shadow-2xl">
          <Card.Content className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className={`
                  cursor-pointer p-4 border-2 rounded-2xl text-center transition-all duration-300
                  ${selectedRole === 'customer' 
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,255,0,0.1)]' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                `}>
                  <input type="radio" value="customer" {...register('role')} className="hidden" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Customer Unit</span>
                </label>
                <label className={`
                  cursor-pointer p-4 border-2 rounded-2xl text-center transition-all duration-300
                  ${selectedRole === 'business' 
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,255,0,0.1)]' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                `}>
                  <input type="radio" value="business" {...register('role')} className="hidden" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Provider Unit</span>
                </label>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <Input
                    label="Confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6 h-12 text-base neon-glow" isLoading={isSubmitting}>
                Create Account
              </Button>
            </form>
          </Card.Content>
          <Card.Footer className="text-center border-zinc-800/50">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                Log in <ArrowRight size={14} />
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
