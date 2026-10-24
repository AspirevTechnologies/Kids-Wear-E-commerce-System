'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ServiceabilityResult } from '@/shared/types/common';
import { PincodeServiceAdapter } from '@/infrastructure/patterns/structural/PincodeServiceAdapter';

export const PincodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceabilityResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) return;

    setLoading(true);
    try {
      const res = await PincodeServiceAdapter.checkServiceability(pincode);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2.5">
        <MapPin className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
        <span>Check Islandwide Delivery & COD Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
          aria-label="Postal Pincode"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center min-w-[76px] shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
        </button>
      </form>

      {result && (
        <div className="mt-3 text-xs space-y-1.5 pt-2.5 border-t border-slate-200 animate-fadeIn">
          {result.isServiceable ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Standard Delivery in {result.estimatedDeliveryDays} days ({result.city})</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                {result.isCodAvailable ? (
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    Cash on Delivery (COD) is available for this address!
                  </span>
                ) : (
                  <span className="text-amber-800 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    Prepaid payment only available for this location.
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-700 font-medium">
              <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Sorry, this pincode is currently outside direct service areas.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
