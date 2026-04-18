"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
      } else {
        throw new Error(data.error || "Failed to load");
      }
    } catch (error: any) {
      toast.error("Failed to fetch subject manifest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-2 text-on-background">Subject Manifest (Customers)</h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide">Registry of Authorized Personnel & Protocol Subjects</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Syncing Subject Data...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Users className="w-16 h-16 text-stone-200" />
            <p className="font-headline font-black uppercase text-on-surface-variant opacity-50 text-sm">No Registered Subjects Found</p>
            <p className="text-[10px] text-on-surface-variant/60 tracking-wide">Customers will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.25em] font-black">
                  <th className="p-8">Subject Identity</th>
                  <th className="p-8">Verification Date</th>
                  <th className="p-8">Communication Vector</th>
                  <th className="p-8">Auth Provider</th>
                  <th className="p-8 text-right">Access Level</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {customers.map((c: any) => (
                  <tr key={c._id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20 text-lg">
                            {c.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-black text-on-surface uppercase tracking-tight italic text-lg">{c.name}</div>
                          <div className="text-[10px] font-mono text-on-surface-variant">ID: {c._id.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 font-medium text-on-surface-variant">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Mail className="w-3 h-3 text-primary" /> {c.email}
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        c.provider === 'google' 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {c.provider || 'credentials'}
                      </span>
                    </td>
                    <td className="p-8 text-right font-black italic text-primary uppercase text-xs">
                      Standard Protocol
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && customers.length > 0 && (
        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 text-right">
          Total Subjects: {customers.length}
        </div>
      )}
    </div>
  );
}
