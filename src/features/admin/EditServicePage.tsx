import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import ServiceForm from './ServiceForm';
import { CreateServiceData } from './adminSchema';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { AdminService } from '../../types/admin.types';
import * as adminApi from '../../api/adminApi';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateService, loading: storeLoading } = useAdminStore();
  const [service, setService] = useState<AdminService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await adminApi.getService(id);
        setService(data);
      } catch (error) {
        toast.error('Failed to load service details');
        navigate('/admin/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const handleUpdateService = async (data: CreateServiceData) => {
    if (!id) return;
    try {
      await updateService(id, data);
      toast.success('Service updated successfully');
      navigate('/admin/services');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update service');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!service) return null;

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
            Edit <span className="text-primary">Service</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Registry Node: {service.title}
          </p>
        </div>

        {/* Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-primary/5">
          <ServiceForm
            onSubmit={handleUpdateService}
            isLoading={storeLoading}
            initialData={service}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
