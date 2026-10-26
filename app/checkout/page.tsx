"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, MapPin, CheckCircle2, AlertCircle, ArrowLeft, Upload, Check } from 'lucide-react';
import { getCart, getSettings, createOrder, clearCart } from '@/lib/db';
import { CartItem, SiteSettings, Order } from '@/lib/types';
import { compressImageToWebP } from '@/lib/imageOptimizer';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [deliveryTier, setDeliveryTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('Cash on Delivery');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [uploadingProof, setUploadingProof] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setCart(getCart());
    getSettings().then(setSettings);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Delivery fee logic
  const deliveryFee = orderType === 'Pickup'
    ? 0
    : deliveryTier === 'tier1'
    ? 200
    : deliveryTier === 'tier2'
    ? 230
    : 270;

  const grandTotal = subtotal + deliveryFee;

  // Enforce 5-box minimum
  const lunchBoxItems = cart.filter((i) => i.product.isLunchBox);
  const totalLunchBoxes = lunchBoxItems.reduce((sum, i) => sum + i.quantity, 0);
  const hasLunchBox = lunchBoxItems.length > 0;
  const isLunchBoxMet = !hasLunchBox || totalLunchBoxes >= 5;

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    try {
      const { dataUrl } = await compressImageToWebP(file, { maxWidth: 1000, quality: 0.8 });
      setPaymentProofUrl(dataUrl);
    } catch (err) {
      console.error('Error optimizing screenshot:', err);
    } finally {
      setUploadingProof(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLunchBoxMet) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        subtotal: i.product.price * i.quantity,
        isLunchBox: Boolean(i.product.isLunchBox),
      }));

      const created = await createOrder({
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
        orderDate,
        items: orderItems,
        subtotal,
        deliveryCharges: deliveryFee,
        discountAmount: 0,
        grandTotal,
        specialInstructions,
        paymentMethod,
        paymentStatus: paymentProofUrl ? 'Paid' : 'Pending',
        paymentProofUrl: paymentProofUrl || undefined,
        status: 'Pending Confirmation',
      });

      setSubmittedOrder(created);
      clearCart();

      // Formulate detailed, clean WhatsApp message
      const itemsList = orderItems
        .map((item, idx) => `${idx + 1}. ${item.productName} × ${item.quantity} — Rs. ${item.subtotal}`)
        .join('\n');

      const waText = `Assalam-o-Alaikum Zain's Kitchen!

I would like to place an advance food order [Ref: ${created.orderNumber}]:

*Customer Details:*
• Name: ${customerName}
• Phone: ${customerPhone}
• Order Date: ${orderDate}
• Service Type: ${orderType}
${orderType === 'Delivery' ? `• Delivery Address: ${deliveryAddress}` : '• Self-Pickup from Kitchen'}

*Order Items:*
${itemsList}

*Financial Summary:*
• Food Subtotal: Rs. ${subtotal}
• Delivery Charges: Rs. ${deliveryFee} (${orderType === 'Pickup' ? 'Self-Pickup' : deliveryTier === 'tier1' ? '0-3 km' : deliveryTier === 'tier2' ? '3-6 km' : '6 km+'})
• Estimated Total: Rs. ${grandTotal}
• Payment Method: ${paymentMethod}
${paymentProofUrl ? '• Payment Proof Screenshot: Uploaded in system record' : ''}

${specialInstructions ? `*Special Notes:*\n${specialInstructions}\n` : ''}
Please confirm availability and dispatch schedule. Thank you!`;

      const encoded = encodeURIComponent(waText);
      window.open(`https://wa.me/923038835378?text=${encoded}`, '_blank');
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-charcoal-900">
          Order Placed Successfully!
        </h1>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm max-w-md mx-auto text-left text-xs space-y-2">
          <p className="text-amber-700 font-bold text-sm">Order Reference: {submittedOrder.orderNumber}</p>
          <p className="text-charcoal-800">Customer: <strong className="text-charcoal-900">{submittedOrder.customerName}</strong> ({submittedOrder.customerPhone})</p>
          <p className="text-charcoal-700">Total Amount: <strong className="text-charcoal-900 font-extrabold">Rs. {submittedOrder.grandTotal}</strong></p>
          <p className="text-charcoal-700">Service: <span className="font-medium text-charcoal-900">{submittedOrder.orderType}</span></p>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
          Your order has been recorded in our system and forwarded to WhatsApp (0303-8835378). Our kitchen team will confirm dispatch time shortly!
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/923038835378"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Conversation</span>
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-charcoal-800 border border-stone-200 text-xs font-semibold shadow-sm transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-charcoal-900">Your tray is empty</h2>
        <p className="text-xs text-charcoal-600">Please add dishes to your order tray before proceeding to checkout.</p>
        <Link
          href="/lunch-boxes"
          className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-xs shadow-md transition-all"
        >
          Explore Lunch Boxes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/lunch-boxes"
          className="p-2 rounded-xl bg-white border border-stone-200 text-charcoal-600 hover:text-charcoal-950 hover:bg-stone-50 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Order Review & Checkout
          </h1>
          <p className="text-xs text-charcoal-600">Complete your details to place your advance food order in Peshawar.</p>
        </div>
      </div>

      {/* Lunchbox minimum warning if not met */}
      {hasLunchBox && !isLunchBoxMet && (
        <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3 text-xs text-amber-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-950 block font-bold text-sm mb-0.5">
              Minimum 5 Lunch Boxes Required!
            </strong>
            You currently have <strong className="text-amber-950">{totalLunchBoxes}</strong> lunch box(es).
            Please add at least <strong className="text-amber-950">{5 - totalLunchBoxes} more</strong> to qualify for checkout.
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Customer Info & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contacts */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-stone-100 pb-2">
              1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Zain Ul Abideen"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0303-XXXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Preferred Order Date *
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-stone-100 pb-2">
              2. Delivery or Self-Pickup
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  orderType === 'Delivery'
                    ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-charcoal-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-xs font-bold block text-charcoal-900">Doorstep Delivery</span>
                <span className="text-[11px] text-amber-700 font-medium">Across Peshawar</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  orderType === 'Pickup'
                    ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-charcoal-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-xs font-bold block text-charcoal-900">Self-Pickup</span>
                <span className="text-[11px] text-emerald-600 font-semibold">Free (Rs. 0)</span>
              </button>
            </div>

            {orderType === 'Delivery' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                    Select Distance from Peshawar Kitchen:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { tier: 'tier1', label: '0 – 3 km', fee: 'Rs. 200' },
                      { tier: 'tier2', label: '3 – 6 km', fee: 'Rs. 230' },
                      { tier: 'tier3', label: '6 km+', fee: 'Rs. 270' },
                    ].map((t) => (
                      <button
                        key={t.tier}
                        type="button"
                        onClick={() => setDeliveryTier(t.tier as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          deliveryTier === t.tier
                            ? 'bg-amber-500 border-amber-500 text-charcoal-950 font-bold shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-charcoal-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="block text-[11px]">{t.label}</span>
                        <span className={deliveryTier === t.tier ? 'text-charcoal-950 font-extrabold' : 'text-amber-700 font-bold'}>{t.fee}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Complete Delivery Address in Peshawar *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House / Office / Floor number, Street, Sector, Area (e.g. Hayatabad, University Town, Cantt)..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Ring the bell, deliver by 1:00 PM sharp, extra raita..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Payment Method Selector & Proof Upload */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-stone-100 pb-2">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Cash on Delivery',
                'JazzCash',
                'EasyPaisa',
                'Bank Transfer',
              ].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-semibold ${
                    paymentMethod === method
                      ? 'bg-amber-500 border-amber-500 text-charcoal-950 font-bold shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-charcoal-700 hover:bg-stone-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Account Details Display if online transfer is chosen */}
            {paymentMethod !== 'Cash on Delivery' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
                <h4 className="font-bold text-amber-900">
                  {paymentMethod} Account Details:
                </h4>
                {paymentMethod === 'JazzCash' && (
                  <p className="text-charcoal-800">
                    Account Title: <strong className="text-charcoal-900">Zain&apos;s Kitchen</strong><br />
                    JazzCash Number: <strong className="text-amber-800 font-mono text-sm">0303-8835378</strong>
                  </p>
                )}
                {paymentMethod === 'EasyPaisa' && (
                  <p className="text-charcoal-800">
                    Account Title: <strong className="text-charcoal-900">Zain&apos;s Kitchen</strong><br />
                    EasyPaisa Number: <strong className="text-amber-800 font-mono text-sm">0303-8835378</strong>
                  </p>
                )}
                {paymentMethod === 'Bank Transfer' && (
                  <p className="text-charcoal-800">
                    Bank: <strong className="text-charcoal-900">Meezan Bank Limited</strong><br />
                    Account Title: <strong className="text-charcoal-900">Zain&apos;s Kitchen</strong><br />
                    IBAN: <strong className="text-amber-800 font-mono text-xs">PK12MEZN0001020304050607</strong>
                  </p>
                )}

                {/* Proof screenshot uploader */}
                <div className="pt-2 border-t border-amber-200/60">
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                    Upload Payment Slip / Screenshot Proof:
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-charcoal-800 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>{uploadingProof ? 'Compressing...' : 'Choose Screenshot'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                    </label>

                    {paymentProofUrl && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <Check className="w-4 h-4" /> Screenshot Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Order Summary & Confirm */}
        <div className="lg:col-span-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-md sticky top-24 space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-stone-100 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items summary */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-stone-100 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2.5 first:pt-0 flex justify-between items-center">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-charcoal-900 block">{item.product.name}</span>
                    <span className="text-[11px] text-charcoal-500">
                      {item.quantity} × Rs. {item.product.price}
                    </span>
                  </div>
                  <span className="font-bold text-amber-700">
                    Rs. {item.quantity * item.product.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Food Subtotal:</span>
                <span className="font-semibold text-charcoal-900">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-charcoal-900">
                  {orderType === 'Pickup' ? 'Free (Pickup)' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-stone-100">
                <span>Estimated Total:</span>
                <span className="text-amber-700 font-extrabold text-base">Rs. {grandTotal}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isLunchBoxMet}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-charcoal-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 fill-charcoal-950 text-charcoal-950" />
                <span>{isSubmitting ? 'Processing Order...' : 'Send Order to WhatsApp'}</span>
              </button>
              <p className="text-[10px] text-charcoal-500 text-center mt-2 leading-relaxed">
                * Clicking place order saves your order in our system and opens WhatsApp with your prefilled details for kitchen confirmation.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
