import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal, Zap } from 'lucide-react';
import { getServices } from '../../api/servicesApi';
import ServiceCard from './ServiceCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Category } from '../../types/service.types';

const categories: Category[] = ['All', 'Technology', 'Design', 'Security', 'Events', 'Logistics'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', selectedCategory, debouncedSearch],
    queryFn: () => getServices(selectedCategory, debouncedSearch),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchQuery);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative rounded-5xl overflow-hidden bg-zinc-950 p-8 md:p-16 text-white shadow-2xl border border-zinc-900 group">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap size={12} className="animate-pulse" /> Deployment Status: Online
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none uppercase">Discover <br /><span className="text-primary">Elite Units</span></h1>
          <p className="text-zinc-500 text-lg mb-10 font-bold uppercase tracking-widest text-[11px] max-w-sm">Access a global network of verified professional assets and tactical solutions.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Locate service sector..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border border-zinc-900 bg-black text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none text-white shadow-2xl transition-all placeholder:text-zinc-800"
              />
            </div>
            <Button type="submit" size="lg" className="px-10 h-16 font-black uppercase tracking-widest text-xs neon-glow">
              Initiate Search
            </Button>
          </form>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-primary rounded-full animate-spin-slow opacity-20" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/50 rounded-full animate-spin-slow delay-500 reverse opacity-10" />
        </div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
      </div>

      {/* Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide px-2 snap-x snap-mandatory">
          <div className="flex gap-4 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  snap-center shrink-0 px-8 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border-2
                  ${selectedCategory === category 
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800 hover:text-white'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="hidden lg:flex gap-3 border-zinc-900 text-zinc-500 font-black uppercase tracking-widest text-[10px] h-10 px-6">
            <SlidersHorizontal size={14} />
            Filters
          </Button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[420px] bg-zinc-900/40 border border-zinc-800 rounded-4xl animate-pulse" />
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass border-zinc-900 rounded-5xl border-dashed">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-zinc-950 rounded-full text-zinc-800 mb-8 border border-zinc-900 shadow-inner">
              <Search size={32} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Units Detected</h2>
            <p className="text-zinc-500 mt-4 max-w-xs mx-auto text-[10px] font-bold uppercase tracking-widest leading-relaxed">Adjust your operational filters or search parameters to locate the required service class.</p>
            <Button 
              variant="outline" 
              className="mt-10 border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 text-zinc-500 hover:text-primary transition-all px-8"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDebouncedSearch('');
              }}
            >
              Reset Protocol
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
