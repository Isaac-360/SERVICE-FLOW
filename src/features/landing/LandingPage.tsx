import { ArrowRight, Star, Shield, Zap, Users, Menu, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navbar Placeholder for Landing */}
      <nav className="fixed top-0 w-full z-50 glass py-4 px-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold">S</div>
          <span className="text-xl font-bold tracking-tight">SERVICE<span className="text-primary">FLOW.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#services" className="hover:text-primary transition-colors">Services</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
          <Button size="sm" onClick={() => navigate('/marketplace')} className="neon-glow">Explore Now</Button>
        </div>
        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-zinc-950/95 backdrop-blur-xl md:hidden flex flex-col p-6 space-y-8 animate-fade-in">
          <div className="flex flex-col space-y-4 text-lg font-bold text-zinc-400">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Features</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Services</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">About</a>
          </div>
          <div className="flex flex-col gap-4 pt-8 border-t border-zinc-800">
            <Button variant="ghost" size="lg" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>Login</Button>
            <Button size="lg" onClick={() => { setIsMobileMenuOpen(false); navigate('/marketplace'); }} className="neon-glow">Explore Now</Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 md:space-y-8 animate-slide-up text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap size={14} /> Keep your services simple
            </div>
            <h1 className="text-4xl md:text-7xl font-bold leading-tight mx-auto md:mx-0">
              Best service <br />
              <span className="text-primary">booking platform</span> <br />
              for your lifestyle.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed mx-auto md:mx-0">
              ServiceFlow unites local experts and customers in one seamless ecosystem. 
              Find, book, and manage everything in a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="gap-2 neon-glow px-8">
                Get Started <ArrowRight size={18} />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/marketplace')} className="px-8">
                Browse Marketplace
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-black flex items-center justify-center text-xs font-bold">
                  +2k
                </div>
              </div>
              <div className="text-sm">
                <div className="font-bold">168K+</div>
                <div className="text-muted-foreground">Realtime Users</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in w-full">
            <div className="relative z-10 w-full max-w-md mx-auto aspect-square md:aspect-3/4 bg-zinc-900 rounded-5xl border-8 border-zinc-800 overflow-hidden shadow-2xl">
              
              {/* Background Image */}
              <img
                src="/home_cleaning_service.png"
                alt="Modern Home Cleaning"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/80" />
              <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent" />

              <div className="p-8 space-y-6 relative h-full flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center">
                    <Zap className="text-primary" />
                  </div>
                  <div className="px-3 py-1 bg-primary rounded-full text-[10px] font-bold text-black uppercase">Active</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-primary/80 font-medium">Top Rated Service</div>
                  <div className="text-3xl font-bold text-white drop-shadow-lg">Modern Home Cleaning</div>
                  <div className="flex text-primary gap-1">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <div className="mt-auto bg-white/10 p-4 rounded-4xl backdrop-blur-md space-y-3 border border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">Provider</span>
                    <span className="font-medium text-white">CleanCo Experts</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">Next Slot</span>
                    <span className="font-medium text-primary">Today, 4:00 PM</span>
                  </div>
                  <Button className="w-full h-10 text-xs">Book Appointment</Button>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="services" className="py-16 md:py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Browse <span className="text-primary">Sectors</span></h2>
            <p className="text-zinc-500 max-w-md font-bold uppercase tracking-widest text-[10px]">Explore our elite network of verified professional services.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/marketplace')} className="h-12 px-8 border-zinc-800 text-[10px] font-black uppercase tracking-widest">
            View All Sectors
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Technology', count: '1.2k+', icon: Zap },
            { label: 'Design', count: '850+', icon: Star },
            { label: 'Security', count: '420+', icon: Shield },
            { label: 'Events', count: '630+', icon: Users },
            { label: 'Logistics', count: '940+', icon: Zap },
            { label: 'Legal', count: '310+', icon: Shield },
          ].map((cat, i) => (
            <button 
              key={i}
              onClick={() => navigate(`/marketplace?category=${cat.label}`)}
              className="glass p-6 rounded-3xl border-zinc-800 hover:border-primary/50 transition-all group text-left space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <cat.icon size={20} />
              </div>
              <div>
                <div className="font-black text-white text-xs uppercase tracking-tight">{cat.label}</div>
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{cat.count} Units</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Business Solutions Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="glass rounded-[3rem] border-zinc-800 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 rounded-full blur-[120px] -z-10 group-hover:bg-primary/10 transition-all duration-700" />
          
          <div className="flex-1 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Shield size={12} /> Enterprise Ready
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Strategic <br />
              <span className="text-primary">Business</span> Units
            </h2>
            <p className="text-zinc-500 text-lg font-bold uppercase tracking-widest text-[11px] max-w-sm leading-relaxed">
              Deploy verified professional teams and manage complex operations with our advanced Executive Overwatch console.
            </p>
            <ul className="space-y-4">
              {[
                'Verified Industry Experts',
                'Advanced Resource Management',
                'Secure Escrow Transactions',
                'Direct Executive Communication'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Zap size={10} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={() => navigate('/signup')} className="mt-4 neon-glow px-10">
              Join as a Provider
            </Button>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 rounded-4xl border-8 border-zinc-900/50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-700">
              <img 
                src="/business_hero_concept.png" 
                alt="Business Concept" 
                loading="lazy"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              {/* Floating Growth Rate Card — top-right overlay */}
              <div className="absolute top-4 right-4 glass p-3 rounded-2xl border-zinc-700/50 shadow-2xl backdrop-blur-md hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-primary">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Growth Rate</div>
                    <div className="text-sm font-black text-white">+24.8%</div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest">Active Session</div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">Core Strategy Node-01</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Live Link</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Your <span className="text-primary">trusted</span> partner for <br /> local services.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide a secure and efficient platform for both providers and customers to interact, 
            booking services with confidence and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass p-8 space-y-6 hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Secure Payments</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every transaction is protected and escrowed until the service is completed to your satisfaction.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all">
              Learn More <ArrowRight size={16} />
            </a>
          </Card>

          <Card className="bg-primary text-black p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Zap size={100} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Instant Booking</h3>
              <p className="text-black/80 text-sm leading-relaxed">
                No more back-and-forth messages. See real-time availability and book your slot in seconds.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-black text-sm font-bold">
              Explore Services <ArrowRight size={16} />
            </a>
          </Card>

          <Card className="glass p-8 space-y-6 hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Verified Experts</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We strictly vet all service providers to ensure you only get the highest quality of work.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all">
              Join as Provider <ArrowRight size={16} />
            </a>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black font-bold text-xs">S</div>
            <span className="text-lg font-bold tracking-tight text-white">SERVICEFLOW.</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 ServiceFlow Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
