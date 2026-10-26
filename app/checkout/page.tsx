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
        <div className="w-16 h-16 rounded-full bg-brandGreen/20 border-2 border-brandGreen text-brandGreen flex items-center justify-center mx-auto shadow-lg shadow-brandGreen/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
          Order Placed Successfully!
        </h1>
        <div className="p-4 rounded-2xl bg-obsidian-850 border border-gold-500/25 max-w-md mx-auto text-left text-xs space-y-1.5">
          <p className="text-gold-300 font-semibold">Order Reference: {submittedOrder.orderNumber}</p>
          <p className="text-white">Customer: {submittedOrder.customerName} ({submittedOrder.customerPhone})</p>
          <p className="text-cream-400">Total Amount: <strong className="text-white">Rs. {submittedOrder.grandTotal}</strong></p>
          <p className="text-cream-400">Service: {submittedOrder.orderType}</p>
        </div>
        <p className="text-xs sm:text-sm text-cream-300 max-w-md mx-auto leading-relaxed">
          Your order has been recorded in our system and forwarded to WhatsApp (0303-8835378). Our kitchen team will confirm dispatch time shortly!
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/923038835378"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brandGreen text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Conversation</span>
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-cream-200 border border-gold-500/25 text-xs font-semibold"
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
        <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-gold-500/20 flex items-center justify-center mx-auto text-gold-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-white">Your tray is empty</h2>
        <p className="text-xs text-cream-400">Please add dishes to your order tray before proceeding to checkout.</p>
        <Link
          href="/lunch-boxes"
          className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs shadow-md"
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
          className="p-2 rounded-xl bg-obsidian-850 border border-gold-500/20 text-cream-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            Order Review & Checkout
          </h1>
          <p className="text-xs text-cream-400">Complete your details to place your advance food order in Peshawar.</p>
        </div>
      </div>

      {/* Lunchbox minimum warning if not met */}
      {hasLunchBox && !isLunchBoxMet && (
        <div className="rounded-2xl bg-amber-950/80 border border-gold-500/40 p-4 flex items-start gap-3 text-xs text-gold-200 shadow-md">
          <AlertCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-bold text-sm mb-0.5">
              Minimum 5 Lunch Boxes Required!
            </strong>
            You currently have <strong className="text-white">{totalLunchBoxes}</strong> lunch box(es).
            Please add at least <strong className="text-white">{5 - totalLunchBoxes} more</strong> to qualify for checkout.
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Customer Info & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contacts */}
          <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-850 border border-gold-500/25 space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/15 pb-2">
              1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-cream-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Zain Ul Abideen"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-300 mb-1">
                  WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0303-XXXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream-300 mb-1">
                Preferred Order Date *
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-850 border border-gold-500/25 space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/15 pb-2">
              2. Delivery or Self-Pickup
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  orderType === 'Delivery'
                    ? 'bg-gold-500/15 border-gold-500 text-white shadow-md'
                    : 'bg-obsidian-900 border-gold-500/20 text-cream-400'
                }`}
              >
                <span className="text-xs font-bold block text-white">Doorstep Delivery</span>
                <span className="text-[11px] text-gold-300">Across Peshawar</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  orderType === 'Pickup'
                    ? 'bg-gold-500/15 border-gold-500 text-white shadow-md'
                    : 'bg-obsidian-900 border-gold-500/20 text-cream-400'
                }`}
              >
                <span className="text-xs font-bold block text-white">Self-Pickup</span>
                <span className="text-[11px] text-brandGreen font-medium">Free (Rs. 0)</span>
              </button>
            </div>

            {orderType === 'Delivery' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">
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
                            ? 'bg-gold-500/20 border-gold-500 text-white font-bold'
                            : 'bg-obsidian-900 border-gold-500/15 text-cream-400'
                        }`}
                      >
                        <span className="block text-[11px]">{t.label}</span>
                        <span className="text-gold-300 font-bold">{t.fee}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">
                    Complete Delivery Address in Peshawar *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House / Office / Floor number, Street, Sector, Area (e.g. Hayatabad, University Town, Cantt)..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-cream-300 mb-1">
                Special Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Ring the bell, deliver by 1:00 PM sharp, extra raita..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Payment Method Selector & Proof Upload */}
          <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-850 border border-gold-500/25 space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/15 pb-2">
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
                      ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-sm'
                      : 'bg-obsidian-900 border-gold-500/15 text-cream-400'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Account Details Display if online transfer is chosen */}
            {paymentMethod !== 'Cash on Delivery' && (
              <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 text-xs space-y-2">
                <h4 className="font-bold text-gold-300">
                  {paymentMethod} Account Details:
                </h4>
                {paymentMethod === 'JazzCash' && (
                  <p className="text-white">
                    Account Title: <strong>Zain&apos;s Kitchen</strong><br />
                    JazzCash Number: <strong className="text-gold-400 font-mono text-sm">0303-8835378</strong>
                  </p>
                )}
                {paymentMethod === 'EasyPaisa' && (
                  <p className="text-white">
                    Account Title: <strong>Zain&apos;s Kitchen</strong><br />
                    EasyPaisa Number: <strong className="text-gold-400 font-mono text-sm">0303-8835378</strong>
                  </p>
                )}
                {paymentMethod === 'Bank Transfer' && (
                  <p className="text-white">
                    Bank: <strong>Meezan Bank Limited</strong><br />
                    Account Title: <strong>Zain&apos;s Kitchen</strong><br />
                    IBAN: <strong className="text-gold-400 font-mono text-xs">PK12MEZN0001020304050607</strong>
                  </p>
                )}

                {/* Proof screenshot uploader */}
                <div className="pt-2 border-t border-gold-500/15">
                  <label className="block text-xs font-semibold text-cream-300 mb-1.5">
                    Upload Payment Slip / Screenshot Proof:
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-gold-500/30 text-gold-300 text-xs font-semibold flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingProof ? 'Compressing...' : 'Choose Screenshot'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                    </label>

                    {paymentProofUrl && (
                      <span className="flex items-center gap-1 text-xs text-brandGreen font-medium">
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
          <div className="p-5 sm:p-6 rounded-3xl bg-obsidian-850 border border-gold-500/30 shadow-2xl sticky top-24 space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/20 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Items summary */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-gold-500/10 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2.5 first:pt-0 flex justify-between items-center">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-white block">{item.product.name}</span>
                    <span className="text-[11px] text-cream-400">
                      {item.quantity} × Rs. {item.product.price}
                    </span>
                  </div>
                  <span className="font-bold text-gold-300">
                    Rs. {item.quantity * item.product.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-gold-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-cream-300">
                <span>Food Subtotal:</span>
                <span className="font-semibold text-white">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-white">
                  {orderType === 'Pickup' ? 'Free (Pickup)' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gold-500/15">
                <span>Estimated Total:</span>
                <span className="text-gold-300 font-extrabold text-base">Rs. {grandTotal}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isLunchBoxMet}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 active:scale-98 text-obsidian-950 font-bold text-sm shadow-xl shadow-gold-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 fill-obsidian-950" />
                <span>{isSubmitting ? 'Processing Order...' : 'Send Order to WhatsApp'}</span>
              </button>
              <p className="text-[10px] text-cream-500 text-center mt-2 leading-relaxed">
                * Clicking place order saves your order in our system and opens WhatsApp with your prefilled details for kitchen confirmation.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
