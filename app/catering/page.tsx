"use client";

import React, { useState } from 'react';
import { Briefcase, Send, CheckCircle2, MessageCircle, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { createInquiry } from '@/lib/db';
import { CateringInquiry } from '@/lib/types';

export default function CateringPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    organizationName: '',
    eventType: 'Office Lunch' as CateringInquiry['eventType'],
    estimatedPeople: 15,
    preferredDate: '',
    orderType: 'Delivery' as CateringInquiry['orderType'],
    budgetRange: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to database / local store
      await createInquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        organizationName: formData.organizationName,
        eventType: formData.eventType,
        estimatedPeople: Number(formData.estimatedPeople),
        preferredDate: formData.preferredDate || new Date().toISOString().slice(0, 10),
        orderType: formData.orderType,
        budgetRange: formData.budgetRange,
        message: formData.message,
      });

      setIsSubmitted(true);

      // 2. Build prefilled WhatsApp inquiry message
      const waMessage = `Assalam-o-Alaikum Zain's Kitchen!

I would like to inquire about bulk catering / office lunch in Peshawar:

*Inquiry Details:*
• Name: ${formData.fullName}
• Phone: ${formData.phone}
${formData.organizationName ? `• Organization: ${formData.organizationName}` : ''}
• Event Type: ${formData.eventType}
• Estimated People / Boxes: ${formData.estimatedPeople}
• Preferred Date: ${formData.preferredDate || 'Upcoming'}
• Preferred Option: ${formData.orderType}
${formData.budgetRange ? `• Budget Range: Rs. ${formData.budgetRange}` : ''}

*Special Requirements:*
${formData.message || 'Please provide quotation and menu availability.'}

Please confirm availability and share your custom packages. Thank you!`;

      const encoded = encodeURIComponent(waMessage);
      window.open(`https://wa.me/923038835378?text=${encoded}`, '_blank');
    } catch (err) {
      console.error('Error submitting catering inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5 text-gold-400" />
          <span>Corporate & Bulk Services</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Office Lunch & Catering Inquiries
        </h1>
        <p className="text-xs sm:text-base text-cream-300/90 leading-relaxed">
          From daily office lunch-box subscriptions to family gatherings and corporate celebrations in Peshawar. Tailored menus with authentic taste and hygienic presentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Informational Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-obsidian-850 border border-gold-500/25 space-y-5 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white border-b border-gold-500/20 pb-3">
              Why Peshawar Businesses Choose Zain&apos;s Kitchen
            </h3>

            <div className="space-y-4 text-xs text-cream-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Hygienic Sealed Food Containers</strong>
                  Individual executive compartments with spill-proof lids and disposable cutlery.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Punctual Office Delivery</strong>
                  Reliable delivery schedules to meet your company&apos;s designated lunch break.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Weekly & Monthly Meal Plans</strong>
                  Custom rotating daily menus so your staff always enjoys variety without meal fatigue.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Flexible Tiered Budgets</strong>
                  From budget-friendly Basic Lunch Boxes (Rs. 450) to Royal Biryani Feasts.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-500/20 flex flex-col gap-2.5 text-xs text-gold-300">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                Please submit catering requests at least 24–48 hours in advance.
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                Full coverage across Peshawar city and surrounding areas.
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-850 border border-gold-500/30 shadow-2xl">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-brandGreen/20 border border-brandGreen/40 text-brandGreen flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-cream-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Your catering inquiry has been received. Our team has also opened WhatsApp so you can discuss your custom requirements directly with our head chef.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-black font-semibold text-xs border border-gold-500/30 transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-white border-b border-gold-500/20 pb-2">
                  Request a Custom Quote
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Zain Ul Abideen"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0303-XXXXXXX"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Organization / Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Peshawar Software House"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Office Lunch">Office Lunch Boxes</option>
                      <option value="Bulk Lunch Boxes">Bulk Lunch Boxes (20+ people)</option>
                      <option value="Recurring Weekly / Monthly Plan">Recurring Office Meal Plan</option>
                      <option value="Family Gathering">Family Gathering / Party</option>
                      <option value="Small Event">Small Corporate Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Est. People / Boxes *
                    </label>
                    <input
                      type="number"
                      min={5}
                      required
                      value={formData.estimatedPeople}
                      onChange={(e) => setFormData({ ...formData, estimatedPeople: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">
                      Preference
                    </label>
                    <select
                      value={formData.orderType}
                      onChange={(e) => setFormData({ ...formData, orderType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Delivery">Doorstep Delivery</option>
                      <option value="Pickup">Self-Pickup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">
                    Special Requirements or Dishes Desired
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your favorite menu items, dietary preferences, or specific timing requirements..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 active:scale-98 text-obsidian-950 font-bold text-xs sm:text-sm shadow-xl shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-obsidian-950" />
                    <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit & Connect on WhatsApp'}</span>
                  </button>
                  <p className="text-[10px] text-cream-500 text-center mt-2">
                    * Submitting this inquiry forwards your request to our kitchen team for availability confirmation and exact quotation.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
