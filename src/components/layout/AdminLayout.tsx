import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Zap,
  Bell,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  {
    to: '/admin/platform',
    label: 'Platform Overview',
    icon: LayoutDashboard,
    description: 'Global metrics & system health',
    adminOnly: true,
  },
  {
    to: '/admin/users',
    label: 'User Registry',
    icon: Users,
    description: 'Manage platform identities',
    adminOnly: true,
  },
  {
    to: '/admin/services',
    label: 'Service Registry',
    icon: Briefcase,
    description: 'Deploy & manage services',
  },
  {
    to: '/admin/create-admin',
    label: 'Create Admin',
    icon: UserPlus,
    description: 'Provision new administrators',
    adminOnly: true,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Session terminated');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-zinc-900/95 backdrop-blur-2xl border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,255,0,0.4)]">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-tight">
                  Service<span className="text-primary">Flow</span>
                </p>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(212,255,0,0.8)]" />
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
              System Active
            </p>
            <Zap className="w-3 h-3 text-primary ml-auto" />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === 'admin')
            .map(({ to, label, icon: Icon, description }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(212,255,0,0.05)]'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-primary/20' : 'bg-zinc-800 group-hover:bg-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-widest truncate">{label}</p>
                    <p className="text-[9px] font-medium text-zinc-600 truncate mt-0.5">{description}</p>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 shrink-0 opacity-60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile + Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <span className="text-purple-400 font-black text-xs uppercase">
                {user?.name?.[0] || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-xs uppercase tracking-tight truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[9px] text-zinc-600 font-medium truncate">{user?.email}</p>
            </div>
            <div className={`px-2 py-0.5 border rounded-lg ${
              user?.role === 'admin' 
                ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                : 'bg-primary/10 border-primary/20 text-primary'
            }`}>
              <p className="text-[8px] font-black uppercase tracking-widest">
                {user?.role === 'admin' ? 'ADMIN' : 'MERCHANT'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all group"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Terminate Session
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Top Bar (Mobile) */}
        <header className="sticky top-0 z-30 lg:hidden bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-white font-black text-sm uppercase tracking-tight">
              Admin Panel
            </span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-zinc-400 hover:text-primary transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
