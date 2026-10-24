import { CodCheckoutForm } from '@/presentation/components/organisms/CodCheckoutForm';
import { ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-rose-600 block">
            SECURE STEP 2 OF 2
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">Secure Checkout</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Islandwide Cash on Delivery (COD) available with doorstep verification across Sri Lanka.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 w-fit shrink-0">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted & Verified</span>
        </div>
      </div>

      <CodCheckoutForm />
    </div>
  );
}
