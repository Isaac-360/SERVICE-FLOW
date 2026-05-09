import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass: string;
  iconColorClass: string;
}

export default function StatCard({ title, value, icon: Icon, trend, colorClass, iconColorClass }: StatCardProps) {
  return (
    <Card className="glass border-zinc-800 hover:border-primary/30 transition-all duration-300">
      <Card.Content className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
            
            {trend && (
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                  trend.isPositive ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                )}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}
                </span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">vs prev</span>
              </div>
            )}
          </div>
          
          <div className={cn("p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-primary shadow-lg shadow-primary/5")}>
            <Icon size={20} />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
