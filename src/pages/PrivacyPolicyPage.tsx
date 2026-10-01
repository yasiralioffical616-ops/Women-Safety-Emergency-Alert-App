import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>Data Protection Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Last Updated: October 2026 · Aman Safar Women's Safety Architecture
          </p>
        </div>

        <div className="prose prose-sm text-slate-600 space-y-6 text-xs sm:text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              1. Our Foundational Privacy Principle
            </h2>
            <p>
              Aman Safar was architected specifically for women, students, and travelers. We treat personal location and contact details with the highest level of care. We do not sell user data, run third-party tracking scripts, or build advertising profiles.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              2. Geolocation Access & Ephemeral Storage
            </h2>
            <p>
              Your physical location is accessed <strong>only</strong> when you explicitly take an action that requires it:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>When you activate the SOS distress sequence</li>
              <li>When you start a timed Live Location sharing session</li>
              <li>When you tag a hazard or unsafe spot on the Community Map</li>
            </ul>
            <p className="mt-2">
              Live location sharing links are time-limited (15, 30, or 60 minutes) and protected by unique cryptographic tokens. Once expired, sharing ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              3. Protection of Trusted Emergency Contacts
            </h2>
            <p>
              The names, relationships, phone numbers, and WhatsApp addresses of your trusted emergency contacts are stored securely. They are never published in public directories, community maps, or search engines.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              4. Community Safety Reports & Anonymity
            </h2>
            <p>
              When reporting unsafe locations (such as broken lighting or harassment zones), reports are anonymous by default. Contributor personal details are never visible on public map pins.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              5. User Control & Data Deletion
            </h2>
            <p>
              You maintain total authority over your information. You can edit or delete contacts, clear check-in logs, and remove your account at any time directly through the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
