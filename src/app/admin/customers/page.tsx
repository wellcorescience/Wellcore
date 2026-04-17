import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Users, Mail, Phone, Calendar } from "lucide-react";

export default async function AdminCustomers() {
  await dbConnect();
  const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-2 text-on-background">Subject Manifest (Customers)</h1>
        <p className="text-on-surface-variant text-sm font-medium tracking-wide">Registry of Authorized Personnel & Protocol Subjects</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[10px] text-on-surface-variant uppercase tracking-[0.25em] font-black">
                <th className="p-8">Subject Identity</th>
                <th className="p-8">Verification Date</th>
                <th className="p-8">Communication Vector</th>
                <th className="p-8 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map((c: any) => (
                <tr key={c._id.toString()} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-on-surface uppercase tracking-tight italic text-lg">{c.name}</div>
                        <div className="text-[10px] font-mono text-on-surface-variant">ID: {c._id.toString().slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 font-medium text-on-surface-variant">
                    {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Mail className="w-3 h-3 text-primary" /> {c.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-right font-black italic text-primary uppercase text-xs">
                    Standard protocol
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
