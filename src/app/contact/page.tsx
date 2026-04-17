"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Protocol Request Transmitted Successfully.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="bg-surface text-on-surface py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-headline font-black uppercase italic tracking-tighter drop-shadow-lg mb-4">
            Initialize <span className="text-primary tracking-normal italic">Contact</span>
          </h1>
          <p className="text-on-surface-variant text-lg">
            Connect with our clinical support team for protocol guidance, order inquiries, or distribution logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
               <h3 className="text-2xl font-headline font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">headset_mic</span>
                  Command Center Support
               </h3>
               <p className="text-on-surface-variant leading-relaxed">
                 Our support operators are available 24/7 to assist you. Responses typically occur within a 2-hour window.
               </p>
               <div className="mt-8 space-y-6">
                 <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary-dim mt-1">location_on</span>
                    <div>
                       <h4 className="font-headline font-bold uppercase text-sm tracking-widest text-on-surface-variant mb-1">Global Headquarters</h4>
                       <p className="text-lg font-black uppercase text-on-surface italic">Titan Elite Labs, Sector 9</p>
                       <p className="text-on-surface-variant font-medium">New Delhi, DL 110001, India</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary-dim mt-1">call</span>
                    <div>
                       <h4 className="font-headline font-bold uppercase text-sm tracking-widest text-on-surface-variant mb-1">Direct Hotline</h4>
                       <a href="tel:+917015553297" className="text-2xl font-black uppercase text-on-surface italic hover:text-primary transition-colors">+91 7015553297</a>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary-dim mt-1">mail</span>
                    <div>
                       <h4 className="font-headline font-bold uppercase text-sm tracking-widest text-on-surface-variant mb-1">Electronic Mail</h4>
                       <a href="mailto:support@wellcorescience.com" className="text-xl font-black text-on-surface hover:text-primary transition-colors">support@wellcorescience.com</a>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
            <h3 className="text-2xl font-headline font-black uppercase tracking-tight mb-8">Transmit Secure Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Operator Identity (Name)</label>
                <input required type="text" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Secure Comm Link (Email)</label>
                <input required type="email" className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl" placeholder="operator@domain.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Encrypted Payload (Message)</label>
                <textarea required rows={5} className="w-full bg-surface-container border-b-4 border-transparent focus:border-primary px-6 py-4 font-black transition-all focus:outline-none rounded-t-xl resize-none" placeholder="Provide protocol inquiry details here..."></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-5 bg-stone-900 text-white hover:bg-primary hover:text-black rounded-2xl font-headline font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl shadow-stone-900/40 disabled:bg-stone-500 active:scale-95 flex justify-center items-center gap-3"
              >
                {submitting ? 'Transmitting...' : 'Initialize Transmission'} <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
