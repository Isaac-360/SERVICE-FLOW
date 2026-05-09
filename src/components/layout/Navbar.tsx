import { Menu, Bell, Search, User, LogOut, Briefcase, Globe } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  const { toggleSidebar } = useUIStore();
  const { user, isAuthenticated, logout, toggleMode } = useAuthStore();

  return (
    <header className="h-16 border-b border-zinc-900 bg-background/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800 w-64 lg:w-80 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:bg-black">
          <Search size={16} className="text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search services..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <button className="p-2 text-zinc-400 hover:bg-zinc-900 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
        
        <div className="h-8 w-px bg-zinc-800 mx-1" />

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white leading-none">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{user?.role || 'Customer'}</p>
            </div>
            <div className="group relative">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary font-bold border-2 border-zinc-700 shadow-sm cursor-pointer overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/platform"
                      className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-primary/10 flex items-center gap-2 transition-colors"
                    >
                      <Globe size={16} />
                      Platform Executive
                    </Link>
                    <Link
                      to="/admin/users"
                      className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                    >
                      <User size={16} />
                      User Registry
                    </Link>
                    <div className="my-1 border-t border-zinc-800" />
                  </>
                )}
                {(user?.role === 'admin' || user?.role === 'business') && (
                  <>
                    <Link
                      to="/admin/services"
                      className="w-full px-4 py-2 text-left text-sm text-blue-400 hover:bg-blue-950/30 flex items-center gap-2 transition-colors"
                    >
                      <Briefcase size={16} />
                      Services Manager
                    </Link>
                    <div className="my-1 border-t border-zinc-800" />
                  </>
                )}
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
            <Button size="sm" onClick={() => window.location.href = '/signup'} className="neon-glow">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
