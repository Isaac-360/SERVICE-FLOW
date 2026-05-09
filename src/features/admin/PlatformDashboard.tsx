import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Globe,
  Database,
  ArrowUpRight,
  Server
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader />
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] animate-pulse">Initializing Global Registry...</p>
      </div>
    );
  }

  const platformMetrics = [
    {
      label: 'Total Platform Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-400',
      chartColor: '#60a5fa',
      description: 'Active clients across all sectors',
      data: [{v: 10}, {v: 25}, {v: 15}, {v: 40}, {v: 30}, {v: 50}, {v: 45}]
    },
    {
      label: 'Verified Merchants',
      value: stats.totalMerchants.toLocaleString(),
      change: '+5.2%',
      icon: Briefcase,
      color: 'text-primary',
      chartColor: '#d4ff00',
      description: 'System-wide service providers',
      data: [{v: 5}, {v: 8}, {v: 12}, {v: 10}, {v: 20}, {v: 18}, {v: 25}]
    },
    {
      label: 'Global Service Nodes',
      value: stats.totalServices.toLocaleString(),
      change: '+18.4%',
      icon: Server,
      color: 'text-emerald-400',
      chartColor: '#34d399',
      description: 'Deployed service registries',
      data: [{v: 20}, {v: 22}, {v: 30}, {v: 28}, {v: 40}, {v: 35}, {v: 50}]
    },
    {
      label: 'Gross Platform Volume',
      value: `GHS ${stats.totalRevenue.toLocaleString()}`,
      change: '+22.1%',
      icon: TrendingUp,
      color: 'text-purple-400',
      chartColor: '#c084fc',
      description: 'Total processed credit velocity',
      data: [{v: 100}, {v: 120}, {v: 105}, {v: 150}, {v: 140}, {v: 180}, {v: 200}]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-12 relative overflow-hidden">
      {/* Background Grid & Orbs */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Status: Authorized</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(212,255,0,1)]" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Platform <span className="text-primary">Executive</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">Super Admin Command Interface v4.0.2</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Button 
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Users className="w-4 h-4" />
              Global User Registry
            </Button>
            <Button 
              onClick={() => navigate('/admin/services')}
              className="w-full sm:w-auto h-14 px-8 neon-glow text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Database className="w-4 h-4" />
              Service Registry Control
            </Button>
          </div>
        </div>

        {/* Global Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {platformMetrics.map((stat, i) => (
            <div key={i} className="bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800 p-8 rounded-4xl group hover:border-primary/30 hover:drop-shadow-[0_0_15px_rgba(212,255,0,0.15)] transition-all duration-500 relative overflow-hidden">
              {/* Background AreaChart */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pt-16 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.data}>
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stat.chartColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={stat.chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={stat.chartColor} fillOpacity={1} fill={`url(#gradient-${i})`} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <stat.icon className="w-24 h-24" />
              </div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-white tracking-tighter font-mono">{stat.value}</p>
                <p className="text-[10px] text-zinc-600 font-medium">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* System Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Control Card */}
          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Infrastructure</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Real-time Node Monitoring</p>
                </div>
                <Activity className="text-primary w-6 h-6 animate-pulse" />
             </div>

             <div className="space-y-6">
                {[
                  { name: 'Core API Layer', status: 'Optimal', load: '14%', color: 'bg-primary' },
                  { name: 'Database Clusters', status: 'Stable', load: '42%', color: 'bg-blue-400' },
                  { name: 'Media Storage (CDN)', status: 'Optimal', load: '8%', color: 'bg-emerald-400' },
                  { name: 'Auth Protocol v2', status: 'Stable', load: '27%', color: 'bg-purple-400' },
                ].map((node, i) => (
                  <div key={i} className="bg-zinc-950/50 border border-zinc-800/50 p-6 rounded-2xl group hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-6 ${node.color} rounded-full`} />
                        <span className="text-xs font-black text-white uppercase tracking-widest">{node.name}</span>
                      </div>
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{node.status} • {node.load} LOAD</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${node.color} transition-all duration-1000`} 
                        style={{ width: node.load }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-6">
             <div className="bg-primary/5 border border-primary/20 rounded-4xl p-8">
                <ShieldCheck className="text-primary w-10 h-10 mb-6" />
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Security Protocol</h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">Global override engaged. All administrative actions are logged to the blockchain registry.</p>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>Encryption</span>
                      <span className="text-primary">AES-256</span>
                   </div>
                   <div className="flex items-center justify-between text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>Access Level</span>
                      <span className="text-primary">SuperUser</span>
                   </div>
                </div>
             </div>

             <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-4xl p-8">
                <Globe className="text-zinc-500 w-10 h-10 mb-6" />
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Network Nodes</h4>
                <div className="flex -space-x-3 mb-6">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`} alt="user" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center text-[8px] font-black text-primary">
                      +1.4k
                   </div>
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-center">New User Velocity</p>
                <div className="flex justify-center gap-1">
                   {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                     <div key={i} className="w-2 bg-zinc-800 rounded-full flex items-end h-12 overflow-hidden">
                        <div className="w-full bg-primary/40" style={{ height: `${h}%` }} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
