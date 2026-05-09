import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../../types/service.types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full group glass border-zinc-800 hover:border-primary/30 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-widest shadow-lg">
          {service.category}
        </div>
      </div>
      
      <Card.Content className="flex-1 flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold text-white">{service.rating}</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-tight">({service.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <MapPin size={14} className="text-primary/50" />
            {service.location}
          </div>
        </div>
        
        <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Standard Price</span>
            <span className="text-2xl font-black text-white">GHS {service.price}<span className="text-xs font-medium text-zinc-500 ml-1">/unit</span></span>
          </div>
          <Link to={`/services/${service.id}`}>
            <Button size="sm" className="px-5">View Details</Button>
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}
