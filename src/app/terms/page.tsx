import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | LittleStyles Kids Wear',
  description: 'Terms of sale, Cash on Delivery, manual bank transfer rules, and store policies for LittleStyles Sri Lanka.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
          CUSTOMER AGREEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Effective Date: October 2026 • LittleStyles Kids Wear (Pvt) Ltd
        </p>
      </div>

      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">1. Scope of Agreement</h2>
          <p>
            Welcome to LittleStyles. By browsing, placing orders, or utilizing our services, you agree to be bound by these terms. We sell children&apos;s apparel locally within the territory of Sri Lanka under a single-merchant model.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">2. Cash on Delivery (COD) Terms</h2>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>Cash on Delivery allows customers to pay exact cash in Sri Lankan Rupees (LKR) to our courier executive upon doorstep package handover.</li>
            <li>COD is offered for order amounts between Rs. 1,000 and Rs. 50,000.</li>
            <li>Dispatch of an order does not constitute completed payment. Payment is only recorded as collected once cash is received by the delivery courier.</li>
            <li>Refusal to accept an authorized COD order upon arrival without prior notification may result in restrictions on future COD purchases.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">3. Direct Manual Bank Transfer Rules</h2>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li>When choosing Direct Bank Transfer, funds must be deposited into one of our designated corporate accounts at Commercial Bank, BOC, or HNB.</li>
            <li>Customers must strictly quote their unique Order Reference (e.g. LS-2026-XXXX) as the transaction remark/description.</li>
            <li>Orders remain in <em>Awaiting Transfer</em> or <em>Verification Pending</em> state until our finance team reconciles the bank statement. Dispatch will occur only after funds are confirmed.</li>
            <li>Orders awaiting bank transfer are reserved for up to 48 hours. Unpaid orders after 48 hours may be cancelled and released back to catalogue stock.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">4. Pricing, Accuracy & Currency</h2>
          <p>
            All prices displayed on LittleStyles are quoted strictly in Sri Lankan Rupees (LKR). Product prices shown at the time of checkout are server-authoritative and final.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 font-serif">5. Contact Information</h2>
          <p>
            For questions regarding our terms, reach out via email at <strong>care@littlestyles.lk</strong> or phone <strong>+94 77 123 4567</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
