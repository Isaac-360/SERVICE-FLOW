import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowRight, Home } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BookingSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-10">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-28 h-28 bg-primary rounded-full flex items-center justify-center text-black mx-auto shadow-[0_0_40px_rgba(204,255,0,0.4)]"
        >
          <Check size={56} strokeWidth={4} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Reservation <br /><span className="text-primary">Secured</span></h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Mission confirmed. Your service deployment is scheduled. Check your secure inbox for full operational details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass p-8 rounded-5xl border-zinc-800 space-y-5"
        >
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-zinc-500">Operation ID</span>
            <span className="text-white">#SF-94821</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-zinc-500">Service Class</span>
            <span className="text-white">Professional Deployment</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-zinc-500">Protocol Status</span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">Verified</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/dashboard" className="flex-1">
            <Button className="w-full h-14 flex gap-3 font-black uppercase tracking-widest text-xs neon-glow">
              <Calendar size={18} />
              Operational View
            </Button>
          </Link>
          <Link to="/marketplace" className="flex-1">
            <Button variant="secondary" className="w-full h-14 flex gap-3 font-black uppercase tracking-widest text-xs border-zinc-800">
              <Home size={18} />
              Return Base
            </Button>
          </Link>
        </motion.div>
        
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
          Encountering issues? <a href="#" className="text-primary hover:underline transition-all">Contact Command Center</a>
        </p>
      </div>
    </div>
  );
}
