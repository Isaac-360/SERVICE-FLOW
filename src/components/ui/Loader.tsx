import { cn } from '../../utils/cn';

interface LoaderProps {
  fullPage?: boolean;
  className?: string;
}

export default function Loader({ fullPage, className }: LoaderProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-2 border-zinc-800 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 border-2 border-zinc-800 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
