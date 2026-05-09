import { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  LogOut,
  ChevronRight,
  Check,
  Smartphone
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

type Tab = 'account' | 'security' | 'notifications' | 'billing';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updateUser({ avatar: undefined });
    toast.success('Profile photo removed');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-500">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              <tab.icon size={18} className={cn(
                "transition-colors",
                activeTab === tab.id ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {tab.label}
            </button>
          ))}
          <div className="mt-8 pt-8 border-t border-zinc-900">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-sm font-semibold w-full">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'account' && (
            <div className="space-y-8 animate-fade-in">
              <Section title="Profile Information" description="Update your personal details and public profile.">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                        <img 
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-white uppercase">Change</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Your Photo</h4>
                      <p className="text-xs text-zinc-500 mb-3">Allowed JPG, GIF or PNG. Max size of 2MB</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-[10px]"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-[10px] text-red-500 hover:bg-red-500/5"
                          onClick={removePhoto}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                      <input 
                        className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                        defaultValue={user.name} 
                        onChange={(e) => updateUser({ name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                      <input className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-sm text-zinc-500 outline-none" defaultValue={user.email} disabled />
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Regional Settings" description="Configure your language and timezone preferences.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Language</label>
                    <select className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white outline-none">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Timezone</label>
                    <select className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white outline-none">
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <Section title="Password" description="Change your password to keep your account secure.">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:border-primary/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:border-primary/50 outline-none" />
                  </div>
                  <Button className="mt-4">Update Password</Button>
                </div>
              </Section>

              <Section title="Security Protocols" description="Manage additional security layers for your identity.">
                <div className="space-y-4">
                  <SettingToggle 
                    title="Two-Factor Authentication" 
                    description="Secure your account with an additional verification layer." 
                    enabled={false} 
                  />
                  <SettingToggle 
                    title="Session Tracking" 
                    description="Receive alerts when a new device logs into your account." 
                    enabled={true} 
                  />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <Section title="Email Notifications" description="Choose which updates you'd like to receive via email.">
                <div className="space-y-4">
                  <SettingToggle title="Booking Updates" description="Notifications about your active and upcoming bookings." enabled={true} />
                  <SettingToggle title="Marketplace Insights" description="Weekly reports on service trends and pricing." enabled={false} />
                  <SettingToggle title="Security Alerts" description="Important updates regarding your account security." enabled={true} />
                </div>
              </Section>
            </div>
          )}

          <div className="flex justify-end pt-8 border-t border-zinc-900">
            <Button className="px-8 shadow-primary/10">Save All Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <Card className="glass overflow-hidden border-zinc-800">
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-zinc-500 mt-1">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </Card>
  );
}

function SettingToggle({ title, description, enabled }: { title: string, description: string, enabled: boolean }) {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-bold text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none",
          isOn ? "bg-primary" : "bg-zinc-800"
        )}
      >
        <span className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          isOn ? "translate-x-6" : "translate-x-1"
        )} />
      </button>
    </div>
  );
}
