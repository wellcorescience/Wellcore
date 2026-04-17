export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface text-on-surface py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter mb-4">
            Security &amp; Privacy Protocols
          </h1>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-black text-primary">Last Updated: April 2026</p>
        </div>

        <div className="space-y-12 text-on-surface-variant leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">1. Data Initialization</h2>
            <p>
              At Wellcore Science, we take the security of your personal telemetry and operational data as seriously as we take the formulation of our protocols. This document outlines the secure acquisition, processing, and storage of your information.
            </p>
          </section>

          <section className="space-y-4 border-t border-outline-variant/10 pt-8">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">2. Information Acquisition</h2>
            <p>
              We collect data necessary to fulfill our performance obligations to you. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
               <li><strong className="text-on-surface">Identity Assets:</strong> Name, Email mapping, encrypted access keys.</li>
               <li><strong className="text-on-surface">Logistics Data:</strong> Delivery vectors (shipping addresses), and contact locators.</li>
               <li><strong className="text-on-surface">Financial Protocols:</strong> Our payment gateway (Razorpay) handles all financial data with military-grade encryption. Wellcore Science servers do not store your core financial data.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-outline-variant/10 pt-8">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">3. Data Utilization</h2>
            <p>
              Your personal data is solely utilized to maximize your performance output. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
               <li>Execute protocol deployments (process orders).</li>
               <li>Transmit essential operational updates and clinical findings.</li>
               <li>Enhance the user interface and overall command center experience.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-outline-variant/10 pt-8">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">4. Security Infrastructure</h2>
            <p>
              We employ state-of-the-art encryption protocols to safeguard your data perimeter against unauthorized ingress. Our databases operate on secure, isolated networks with rigorous continuous monitoring.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
