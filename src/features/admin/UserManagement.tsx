import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User, Trash2, Shield, UserCheck, Search, Filter, Mail, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'business' | 'admin';
  created_at: string;
}

export default function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast.error('Failed to synchronize user registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: 'business' | 'admin' | 'client') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Authorization update failed');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to purge this user from the system? This action is logged.')) return;
    
    try {
      // Note: In production, you'd call an Edge Function to delete the Auth user too
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast.success('User purged from registry');
      fetchUsers();
    } catch (error: any) {
      toast.error('Registry purge failed');
    }
  };

  const filteredUsers = profiles.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
              User <span className="text-primary">Registry</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Administrative Overwatch: Manage All Platform Identities</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Locate identity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 lg:w-80 transition-all"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader />
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest animate-pulse">Decrypting User Records...</p>
          </div>
        ) : (
          <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-4xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Authorization</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Enlistment Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {filteredUsers.map((profile) => (
                  <tr key={profile.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-primary font-bold">
                          {profile.full_name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-white font-black text-sm uppercase tracking-tight">{profile.full_name || 'Anonymous'}</p>
                          <p className="text-zinc-600 text-[10px] font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" /> {profile.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        profile.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : profile.role === 'business'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}>
                        {profile.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {profile.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {profile.role !== 'admin' && (
                          <button
                            onClick={() => handleUpdateRole(profile.id, 'admin')}
                            className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                            title="Promote to Admin"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        {profile.role !== 'business' && (
                          <button
                            onClick={() => handleUpdateRole(profile.id, 'business')}
                            className="p-2 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Promote to Merchant"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(profile.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Purge User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
