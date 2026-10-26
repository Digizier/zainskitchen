"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Briefcase,
  Sliders,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Printer,
  X,
  Upload,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Menu,
} from 'lucide-react';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  exportProductsToCSV,
  getCategories,
  saveCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getInquiries,
  updateInquiryStatus,
  getBanners,
  saveBanner,
  deleteBanner,
  getSettings,
  saveSettings,
} from '@/lib/db';
import { Product, Category, Order, CateringInquiry, Banner, SiteSettings } from '@/lib/types';
import { compressImageToWebP } from '@/lib/imageOptimizer';

export default function AdminPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Hub
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'inquiries' | 'banners' | 'settings'
  >('dashboard');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CateringInquiry[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Auto-Sync Toggle (30s)
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals & Viewers
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [viewingPaymentProof, setViewingPaymentProof] = useState<string | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [customConfirmModal, setCustomConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Image Upload Local States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  // Master PIN for zainskitchen.com
  const MASTER_PIN = 'zainskitchen_golden_taste_2026';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = async () => {
    setIsSyncing(true);
    try {
      const [p, c, o, i, b, s] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
        getInquiries(),
        getBanners(),
        getSettings(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setInquiries(i);
      setBanners(b);
      setSettings(s);
      setLastSyncTime(new Date().toLocaleTimeString());
    } finally {
      setIsSyncing(false);
    }
  };

  // Check saved session
  useEffect(() => {
    const savedAuth = localStorage.getItem('zk_admin_session');
    if (savedAuth === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  // Hydrate data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // 30-Second Silent Background Auto-Sync
  useEffect(() => {
    if (!isAuthenticated || !autoSync) return;

    const interval = setInterval(() => {
      loadAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoSync]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === MASTER_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('zk_admin_session', 'active');
      setPinError('');
    } else {
      setPinError('Incorrect security key. Access denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zk_admin_session');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Image upload handler with client-side WebP compression
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { dataUrl, sizeInKb } = await compressImageToWebP(file, { maxWidth: 900, quality: 0.82 });
      if (editingProduct) {
        const existingImages = editingProduct.images || [];
        setEditingProduct({
          ...editingProduct,
          thumbnail: dataUrl,
          images: [dataUrl, ...existingImages],
        });
      }
      showToast(`Image compressed (${sizeInKb} KB) and attached!`);
    } catch (err) {
      console.error('Image compression error:', err);
      showToast('Image processing failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { dataUrl, sizeInKb } = await compressImageToWebP(file, { maxWidth: 1920, quality: 0.82 });
      await saveBanner({
        imageUrl: dataUrl,
        altText: "Zain's Kitchen Custom Promotional Banner",
      });
      loadAllData();
      showToast(`New banner uploaded & compressed to ${sizeInKb} KB!`);
    } catch (err) {
      console.error('Banner upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // ================= RENDER LOGIN GATE IF NOT AUTHENTICATED =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-obsidian-900 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-cream-100">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500 mx-auto shadow-lg shadow-gold-500/20">
              <Image
                src="/branding/zains_kitchen_logo.jpg"
                alt="Logo"
                width={64}
                height={64}
                className="object-cover"
                unoptimized
              />
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Zain&apos;s Kitchen Staff Portal
            </h1>
            <p className="text-xs text-gold-300">
              Restricted management gateway for authorized personnel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cream-300 mb-1.5">
                Master Security Key
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter access key..."
                className="w-full px-4 py-3 rounded-xl bg-obsidian-850 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400 font-mono tracking-wider"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-400 mt-1.5">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:brightness-110 active:scale-98 text-obsidian-950 font-bold text-sm shadow-xl shadow-gold-500/20 transition-all"
            >
              Unlock Control Center
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-cream-400 hover:text-gold-300 transition-colors">
              ← Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products for Product Manager
  const filteredProducts = products.filter((p) =>
    productSearch
      ? p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
      : true
  );
  const totalProductPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedAdminProducts = filteredProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-obsidian-950 text-cream-100 flex flex-col md:flex-row font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn border border-white/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FIXED LEFT SIDEBAR (Does NOT scroll when right workspace scrolls) */}
      <aside className="w-full md:w-64 bg-obsidian-900 border-r border-gold-500/20 flex flex-col md:fixed md:top-0 md:bottom-0 md:left-0 z-30 shadow-2xl">
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-gold-500/15 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gold-500">
              <Image
                src="/branding/zains_kitchen_logo.jpg"
                alt="Logo"
                width={36}
                height={36}
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-white block">Zain&apos;s Control</span>
              <span className="text-[10px] text-gold-400">Admin Dashboard</span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-cream-400 hover:text-red-400 hover:bg-obsidian-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items (Fixed, Natural Expansion, No Cramped Overflow) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products & Inventory', icon: Package },
            { id: 'categories', label: 'Categories & Subcategories', icon: FolderTree },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: orders.filter((o) => o.status === 'Pending Confirmation').length },
            { id: 'inquiries', label: 'Catering Inquiries', icon: Briefcase, badge: inquiries.filter((i) => i.status === 'New').length },
            { id: 'banners', label: 'Banners Hub', icon: ImageIcon },
            { id: 'settings', label: 'Store & Payment Settings', icon: Sliders },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 shadow-md font-bold'
                    : 'text-cream-300 hover:bg-obsidian-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      isActive ? 'bg-obsidian-950 text-gold-300' : 'bg-gold-500 text-obsidian-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sync Status & System Info Footer */}
        <div className="p-3 border-t border-gold-500/15 bg-obsidian-950 text-[11px] text-cream-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse" />
              Cloud Database Sync
            </span>
            <button
              onClick={loadAllData}
              disabled={isSyncing}
              className="p-1 hover:text-gold-300 transition-colors"
              title="Manual Sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-gold-400' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-cream-500">
            <span>Last Synced: {lastSyncTime}</span>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                autoSync ? 'bg-gold-500/20 text-gold-300' : 'bg-obsidian-800 text-cream-500'
              }`}
            >
              30s Sync: {autoSync ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </aside>

      {/* INDEPENDENTLY SCROLLING RIGHT WORKSPACE */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* ================= 1. OVERVIEW DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Operations Overview</h1>
                <p className="text-xs text-cream-400">Real-time status of orders, food inventory, and catering requests.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportProductsToCSV(products)}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/25 text-xs text-gold-300 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Products CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: orders.length, desc: 'All lifetime orders', color: 'text-white' },
                { label: 'Pending Confirmation', value: orders.filter((o) => o.status === 'Pending Confirmation').length, desc: 'Require attention', color: 'text-amber-400 font-bold' },
                { label: 'Active Inquiries', value: inquiries.filter((i) => i.status === 'New').length, desc: 'Corporate / Bulk requests', color: 'text-gold-300' },
                { label: 'Menu Dishes Live', value: products.filter((p) => p.isAvailable).length, desc: 'Active in catalog', color: 'text-brandGreen' },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-obsidian-850 border border-gold-500/20">
                  <span className="text-[11px] text-cream-400 font-medium block">{m.label}</span>
                  <span className={`text-2xl font-extrabold ${m.color} block mt-1`}>{m.value}</span>
                  <span className="text-[10px] text-cream-500">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Recent Orders Preview */}
            <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-white">Recent Customer Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-gold-300 hover:underline">
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-cream-400 py-6 text-center">No orders received yet.</p>
              ) : (
                <div className="divide-y divide-gold-500/10 text-xs">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-white block">{ord.orderNumber} — {ord.customerName}</span>
                        <span className="text-[11px] text-cream-400">{ord.orderType} • {ord.items.length} dishes • Rs. {ord.grandTotal}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS & INVENTORY MANAGER ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Products & Dishes Manager</h1>
                <p className="text-xs text-cream-400">Add, edit, or delete dishes. Images are auto-compressed to WebP in KBs.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => exportProductsToCSV(products)}
                  className="px-3 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/25 text-xs text-gold-300 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() =>
                    setEditingProduct({
                      name: '',
                      price: 500,
                      category: 'roti-lunch-boxes',
                      categoryName: 'Roti & Sabzi Lunch Boxes',
                      isAvailable: true,
                      isLunchBox: true,
                      minimumOrderQuantity: 5,
                      includedItems: [],
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductPage(1);
                  }}
                  placeholder="Search products by title or category..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-obsidian-850 border border-gold-500/20 text-white placeholder-cream-500 focus:outline-none focus:border-gold-400"
                />
              </div>
              <span className="text-xs text-cream-400">
                {filteredProducts.length} items (Page {productPage} of {totalProductPages})
              </span>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-obsidian-850 border border-gold-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-obsidian-900 border-b border-gold-500/20 text-gold-300 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {paginatedAdminProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-obsidian-800/60 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-obsidian-900 border border-gold-500/20 shrink-0">
                            <Image
                              src={prod.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{prod.name}</span>
                            <span className="text-[10px] text-cream-400 line-clamp-1">{prod.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-cream-300">{prod.categoryName}</td>
                        <td className="py-3 px-4 font-bold text-gold-300">Rs. {prod.price}</td>
                        <td className="py-3 px-4">
                          {prod.isLunchBox ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-gold-500/20 text-gold-300 border border-gold-500/30">
                              🍱 Lunch Box (Min 5)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-obsidian-750 text-cream-300">
                              Dish
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              prod.isAvailable ? 'bg-brandGreen/20 text-brandGreen' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {prod.isAvailable ? 'Available' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 hover:bg-gold-500/20 text-gold-300 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setCustomConfirmModal({
                                isOpen: true,
                                title: `Delete "${prod.name}"?`,
                                message: 'Are you sure you want to permanently delete this dish from the menu?',
                                onConfirm: async () => {
                                  await deleteProduct(prod.id);
                                  loadAllData();
                                  showToast('Dish deleted successfully.');
                                },
                              })
                            }
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Strict 8/page Pagination Controls */}
              {totalProductPages > 1 && (
                <div className="p-3 bg-obsidian-900 border-t border-gold-500/15 flex items-center justify-between text-xs">
                  <span className="text-cream-400">
                    Showing {(productPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(productPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalProductPages }).map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => setProductPage(idx + 1)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold ${
                          productPage === idx + 1
                            ? 'bg-gold-500 text-obsidian-950'
                            : 'bg-obsidian-800 text-cream-300 hover:bg-obsidian-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. CATEGORIES & SUBCATEGORIES MANAGER ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Categories & Tags Manager</h1>
                <p className="text-xs text-cream-400">Configure main categories, subcategories, and homepage scroller visibility.</p>
              </div>
              <button
                onClick={() =>
                  setEditingCategory({
                    name: '',
                    isMainCategory: true,
                    showInTopCategories: true,
                    subCategories: [],
                  })
                }
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-obsidian-900 border border-gold-500/20">{cat.icon || '🍱'}</span>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-white">{cat.name}</h3>
                        <p className="text-[11px] text-cream-400 line-clamp-1">{cat.description || 'Main menu category'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 text-gold-300 hover:bg-gold-500/20 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setCustomConfirmModal({
                            isOpen: true,
                            title: `Delete category "${cat.name}"?`,
                            message: 'This category will be permanently removed.',
                            onConfirm: async () => {
                              await deleteCategory(cat.id);
                              loadAllData();
                              showToast('Category deleted.');
                            },
                          })
                        }
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs pt-1 border-t border-gold-500/10">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.showInTopCategories
                          ? 'bg-brandGreen/20 text-brandGreen border border-brandGreen/30'
                          : 'bg-obsidian-800 text-cream-500'
                      }`}
                    >
                      {cat.showInTopCategories ? '✓ Visible in Top Scroller' : 'Hidden from Scroller'}
                    </span>
                    <span className="text-cream-400 text-[11px]">
                      {cat.subCategories?.length || 0} Subcategories
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. CUSTOMER ORDER MANAGER ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Customer Order Manager</h1>
                <p className="text-xs text-cream-400">Track delivery statuses, view payment proof screenshots, and print invoices.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-obsidian-850 border border-gold-500/20 text-cream-400 text-xs">
                No orders have been submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/25 space-y-3 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-gold-300">{ord.orderNumber}</span>
                        <span className="text-xs text-cream-400">• {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Payment Proof Eye Icon Modal Trigger */}
                        {ord.paymentProofUrl && (
                          <button
                            onClick={() => setViewingPaymentProof(ord.paymentProofUrl!)}
                            className="px-2.5 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-black font-semibold text-xs flex items-center gap-1 transition-all"
                            title="View Transaction Screenshot"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Payment Proof</span>
                          </button>
                        )}

                        {/* Pristine White Print Invoice */}
                        <button
                          onClick={() => setPrintingOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-cream-200 border border-gold-500/25 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5 text-gold-400" />
                          <span>Print Invoice</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <strong className="text-cream-400 block text-[10px] uppercase">Customer</strong>
                        <span className="font-bold text-white text-sm">{ord.customerName}</span>
                        <p className="text-gold-300 font-mono">{ord.customerPhone}</p>
                      </div>
                      <div>
                        <strong className="text-cream-400 block text-[10px] uppercase">Service Type & Address</strong>
                        <span className="font-semibold text-white">{ord.orderType}</span>
                        <p className="text-cream-300 text-[11px] line-clamp-2">{ord.deliveryAddress || 'Self-Pickup'}</p>
                      </div>
                      <div>
                        <strong className="text-cream-400 block text-[10px] uppercase">Amount & Method</strong>
                        <span className="font-extrabold text-gold-300 text-sm">Rs. {ord.grandTotal}</span>
                        <p className="text-cream-300 text-[11px]">{ord.paymentMethod} ({ord.paymentStatus})</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/15 text-xs space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-cream-300">
                          <span>{it.productName} × {it.quantity}</span>
                          <span className="font-semibold text-white">Rs. {it.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status updater */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gold-500/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cream-400 font-medium">Status:</span>
                        <select
                          value={ord.status}
                          onChange={async (e) => {
                            await updateOrderStatus(ord.id, e.target.value as any);
                            loadAllData();
                            showToast(`Status updated to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-obsidian-900 border border-gold-500/30 text-white font-semibold focus:outline-none focus:border-gold-400"
                        >
                          <option value="Pending Confirmation">Pending Confirmation</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <a
                        href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(ord.customerName)}!%20This%20is%20Zain's%20Kitchen%20regarding%20your%20order%20${ord.orderNumber}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brandGreen hover:underline flex items-center gap-1 font-semibold"
                      >
                        Message Customer on WhatsApp →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 5. CATERING INQUIRIES MANAGER ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Catering & Corporate Inquiries</h1>
                <p className="text-xs text-cream-400">Manage bulk lunch box requests and office catering leads.</p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-obsidian-850 border border-gold-500/20 text-cream-400 text-xs">
                No catering inquiries received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/10 pb-2">
                      <div>
                        <span className="font-bold text-white text-sm">{inq.fullName}</span>
                        {inq.organizationName && <span className="text-xs text-gold-300 ml-2">({inq.organizationName})</span>}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300">
                        {inq.eventType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-cream-300">
                      <p>Phone: <strong className="text-white">{inq.phone}</strong></p>
                      <p>Est. People: <strong className="text-white">{inq.estimatedPeople}</strong></p>
                      <p>Preferred Date: <strong className="text-white">{inq.preferredDate}</strong></p>
                    </div>

                    {inq.message && (
                      <p className="p-3 rounded-xl bg-obsidian-900 text-xs text-cream-300 italic border border-gold-500/10">
                        &quot;{inq.message}&quot;
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gold-500/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cream-400">Status:</span>
                        <select
                          value={inq.status}
                          onChange={async (e) => {
                            await updateInquiryStatus(inq.id, e.target.value as any);
                            loadAllData();
                            showToast('Inquiry status updated.');
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-obsidian-900 border border-gold-500/30 text-white"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </div>

                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(inq.fullName)}!%20This%20is%20Zain's%20Kitchen%20regarding%20your%20catering%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-brandGreen text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        Reply on WhatsApp →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 6. BANNERS HUB ================= */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Banners Hub</h1>
                <p className="text-xs text-cream-400">
                  Upload pure food image banners. Recommended size: <strong>1920×600 (Desktop), 800×600 (Mobile)</strong>.
                </p>
              </div>

              <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-md self-start">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Compressing WebP...' : 'Upload New Banner'}</span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="rounded-2xl bg-obsidian-850 border border-gold-500/20 overflow-hidden shadow-xl space-y-3 p-3">
                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-obsidian-900 border border-gold-500/20">
                    <Image src={b.imageUrl} alt={b.altText} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-[11px] text-cream-400 font-mono">{b.recommendedSize}</span>
                    <button
                      onClick={() =>
                        setCustomConfirmModal({
                          isOpen: true,
                          title: 'Delete this banner?',
                          message: 'The banner will be permanently removed from the homepage.',
                          onConfirm: async () => {
                            await deleteBanner(b.id);
                            loadAllData();
                            showToast('Banner deleted.');
                          },
                        })
                      }
                      className="px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. STORE SETTINGS & PAYMENT ACCOUNTS ================= */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-gold-500/15">
              <h1 className="font-serif text-2xl font-bold text-white">Store & Financial Settings</h1>
              <p className="text-xs text-cream-400">Update WhatsApp numbers, delivery charges, and JazzCash/EasyPaisa/Bank accounts.</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveSettings(settings);
                showToast('Settings saved successfully!');
              }}
              className="space-y-6 max-w-3xl"
            >
              {/* WhatsApp & Timings */}
              <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-4">
                <h3 className="font-serif text-sm font-bold text-white border-b border-gold-500/15 pb-2">
                  Store Identity & Timings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">WhatsApp Helpline Number</label>
                    <input
                      type="text"
                      value={settings.whatsappFormatted}
                      onChange={(e) => setSettings({ ...settings, whatsappFormatted: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">Same-Day Order Window</label>
                    <input
                      type="text"
                      value={settings.orderAcceptanceWindow}
                      onChange={(e) => setSettings({ ...settings, orderAcceptanceWindow: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Fee Tiers */}
              <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-4">
                <h3 className="font-serif text-sm font-bold text-white border-b border-gold-500/15 pb-2">
                  Peshawar Delivery Tiers (PKR)
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">0–3 km Fee</label>
                    <input
                      type="number"
                      value={settings.deliveryTiers.tier1.fee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliveryTiers: {
                            ...settings.deliveryTiers,
                            tier1: { ...settings.deliveryTiers.tier1, fee: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">3–6 km Fee</label>
                    <input
                      type="number"
                      value={settings.deliveryTiers.tier2.fee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliveryTiers: {
                            ...settings.deliveryTiers,
                            tier2: { ...settings.deliveryTiers.tier2, fee: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">6 km+ Fee</label>
                    <input
                      type="number"
                      value={settings.deliveryTiers.tier3.fee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          deliveryTiers: {
                            ...settings.deliveryTiers,
                            tier3: { ...settings.deliveryTiers.tier3, fee: Number(e.target.value) },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Accounts */}
              <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-4">
                <h3 className="font-serif text-sm font-bold text-white border-b border-gold-500/15 pb-2">
                  Customer Payment Accounts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">JazzCash Account Number</label>
                    <input
                      type="text"
                      value={settings.paymentAccounts.jazzCash.accountNumber}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentAccounts: {
                            ...settings.paymentAccounts,
                            jazzCash: { ...settings.paymentAccounts.jazzCash, accountNumber: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-300 mb-1">EasyPaisa Account Number</label>
                    <input
                      type="text"
                      value={settings.paymentAccounts.easyPaisa.accountNumber}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentAccounts: {
                            ...settings.paymentAccounts,
                            easyPaisa: { ...settings.paymentAccounts.easyPaisa, accountNumber: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">Bank Name & IBAN</label>
                  <input
                    type="text"
                    value={settings.paymentAccounts.bankTransfer.iban}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentAccounts: {
                          ...settings.paymentAccounts,
                          bankTransfer: { ...settings.paymentAccounts.bankTransfer, iban: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs shadow-lg"
              >
                Save All Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ================= EDIT / ADD PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="relative w-full max-w-lg bg-obsidian-950 border border-gold-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-cream-100">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <h3 className="font-serif text-base font-bold text-white">
                {editingProduct.id ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveProduct(editingProduct as any);
                setEditingProduct(null);
                loadAllData();
                showToast('Dish saved successfully!');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Chicken Biryani Lunch Box"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Optional strike price"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'roti-lunch-boxes'}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.slug === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                        categoryName: selCat?.name || e.target.value,
                        isLunchBox: e.target.value.includes('lunch-box'),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Is Lunch Box? (Min 5 rule)</label>
                  <select
                    value={editingProduct.isLunchBox ? 'yes' : 'no'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isLunchBox: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                  >
                    <option value="yes">Yes (Enforce 5 Box Min)</option>
                    <option value="no">No (Regular Dish)</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload (Client-side WebP Compression) */}
              <div>
                <label className="block font-semibold mb-1">Upload Dish Photo</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/30 text-gold-300 font-semibold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Compressing WebP...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                  </label>
                  {editingProduct.thumbnail && (
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gold-500/40">
                      <Image src={editingProduct.thumbnail} alt="Thumbnail" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-850 text-cream-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold shadow-md"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD CATEGORY MODAL ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="relative w-full max-w-md bg-obsidian-950 border border-gold-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-cream-100 text-xs">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <h3 className="font-serif text-base font-bold text-white">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveCategory(editingCategory as any);
                setEditingCategory(null);
                loadAllData();
                showToast('Category saved.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={editingCategory.icon || '🍱'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-gold-500/25 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showInTop"
                  checked={editingCategory.showInTopCategories !== false}
                  onChange={(e) => setEditingCategory({ ...editingCategory, showInTopCategories: e.target.checked })}
                  className="w-4 h-4 accent-gold-500"
                />
                <label htmlFor="showInTop" className="font-semibold text-white">
                  Show in Top Categories Scroller on Home Page
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-850 text-cream-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PAYMENT PROOF SCREENSHOT VIEWER MODAL ================= */}
      {viewingPaymentProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
          <div className="relative max-w-lg w-full bg-obsidian-950 border border-gold-500/30 rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
              <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-gold-400" />
                <span>Payment Screenshot Proof</span>
              </h3>
              <button onClick={() => setViewingPaymentProof(null)} className="p-1 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full max-h-[70vh] aspect-[3/4] bg-obsidian-900 rounded-xl overflow-hidden border border-gold-500/20">
              <Image src={viewingPaymentProof} alt="Payment Proof" fill className="object-contain" unoptimized />
            </div>
          </div>
        </div>
      )}

      {/* ================= PRISTINE WHITE PRINTABLE INVOICE ================= */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
          <div className="relative w-full max-w-2xl bg-white text-black p-8 rounded-2xl shadow-2xl space-y-6" id="printable-invoice">
            {/* Action Bar (hidden during actual window.print) */}
            <div className="no-print flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-gray-600">Printable Invoice Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now</span>
                </button>
                <button onClick={() => setPrintingOrder(null)} className="p-1 text-gray-500 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pure White High-Contrast Invoice Document */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h1 className="text-xl font-bold font-serif tracking-tight text-black">ZAIN&apos;S KITCHEN</h1>
                <p className="text-xs text-gray-600">Where Taste Meets Passion</p>
                <p className="text-xs text-gray-600">Peshawar, Khyber Pakhtunkhwa, Pakistan</p>
                <p className="text-xs text-gray-600">Helpline / WhatsApp: 0303-8835378</p>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">OFFICIAL INVOICE</h2>
                <p className="text-xs font-mono font-bold mt-1 text-black">{printingOrder.orderNumber}</p>
                <p className="text-xs text-gray-500">{new Date(printingOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="block text-gray-500 uppercase text-[10px]">Billed & Dispatched To:</strong>
                <p className="font-bold text-sm text-black">{printingOrder.customerName}</p>
                <p className="text-gray-700">Phone: {printingOrder.customerPhone}</p>
                <p className="text-gray-700">Address: {printingOrder.deliveryAddress || 'Self-Pickup'}</p>
              </div>
              <div className="text-right">
                <strong className="block text-gray-500 uppercase text-[10px]">Payment Information:</strong>
                <p className="font-semibold text-black">Method: {printingOrder.paymentMethod}</p>
                <p className="text-gray-700">Payment Status: {printingOrder.paymentStatus}</p>
                <p className="text-gray-700">Order Type: {printingOrder.orderType}</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-gray-300 bg-gray-50 text-gray-700">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {printingOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-medium text-black">{it.productName}</td>
                    <td className="py-2 px-3 text-center">{it.quantity}</td>
                    <td className="py-2 px-3 text-right">Rs. {it.unitPrice}</td>
                    <td className="py-2 px-3 text-right font-bold">Rs. {it.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end pt-2 text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-gray-700">
                  <span>Food Subtotal:</span>
                  <span>Rs. {printingOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges:</span>
                  <span>Rs. {printingOrder.deliveryCharges}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black border-t pt-1.5">
                  <span>Grand Total:</span>
                  <span className="text-base">Rs. {printingOrder.grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center text-[10px] text-gray-500">
              <p>Thank you for supporting Zain&apos;s Kitchen! Fresh food cooked with love & hygiene.</p>
              <p>For inquiries or future meal bookings, WhatsApp us at 0303-8835378.</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM CONFIRMATION MODAL (NO LOCALHOST SAYS) ================= */}
      {customConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="relative max-w-sm w-full bg-obsidian-950 border border-gold-500/30 rounded-2xl p-5 shadow-2xl space-y-3 text-cream-100 text-xs">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{customConfirmModal.title}</span>
            </h3>
            <p className="text-cream-300">{customConfirmModal.message}</p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setCustomConfirmModal(null)}
                className="px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-cream-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  customConfirmModal.onConfirm();
                  setCustomConfirmModal(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
