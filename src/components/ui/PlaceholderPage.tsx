import { Construction } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-10 max-w-md animate-fade-in">
        <div className="w-24 h-24 bg-zinc-900 border-2 border-primary/20 text-primary rounded-4xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/10">
          <Construction size={40} className="animate-float" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">System <span className="text-primary">Underway</span></h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">
            This sector is currently being optimized for peak performance. Protocol implementation is in progress.
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')} className="gap-3 h-14 px-8 font-black uppercase tracking-widest text-xs neon-glow">
          Return to Command Center
        </Button>
      </div>
    </div>
  );
}
