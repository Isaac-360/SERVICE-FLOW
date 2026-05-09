import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

export default function AppLayout() {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <Sidebar />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "lg:ml-64"
      )}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
        <footer className="py-6 px-10 border-t border-zinc-900 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} ServiceFlow Marketplace. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
