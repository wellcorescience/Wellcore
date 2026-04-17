"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { ShieldAlert, Fingerprint } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) throw new Error("Invalid admin protocol credentials");

      toast.success("Admin Protocol Initialized");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label text-[10px] font-black tracking-[0.2em] uppercase rounded-sm mb-4">Laboratory Access</span>
            <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter italic">
              {showAdminLogin ? "Admin Console" : "Welcome Back"}
            </h2>
            <p className="mt-4 text-xs text-on-surface-variant font-medium uppercase tracking-widest leading-relaxed">
              {showAdminLogin 
                ? "Enter encrypted credentials for restricted access." 
                : "Initialize performance protocol via verified social OAUTH."}
            </p>
          </div>

          {!showAdminLogin ? (
            <div className="space-y-6">
               <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-5 bg-white text-black font-headline font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
              
              <div className="text-center pt-8">
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-primary transition-colors flex items-center gap-2 mx-auto"
                >
                  <ShieldAlert className="w-3 h-3" /> Staff Protocol Override
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Admin Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none"
                    placeholder="admin@wellcore.science"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Security Protocol</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-4 font-medium transition-all focus:outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 font-headline font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 ${loading ? 'bg-stone-500 text-stone-300' : 'bg-primary-fixed text-on-primary-fixed hover:scale-[1.02]'}`}
                >
                  {loading ? "Authenticating..." : "Deploy Admin Session"}
                  <Fingerprint className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="w-full text-[10px] font-black tracking-widest uppercase text-stone-500 hover:text-white transition-colors"
                >
                  Return to standard access
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center pt-8 border-t border-outline-variant/10">
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
              New Investigator?{" "}
              <Link href="/register" className="text-primary hover:underline transition-all">
                Join Protocol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
