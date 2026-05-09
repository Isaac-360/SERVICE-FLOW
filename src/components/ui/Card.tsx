import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
}

Card.Header = ({ children, className }: CardProps) => (
  <div className={cn("p-6 border-b border-zinc-800", className)}>
    {children}
  </div>
);

Card.Content = ({ children, className }: CardProps) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

Card.Footer = ({ children, className }: CardProps) => (
  <div className={cn("p-6 border-t border-zinc-800 bg-zinc-950/40", className)}>
    {children}
  </div>
);
