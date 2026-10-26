"use client";

import React, { useState } from 'react';
import { Briefcase, CheckCircle2, MessageCircle, Clock, MapPin } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 bg-[#FAF8F5]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5 text-amber-700" />
          <span>Corporate & Bulk Services</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-charcoal-950">
          Office Lunch & Catering Inquiries
        </h1>
        <p className="text-xs sm:text-base text-charcoal-700 leading-relaxed font-medium">
          From daily office lunch-box subscriptions to family gatherings and corporate celebrations in Peshawar. Tailored menus with authentic taste and hygienic presentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Informational Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 space-y-5 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-charcoal-950 border-b border-stone-100 pb-3">
              Why Peshawar Businesses Choose Zain&apos;s Kitchen
            </h3>

            <div className="space-y-4 text-xs text-charcoal-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-950 block font-bold">Hygienic Sealed Food Containers</strong>
                  Individual executive compartments with spill-proof lids and disposable cutlery.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-950 block font-bold">Punctual Office Delivery</strong>
                  Reliable delivery schedules to meet your company&apos;s designated lunch break.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-950 block font-bold">Weekly & Monthly Meal Plans</strong>
                  Custom rotating daily menus so your staff always enjoys variety without meal fatigue.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <strong className="text-charcoal-950 block font-bold">Flexible Tiered Budgets</strong>
                  From budget-friendly Basic Lunch Boxes (Rs. 450) to Royal Biryani Feasts.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5 text-xs text-amber-900 font-semibold">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                Please submit catering requests at least 24–48 hours in advance.
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                Full coverage across Peshawar city and surrounding areas.
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-md">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-brandGreen text-brandGreen flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your catering inquiry has been received. Our team has also opened WhatsApp so you can discuss your custom requirements directly with our head chef.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-charcoal-950 border-b border-stone-100 pb-2">
                  Request a Custom Quote
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Zain Ul Abideen"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0303-XXXXXXX"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Organization / Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Peshawar Software House"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 focus:outline-none focus:border-amber-500 font-medium"
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
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Est. People / Boxes *
                    </label>
                    <input
                      type="number"
                      min={5}
                      required
                      value={formData.estimatedPeople}
                      onChange={(e) => setFormData({ ...formData, estimatedPeople: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Preference
                    </label>
                    <select
                      value={formData.orderType}
                      onChange={(e) => setFormData({ ...formData, orderType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="Delivery">Doorstep Delivery</option>
                      <option value="Pickup">Self-Pickup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Special Requirements or Dishes Desired
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your favorite menu items, dietary preferences, or specific timing requirements..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:brightness-105 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit & Connect on WhatsApp'}</span>
                  </button>
                  <p className="text-[10px] text-charcoal-500 text-center mt-2">
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
