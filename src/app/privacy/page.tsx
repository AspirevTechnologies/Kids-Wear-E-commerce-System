import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | LittleStyles Luxury Kids Wear',
  description: 'Learn how LittleStyles protects guest customer information and order records in Sri Lanka.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
          CUSTOMER DATA PROTECTION
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: October 2026 • LittleStyles Kids Wear (Pvt) Ltd, Sri Lanka
        </p>
      </div>

      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">1. Guest Checkout Privacy Commitment</h2>
          <p>
            At LittleStyles, we believe buying kids wear should be effortless and secure. We operate on a <strong>Guest Checkout by default</strong> model. You are never required to create an account or provide unnecessary personal data to purchase from our store.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">2. Information We Collect for Fulfilment</h2>
          <p>When you place an order with Cash on Delivery or Manual Bank Transfer, we collect only the essential information needed to fulfill and deliver your package:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li><strong>Parent / Receiver Full Name:</strong> To address the delivery parcel.</li>
            <li><strong>Sri Lankan Mobile Number:</strong> For courier dispatch verification and doorstep coordination.</li>
            <li><strong>Delivery Address, District & Town:</strong> Used by our courier partners (Prompt Xpress, Pronto, Domex) to deliver the parcel.</li>
            <li><strong>Bank Transfer References:</strong> If you choose direct bank deposit, we record transaction reference numbers solely to verify incoming payments.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">3. Payment Security (No Payment Gateway)</h2>
          <p>
            LittleStyles does not operate an online payment gateway and does not store or process debit/credit card numbers. All transactions occur via physical <strong>Cash on Delivery (COD)</strong> at your doorstep or direct manual transfers through approved Sri Lankan corporate bank accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">4. Data Sharing & Disclosure</h2>
          <p>
            We strictly do not sell, rent, or trade your personal information. Customer details are shared only with registered Sri Lankan courier dispatch personnel solely for the purpose of completing delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">5. Contact Our Privacy Team</h2>
          <p>
            If you wish to review, update, or request the deletion of your order contact record, please reach out to us at <strong>privacy@littlestyles.lk</strong> or WhatsApp <strong>+94 77 123 4567</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
