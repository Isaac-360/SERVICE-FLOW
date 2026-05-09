import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    services, 
    loading, 
    stats, 
    fetchServices, 
    fetchStats, 
    deleteService, 
    toggleServiceStatus,
    filters,
    setFilter,
    updateServiceStatus
  } = useAdminStore();
  const { user } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadData = async () => {
    if (user?.id) {
      await Promise.all([
        fetchServices(user.id),
        fetchStats(user.id)
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, fetchServices, fetchStats]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ category: e.target.value });
  };

  const categories = [...new Set(services.map(s => s.category))];

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      toast.success('Service deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleUpdateStatus = async (serviceId: string, status: 'pending' | 'active' | 'rejected') => {
    try {
      await updateServiceStatus(serviceId, status);
      toast.success(`Service status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const handleToggleStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await toggleServiceStatus(serviceId, !isActive);
      toast.success(`Service ${isActive ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Registry <span className="text-primary">Control</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Command Center: Services Deployment & Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              disabled={loading}
              className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50 group"
              title="Refresh Data"
            >
              <BarChart3 className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
            </button>
            <Button 
              onClick={() => navigate('/admin/services/create')}
              className="h-12 px-8 neon-glow text-xs font-black uppercase tracking-widest flex items-center gap-3"
            >
              <Plus className="w-4 h-4" />
              New Deployment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Network Node Count', value: stats.totalServices, icon: BarChart3, color: 'text-blue-400' },
              { label: 'Active Streams', value: stats.activeServices, icon: Eye, color: 'text-primary' },
              { label: 'Trust Index', value: `${stats.averageRating.toFixed(1)}★`, icon: Eye, color: 'text-yellow-400' },
              { label: 'Credit Velocity', value: `GHS ${stats.totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl group hover:border-primary/20 transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                </div>
                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search encrypted records..."
                value={filters.search || ''}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm"
              />
            </div>

            <select
              value={filters.category || ''}
              onChange={handleCategoryChange}
              className="px-6 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black uppercase tracking-widest text-[10px] min-w-[200px] appearance-none cursor-pointer"
            >
              <option value="" className="bg-zinc-950 text-zinc-500">All Sectors</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader />
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] animate-pulse">Synchronizing Records...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-4xl p-24 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800">
              <EyeOff className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">No Records Found</h3>
            <p className="text-zinc-600 text-sm mb-8 font-medium">The registry is currently empty. Initialize your first node.</p>
            <Button 
              onClick={() => navigate('/admin/services/create')}
              className="neon-glow px-10 h-12 text-xs font-black uppercase tracking-widest"
            >
              Initialize Node
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 hover:border-primary/20 rounded-3xl overflow-hidden transition-all duration-500 group">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 bg-zinc-950 rounded-2xl overflow-hidden shrink-0 border border-zinc-800 relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-primary transition-colors">{service.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(212,255,0,0.5)]" />
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{service.businessName}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${
                          service.status === 'active'
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : service.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {service.status === 'active' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : service.status === 'pending' ? (
                            <Clock className="w-3 h-3 animate-pulse" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {service.status === 'active' ? 'Operational' : service.status === 'pending' ? 'Verification Pending' : 'Authorization Denied'}
                        </div>
                      </div>

                      <p className="text-zinc-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-6 border-t border-zinc-800/50">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Base Rate</p>
                          <p className="text-white font-black">GHS {service.basePrice.toFixed(2)}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Trust Rating</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-primary font-black">{service.rating}★</span>
                            <span className="text-zinc-700 text-[10px] font-bold">({service.reviewCount})</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Global Nodes</p>
                          <div className="flex items-center gap-2 text-zinc-300 font-bold">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="text-xs">{service.locations.length} Locations</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Classification</p>
                          <span className="inline-block px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-zinc-700">
                            {service.category}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {/* Admin Approval Controls */}
                        {user?.role === 'admin' && service.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(service.id, 'active')}
                              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Authorize Node
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(service.id, 'rejected')}
                              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-red-500/30 text-red-500 hover:bg-red-500/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Deny Access
                            </button>
                          </>
                        )}

                        {service.status === 'active' && (
                          <button
                            onClick={() => handleToggleStatus(service.id, service.isActive)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              service.isActive
                                ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30'
                                : 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(212,255,0,0.2)]'
                            }`}
                          >
                            {service.isActive ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Kill Stream
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Restore Node
                              </>
                            )}
                          </button>
                        )}

                        <button 
                          onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modify
                        </button>

                        <button
                          onClick={() => setShowDeleteConfirm(service.id)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Purge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === service.id && (
                  <div className="bg-red-500/5 backdrop-blur-md border-t border-red-500/20 p-8 animate-slide-up">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-red-500 font-black uppercase tracking-widest text-xs">Purge Confirmation Required</p>
                        <p className="text-zinc-400 text-sm font-medium">Are you sure you want to permanently delete "{service.title}"? This cannot be undone.</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-8 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-zinc-300 transition-colors"
                        >
                          Abort
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all"
                        >
                          Confirm Purge
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
