import { Settings, Shield, Globe, Bell, Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-2 text-on-background">System Parameters (Settings)</h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide">Configuring Global Wellcore Science Protocols</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-8">
          <h2 className="font-headline font-black text-xl uppercase italic tracking-tight flex items-center gap-3">
             <Shield className="w-6 h-6 text-primary" /> Security Thresholds
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center group">
               <div>
                  <div className="font-bold uppercase tracking-tight text-on-surface">Multi-Factor Protocol</div>
                  <div className="text-[10px] text-on-surface-variant font-medium">Verify login attempts via biometric or comms pulse</div>
               </div>
               <div className="w-12 h-6 bg-stone-200 rounded-full relative cursor-pointer group-hover:bg-primary/50 transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
               </div>
            </div>
            <div className="flex justify-between items-center group">
               <div>
                  <div className="font-bold uppercase tracking-tight text-on-surface">Secure Admin Lockdown</div>
                  <div className="text-[10px] text-on-surface-variant font-medium">Automatically terminate sessions after 60 minutes of zero activity</div>
               </div>
               <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm shadow-black/20"></div>
               </div>
            </div>
          </div>
          <button className="w-full py-4 bg-stone-900 text-white font-headline font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 rounded-xl hover:bg-primary hover:text-black transition-all">
             <Save className="w-4 h-4" /> Save Security Metadata
          </button>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-8 text-on-surface-variant italic">
          <p className="text-sm">Additional system parameters (Logistics Thresholds, Global Price Modifiers, and Comms API keys) will be exposed in the next version of the Administrative Command Center.</p>
        </div>
      </div>
    </div>
  );
}
