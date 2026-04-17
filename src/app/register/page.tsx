"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { UserPlus, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label text-[10px] font-black tracking-[0.2em] uppercase rounded-sm mb-4">Onboarding Protocol</span>
            <h2 className="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter italic">
              Join Protocol
            </h2>
            <p className="mt-4 text-xs text-on-surface-variant font-black uppercase tracking-widest leading-relaxed">
              Initialize your science-backed performance profile via Google OAUTH.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-5 bg-white text-black font-headline font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </button>
            
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/5">
              <p className="text-[9px] text-on-surface-variant font-medium leading-relaxed italic text-center">
                Registration is limited to verified social identities to ensure protocol integrity and researcher validation.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center pt-8 border-t border-outline-variant/10">
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest flex items-center justify-center gap-2">
              Already verified?{" "}
              <Link href="/login" className="text-primary hover:underline transition-all">
                Access Laboratory
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
