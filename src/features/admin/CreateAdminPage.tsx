import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, createTempClient } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const createAdminSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

interface CreatedAdmin {
  name: string;
  email: string;
  createdAt: string;
}

export default function CreateAdminPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [createdAdmins, setCreatedAdmins] = useState<CreatedAdmin[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
  });

  const password = watch('password', '');

  const passwordStrength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Fortress'][passwordStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-primary', 'bg-emerald-400'][passwordStrength];

  const onSubmit = async (data: CreateAdminFormData) => {
    try {
      const tempSupabase = createTempClient();
      
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await tempSupabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'admin',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) throw new Error('User creation failed — no user returned');

      // Step 2: Upsert profile with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          role: 'admin',
        });

      if (profileError) throw profileError;

      // Track it locally for UI feedback
      setCreatedAdmins((prev) => [
        { name: data.fullName, email: data.email, createdAt: new Date().toISOString() },
        ...prev,
      ]);

      toast.success(`Admin account created for ${data.fullName}`);
      reset();
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered in the system');
      } else {
        toast.error(error.message || 'Failed to create admin account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <p className="text-[8px] font-black text-purple-400 uppercase tracking-[0.3em]">
                Restricted Access
              </p>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-3">
            Create <span className="text-purple-400">Admin</span> Account
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            Provision a new administrative identity with elevated privileges
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Card */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8">
              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl mb-8">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-400 font-black text-xs uppercase tracking-widest mb-1">
                    Security Notice
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Admin accounts have full platform access. Only provision accounts for
                    verified personnel. All creation events are logged.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Sarah Mensah"
                    {...register('fullName')}
                    className="w-full h-12 px-4 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@serviceflow.io"
                    {...register('email')}
                    className="w-full h-12 px-4 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-medium text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    Access Code
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      {...register('password')}
                      className="w-full h-12 px-4 pr-12 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-medium text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Meter */}
                  {password.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength ? strengthColor : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        Strength:{' '}
                        <span
                          className={
                            passwordStrength <= 1
                              ? 'text-red-400'
                              : passwordStrength <= 2
                              ? 'text-orange-400'
                              : passwordStrength <= 3
                              ? 'text-yellow-400'
                              : 'text-emerald-400'
                          }
                        >
                          {strengthLabel}
                        </span>
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-400 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-primary" />
                    Confirm Access Code
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      {...register('confirmPassword')}
                      className="w-full h-12 px-4 pr-12 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all font-medium text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Rules */}
                <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 space-y-2">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">
                    Password Requirements
                  </p>
                  {[
                    { rule: 'At least 8 characters', ok: password.length >= 8 },
                    { rule: 'One uppercase letter (A–Z)', ok: /[A-Z]/.test(password) },
                    { rule: 'One number (0–9)', ok: /[0-9]/.test(password) },
                    { rule: 'One special character (!@#$...)', ok: /[^A-Za-z0-9]/.test(password) },
                  ].map(({ rule, ok }) => (
                    <div key={rule} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${ok ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-700'}`}>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                      <p className={`text-[10px] font-medium transition-colors ${ok ? 'text-zinc-400' : 'text-zinc-700'}`}>{rule}</p>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 border-none shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Provisioning...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Provision Admin Account
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Access Level Info */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  Admin Privileges
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  'Full User Registry Access',
                  'Service Create / Edit / Delete',
                  'Platform Analytics View',
                  'Role Promotion Rights',
                  'System Configuration Access',
                ].map((priv) => (
                  <div key={priv} className="flex items-center gap-2.5">
                    <Zap className="w-3 h-3 text-primary shrink-0" />
                    <p className="text-xs text-zinc-400 font-medium">{priv}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Created Admins */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-5 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                Recently Created
              </h3>
              {createdAdmins.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                    <User className="w-4 h-4 text-zinc-600" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    No admins created yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {createdAdmins.map((admin, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800 animate-slide-up"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <span className="text-purple-400 font-black text-xs uppercase">
                          {admin.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-xs uppercase tracking-tight truncate">
                          {admin.name}
                        </p>
                        <p className="text-zinc-600 text-[9px] font-medium truncate">{admin.email}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
