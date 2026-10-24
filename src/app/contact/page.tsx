'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle,
  Truck,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Order Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Order Inquiry',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
            WE ARE HERE TO HELP
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
            Contact LittleStyles Concierge
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Have a question about sizes, delivery timelines, Cash on Delivery, or manual bank transfer verification? Reach out to our Colombo team anytime!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact & Showroom Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* WhatsApp Primary Card */}
            <a
              href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20I%20have%20an%20inquiry%20regarding%20kids%20wear"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-3xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    FASTEST RESPONSE • INSTANT CHAT
                  </span>
                  <h3 className="font-serif font-black text-base text-slate-900">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-xs text-slate-700 font-mono font-bold">+94 77 123 4567</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-[#25D366]/20 leading-relaxed">
                Message us for immediate order assistance, sizing help, or sending bank transfer slip screenshots. Available 7 days a week.
              </p>
            </a>

            {/* Colombo Flagship Showroom Card with Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs">
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src="/images/categories/outfits.jpg"
                  alt="LittleStyles Boutique Atelier Colombo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 block">Flagship Atelier</span>
                  <h4 className="font-serif font-bold text-sm text-white">Colombo 03 Showroom & Dispatch</h4>
                </div>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF758F] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">LittleStyles Boutique & Atelier</p>
                    <p className="text-slate-500 leading-relaxed">
                      No. 42, Galle Road, Colombo 03, Western Province, Sri Lanka.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Operating Hours</p>
                    <p className="text-slate-500">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                    <p className="text-slate-500">Sunday & Public Holidays: 10:00 AM – 4:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">Email Inquiries</p>
                    <p className="text-slate-600 font-mono">care@littlestyles.lk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF758F] block">
                MESSAGE OUR STYLISTS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Send Us an Online Inquiry
              </h2>
              <p className="text-xs text-slate-500">
                Fill out the details below and our team will get back to you within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-black text-lg text-emerald-900">
                  Inquiry Received with Love!
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. A LittleStyles stylist will review your request and contact you shortly via WhatsApp or phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kasun Perera"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 077 123 4567"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. parent@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all bg-white"
                    >
                      <option value="Order Inquiry">Order Inquiry & Status</option>
                      <option value="Bank Slip Verification">Bank Slip Verification</option>
                      <option value="Size Consultation">Size & Fit Consultation</option>
                      <option value="Exchange Request">30-Day Doorstep Exchange</option>
                      <option value="Other">Other Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    How can we help you? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide order reference number, kid's age, or specific question..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FF758F] hover:bg-[#F0627D] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/20 active:scale-98 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}