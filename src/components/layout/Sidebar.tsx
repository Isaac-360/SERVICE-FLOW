import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  CalendarCheck, 
  User as UserIcon, 
  Settings, 
  X,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Database
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Marketplace', icon: Store, href: '/marketplace' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mission Control', icon: MessageSquare, href: '/mission-control' },
  { label: 'My Bookings', icon: CalendarCheck, href: '/bookings' },
  { label: 'Profile', icon: UserIcon, href: '/profile' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transition-transform duration-300 transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
                <Briefcase size={18} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ServiceFlow.</span>
            </div>
            <button onClick={closeSidebar} className="lg:hidden p-1 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  "group-hover:text-primary"
                )} />
                {item.label}
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <>
                <div className="my-2 border-t border-zinc-900" />
                <NavLink
                  to="/admin/platform"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group',
                      isActive
                        ? 'bg-primary text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                    )
                  }
                >
                  <ShieldCheck size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Platform Executive</span>
                </NavLink>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'business') && (
              <NavLink
                to="/admin/services"
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group border border-blue-500/20 mt-4",
                  isActive 
                    ? "bg-blue-500/10 text-blue-400 font-medium border-blue-500/40" 
                    : "text-blue-400/70 hover:bg-blue-500/5 hover:text-blue-400"
                )}
              >
                <Database size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registry Node</span>
              </NavLink>
            )}
          </nav>

          {/* User Info / Auth State */}
          <div className="p-4 border-t border-zinc-900 bg-zinc-900/30 text-center">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-500 mb-2">Login to access more features</p>
                <NavLink 
                  to="/login" 
                  className="block w-full py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </NavLink>
              </div>
            ) : (
              <p className="text-xs text-zinc-600 font-medium">
                Identity: {user?.role || 'User'}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
