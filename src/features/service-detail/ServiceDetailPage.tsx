import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  MessageSquare, 
  Share2,
  Calendar
} from 'lucide-react';
import { getServiceById } from '../../api/servicesApi';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(1); // Default to Gold (index 1)

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Loader fullPage />;
  if (!service) return <div className="text-center py-20">Service not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                {service.category}
              </span>
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Business
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-primary">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" className="opacity-20" />
                </div>
                <span className="font-bold text-white text-lg">{service.rating}</span>
                <span className="text-xs font-medium">({service.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span className="text-sm font-medium">{service.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="text-sm font-medium">Response: ~2h</span>
              </div>
            </div>
          </div>

          {/* Image & Gallery Carousel */}
          <div className="space-y-4">
            <div className="aspect-21/9 rounded-4xl overflow-hidden shadow-2xl border border-zinc-800 relative group">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Gallery Thumbnails */}
            {service.gallery && service.gallery.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-primary shadow-[0_0_15px_rgba(204,255,0,0.2)] cursor-pointer">
                  <img src={service.image} className="w-full h-full object-cover" />
                </div>
                {service.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-zinc-800 hover:border-primary/50 transition-all cursor-pointer">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Intro Section */}
          {service.videoUrl && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,1)]" />
                Mission Briefing (Video)
              </h2>
              <div className="aspect-video rounded-4xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center relative group">
                {service.videoUrl.includes('youtube.com') || service.videoUrl.includes('youtu.be') ? (
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${service.videoUrl.split('v=')[1]?.split('&')[0] || service.videoUrl.split('/').pop()}`}
                    title="Service Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center px-10">
                    <p>External Protocol Link Detected</p>
                    <a href={service.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2 block">Open Secure Video Stream</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Operation Protocol</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed text-lg font-medium">
              <p>{service.description}</p>
            </div>
          </div>

          {/* Business Info */}
          <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-4xl glass">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black font-black text-3xl shadow-lg shadow-primary/20">
                {service.businessName.charAt(0)}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h4 className="font-black text-white text-xl">{service.businessName}</h4>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">Professional Provider Since 2018</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-4">
                   <button className="text-primary text-xs font-black uppercase tracking-widest hover:text-primary/80 transition-colors">View Profile</button>
                   <button className="text-primary text-xs font-black uppercase tracking-widest hover:text-primary/80 transition-colors">Contact Business</button>
                </div>
              </div>
              <Button variant="outline" className="border-zinc-800 hover:border-primary/30 h-10 text-xs font-black uppercase">Follow</Button>
            </div>
          </Card>
        </div>

        {/* Sidebar / Pricing */}
        <div className="space-y-6 h-fit md:sticky md:top-24">
          <Card className="shadow-2xl glass border-primary/20 rounded-4xl overflow-hidden">
            <Card.Content className="p-0">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                    Standard Protocol
                  </span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      GHS {service.price}
                    </span>
                    <span className="text-zinc-500 ml-1 font-bold text-sm uppercase">/unit</span>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                  Complete professional implementation of this service with full quality guarantee and support.
                </p>

                <div className="space-y-4 py-6 border-y border-zinc-800/50">
                  {['Verified Professional', 'Quality Assurance', 'Secure Payment', 'Direct Briefing'].map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-zinc-300 text-[11px] font-bold uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feat}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Link to={`/booking/${service.id}`} className="block">
                    <Button className="w-full h-14 text-base font-black uppercase tracking-widest neon-glow" size="lg">
                      Deploy Mission
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-14 flex gap-2 font-black uppercase tracking-widest text-xs border-zinc-800 hover:border-primary/50" size="lg">
                     <MessageSquare size={18} />
                     Custom Request
                  </Button>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">
                  <Share2 size={14} />
                  Share Operation
                </button>
              </div>
            </Card.Content>
          </Card>

          {/* Why Choose Us */}
          <div className="bg-zinc-900/30 rounded-4xl border border-zinc-800 p-8 space-y-6 glass">
            <h4 className="font-black text-white uppercase tracking-tight text-lg">Platform Trust</h4>
            <ul className="space-y-4">
              {['Vetted Professionals', 'Secure Crypto Payments', 'Guaranteed Quality Output'].map((item) => (
                <li key={item} className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-wide">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
