import React from 'react';
import { AlertTriangle, ShieldAlert, Phone, CheckCircle2 } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Crucial Operational Terms</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Terms & Safety Disclaimer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory Reading · Safety Alert Protocol Boundaries
          </p>
        </div>

        {/* Highlighted Warning Box */}
        <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-xs sm:text-sm text-red-950 leading-relaxed space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <ShieldAlert className="w-5 h-5" />
            <span>No Automated Law Enforcement Dispatch</span>
          </div>
          <p>
            <strong>Aman Safar is an emergency notification and personal coordination tool, not an official government dispatch system.</strong> Activating SOS alerts your selected trusted emergency contacts and shares your location link when internet and browser permissions allow.
          </p>
          <p>
            The platform <strong>does not claim or guarantee</strong> that police, ambulance, university security, or emergency municipal authorities are automatically notified, dispatched, or guaranteed to respond.
          </p>
        </div>

        <div className="prose prose-sm text-slate-600 space-y-6 text-xs sm:text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              1. Direct Emergency Helpline Advice
            </h2>
            <p>
              If you are facing an active, life-threatening situation or immediate violent threat, contact emergency authorities directly without delay:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Police Emergency:</strong> 15</li>
              <li><strong>Women Protection & Harassment Helpline:</strong> 1043</li>
              <li><strong>Edhi Ambulance Service:</strong> 115</li>
              <li><strong>Motorway & Highway Police:</strong> 130</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              2. Technical & Network Dependencies
            </h2>
            <p>
              Aman Safar's SOS dispatch, SMS redirection, WhatsApp alerts, and live tracking features depend on multiple external factors beyond our control, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Active mobile cellular connectivity and data coverage</li>
              <li>User-granted GPS and browser location permissions</li>
              <li>Device battery charge and operational hardware status</li>
              <li>Third-party platform availability (WhatsApp, carrier SMS gateways)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              3. Community Map & Route Safety Policy
            </h2>
            <p>
              The Community Safety Map relies on crowdsourced, anonymous reports of hazards, unlit streets, and isolated areas. <strong>Aman Safar does not certify, verify, or label any road, path, or route as officially "safe" or hazard-free.</strong> Users are advised to exercise local caution and situational awareness at all times.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
