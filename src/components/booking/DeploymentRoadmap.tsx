import React from 'react';
import { CheckCircle2, Circle, Rocket, FileText, Hammer, Send, ShieldCheck, Clock } from 'lucide-react';

export type DeploymentStage = 'pending' | 'contract_signed' | 'in_progress' | 'draft_delivered' | 'final_approval' | 'deployed';

interface DeploymentRoadmapProps {
  currentStatus: DeploymentStage | string;
}

const stages: { status: DeploymentStage; label: string; icon: any; description: string }[] = [
  { 
    status: 'contract_signed', 
    label: 'Contract Signed', 
    icon: FileText,
    description: 'Protocol initiated and terms agreed.'
  },
  { 
    status: 'in_progress', 
    label: 'Work in Progress', 
    icon: Hammer,
    description: 'Units are actively executing requirements.'
  },
  { 
    status: 'draft_delivered', 
    label: 'Draft Delivered', 
    icon: Send,
    description: 'Initial payload submitted for review.'
  },
  { 
    status: 'final_approval', 
    label: 'Final Approval', 
    icon: ShieldCheck,
    description: 'Quality assurance verified and approved.'
  },
  { 
    status: 'deployed', 
    label: 'Deployed', 
    icon: Rocket,
    description: 'Mission accomplished. Assets are live.'
  }
];

export default function DeploymentRoadmap({ currentStatus }: DeploymentRoadmapProps) {
  const getStageIndex = (status: string) => {
    if (status === 'pending') return -1;
    return stages.findIndex(s => s.status === status);
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-zinc-800 hidden md:block" />
        <div 
          className="absolute top-5 left-8 h-0.5 bg-primary transition-all duration-1000 hidden md:block" 
          style={{ width: `${Math.max(0, (currentIndex / (stages.length - 1)) * 100)}%` }}
        />

        {/* Stages */}
        <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="flex-1 flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 relative group">
                {/* Node icon */}
                <div className={`
                  z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                  ${isCompleted ? 'bg-primary text-black' : isCurrent ? 'bg-zinc-900 border-2 border-primary text-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600'}
                `}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} className={isCurrent ? 'animate-pulse' : ''} />}
                </div>

                {/* Text Content */}
                <div className="md:mt-4 md:text-center">
                  <h4 className={`text-xs font-black uppercase tracking-widest ${isFuture ? 'text-zinc-600' : 'text-white'}`}>
                    {stage.label}
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity max-w-[120px]">
                    {stage.description}
                  </p>
                </div>

                {/* Status Indicator for Mobile */}
                {isCurrent && (
                  <div className="md:hidden ml-auto">
                    <div className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase animate-pulse">
                      Active Phase
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentStatus === 'pending' && (
        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Stalled</h4>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Awaiting provider confirmation to initiate deployment sequence.</p>
          </div>
        </div>
      )}
    </div>
  );
}
