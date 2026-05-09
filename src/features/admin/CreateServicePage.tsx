import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/authStore';
import ServiceForm from './ServiceForm';
import { CreateServiceData } from './adminSchema';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function CreateServicePage() {
  const navigate = useNavigate();
  const { createService, loading } = useAdminStore();
  const { user } = useAuthStore();

  const handleCreateService = async (data: CreateServiceData) => {
    if (!user) {
      toast.error('You must be logged in to create a service');
      return;
    }

    try {
      await createService({
        ...data,
        businessId: user.id,
        businessName: user.name || 'Anonymous Business',
      });
      toast.success('Service created successfully!');
      navigate('/admin/services');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create service');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/admin/services')}
            className="flex items-center gap-2 text-zinc-500 hover:text-primary font-bold uppercase tracking-widest text-[10px] mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </button>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
            Create <span className="text-primary">Service</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Registry Node: New Service Deployment
          </p>
        </div>

        {/* Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-primary/5">
          <ServiceForm
            onSubmit={handleCreateService}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
