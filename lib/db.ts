import { Product, Category, Order, Banner, SiteSettings, CateringInquiry, Coupon, CartItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_SETTINGS, INITIAL_COUPONS } from './seedData';
import { supabase, isCloudDatabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'zk_products_v1',
  CATEGORIES: 'zk_categories_v1',
  ORDERS: 'zk_orders_v1',
  BANNERS: 'zk_banners_v1',
  SETTINGS: 'zk_settings_v1',
  INQUIRIES: 'zk_inquiries_v1',
  COUPONS: 'zk_coupons_v1',
  CART: 'zk_cart_v1',
};

const dispatchEventSafely = (eventName: string, detail?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
};

// ==================== PRODUCTS ====================

export async function getProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') {
    return INITIAL_PRODUCTS;
  }

  // 1. Try cloud database if configured
  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, description, price, original_price, category, category_name, sub_category, images, thumbnail, is_available, is_featured, is_daily_special, is_lunch_box, included_items, minimum_order_quantity, display_order, created_at, updated_at')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: Product[] = data.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          originalPrice: p.original_price,
          category: p.category,
          categoryName: p.category_name,
          subCategory: p.sub_category,
          images: p.images || [],
          thumbnail: p.thumbnail || (p.images && p.images[0]) || '/images/dishes/roti_lunchbox_1.jpg',
          isAvailable: p.is_available,
          isFeatured: p.is_featured,
          isDailySpecial: p.is_daily_special,
          isLunchBox: p.is_lunch_box,
          includedItems: p.included_items || [],
          minimumOrderQuantity: p.minimum_order_quantity || 1,
          displayOrder: p.display_order || 0,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(formatted));
        return formatted;
      }
    } catch {
      // Fallback seamlessly to local cache
    }
  }

  // 2. Local resilient cache
  const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // corrupted JSON fallback
    }
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number; category: string }): Promise<Product> {
  const existingProducts = await getProducts();
  const id = product.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();

  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const updatedProduct: Product = {
    id,
    name: product.name,
    slug,
    description: product.description || '',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    category: product.category,
    categoryName: product.categoryName || product.category,
    subCategory: product.subCategory,
    images: product.images && product.images.length > 0 ? product.images : [product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'],
    thumbnail: product.thumbnail || (product.images && product.images[0]) || '/images/dishes/roti_lunchbox_1.jpg',
    isAvailable: product.isAvailable !== false,
    isFeatured: Boolean(product.isFeatured),
    isDailySpecial: Boolean(product.isDailySpecial),
    isLunchBox: Boolean(product.isLunchBox),
    includedItems: product.includedItems || [],
    minimumOrderQuantity: product.isLunchBox ? 5 : (product.minimumOrderQuantity || 1),
    displayOrder: product.displayOrder || existingProducts.length + 1,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  const index = existingProducts.findIndex((p) => p.id === id);
  let newProducts: Product[];
  if (index >= 0) {
    newProducts = [...existingProducts];
    newProducts[index] = updatedProduct;
  } else {
    newProducts = [updatedProduct, ...existingProducts];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
  dispatchEventSafely('zk_products_updated', newProducts);

  // Sync with cloud database
  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('products').upsert({
        id: updatedProduct.id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        description: updatedProduct.description,
        price: updatedProduct.price,
        original_price: updatedProduct.originalPrice,
        category: updatedProduct.category,
        category_name: updatedProduct.categoryName,
        sub_category: updatedProduct.subCategory,
        images: updatedProduct.images,
        thumbnail: updatedProduct.thumbnail,
        is_available: updatedProduct.isAvailable,
        is_featured: updatedProduct.isFeatured,
        is_daily_special: updatedProduct.isDailySpecial,
        is_lunch_box: updatedProduct.isLunchBox,
        included_items: updatedProduct.includedItems,
        minimum_order_quantity: updatedProduct.minimumOrderQuantity,
        display_order: updatedProduct.displayOrder,
        updated_at: updatedProduct.updatedAt,
      });
    } catch (err) {
      console.warn('Cloud DB product sync error:', err);
    }
  }

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const existingProducts = await getProducts();
  const filtered = existingProducts.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  dispatchEventSafely('zk_products_updated', filtered);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Cloud DB product delete error:', err);
    }
  }
}

export function exportProductsToCSV(products: Product[]): void {
  const headers = ['ID', 'Name', 'Slug', 'Category', 'SubCategory', 'Price (PKR)', 'Original Price (PKR)', 'Is Available', 'Is Lunch Box', 'Min Order', 'Thumbnail URL', 'All Image URLs', 'Included Items'];
  const rows = products.map((p) => [
    `"${p.id}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.slug}"`,
    `"${p.categoryName}"`,
    `"${p.subCategory || ''}"`,
    p.price,
    p.originalPrice || '',
    p.isAvailable ? 'Yes' : 'No',
    p.isLunchBox ? 'Yes' : 'No',
    p.minimumOrderQuantity || 1,
    `"${p.thumbnail}"`,
    `"${p.images.join('; ')}"`,
    `"${(p.includedItems || []).join(', ').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `zains_kitchen_products_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;

  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image, icon, is_main_category, show_in_top_categories, display_order, sub_categories')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: Category[] = data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          icon: c.icon,
          isMainCategory: c.is_main_category,
          showInTopCategories: c.show_in_top_categories,
          displayOrder: c.display_order,
          subCategories: c.sub_categories || [],
        }));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(formatted));
        return formatted;
      }
    } catch {
      // Fallback
    }
  }

  const cached = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

export async function saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
  const existing = await getCategories();
  const id = category.id || `cat-${Date.now()}`;
  const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const updated: Category = {
    id,
    name: category.name,
    slug,
    description: category.description || '',
    image: category.image || '/images/dishes/lunchbox_roti.jpg',
    icon: category.icon || '🍱',
    isMainCategory: category.isMainCategory !== false,
    showInTopCategories: category.showInTopCategories !== false,
    displayOrder: category.displayOrder || existing.length + 1,
    subCategories: category.subCategories || [],
  };

  const index = existing.findIndex((c) => c.id === id);
  let newCategories: Category[];
  if (index >= 0) {
    newCategories = [...existing];
    newCategories[index] = updated;
  } else {
    newCategories = [...existing, updated];
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
  dispatchEventSafely('zk_categories_updated', newCategories);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('categories').upsert({
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        image: updated.image,
        icon: updated.icon,
        is_main_category: updated.isMainCategory,
        show_in_top_categories: updated.showInTopCategories,
        display_order: updated.displayOrder,
        sub_categories: updated.subCategories,
      });
    } catch (err) {
      console.warn('Cloud DB category sync error:', err);
    }
  }

  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  const existing = await getCategories();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  dispatchEventSafely('zk_categories_updated', filtered);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Cloud DB category delete error:', err);
    }
  }
}

// ==================== ORDERS ====================

export async function getOrders(): Promise<Order[]> {
  if (typeof window === 'undefined') return [];

  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, customer_phone, customer_email, order_type, delivery_address, order_date, preferred_time, items, subtotal, delivery_charges, discount_amount, coupon_code, grand_total, special_instructions, payment_method, payment_status, payment_proof_url, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted: Order[] = data.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          customerEmail: o.customer_email,
          orderType: o.order_type,
          deliveryAddress: o.delivery_address,
          orderDate: o.order_date,
          preferredTime: o.preferred_time,
          items: o.items || [],
          subtotal: o.subtotal,
          deliveryCharges: o.delivery_charges,
          discountAmount: o.discount_amount || 0,
          couponCode: o.coupon_code,
          grandTotal: o.grand_total,
          specialInstructions: o.special_instructions,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          paymentProofUrl: o.payment_proof_url,
          status: o.status,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(formatted));
        return formatted;
      }
    } catch {}
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return cached ? JSON.parse(cached) : [];
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Order['status'] }): Promise<Order> {
  const existing = await getOrders();
  const id = `ord-${Date.now()}`;
  const orderNumber = `ZK-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderInput,
    id,
    orderNumber,
    status: orderInput.status || 'Pending Confirmation',
    createdAt: now,
    updatedAt: now,
  };

  const updatedOrders = [newOrder, ...existing];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
  dispatchEventSafely('zk_orders_updated', updatedOrders);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_email: newOrder.customerEmail,
        order_type: newOrder.orderType,
        delivery_address: newOrder.deliveryAddress,
        order_date: newOrder.orderDate,
        preferred_time: newOrder.preferredTime,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        delivery_charges: newOrder.deliveryCharges,
        discount_amount: newOrder.discountAmount,
        coupon_code: newOrder.couponCode,
        grand_total: newOrder.grandTotal,
        special_instructions: newOrder.specialInstructions,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        payment_proof_url: newOrder.paymentProofUrl,
        status: newOrder.status,
      });
    } catch (err) {
      console.warn('Cloud DB order insert error:', err);
    }
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<void> {
  const existing = await getOrders();
  const index = existing.findIndex((o) => o.id === orderId);
  if (index === -1) return;

  const updatedOrder = {
    ...existing[index],
    status,
    paymentStatus: paymentStatus || existing[index].paymentStatus,
    updatedAt: new Date().toISOString(),
  };

  existing[index] = updatedOrder;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(existing));
  dispatchEventSafely('zk_orders_updated', existing);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('orders').update({
        status: updatedOrder.status,
        payment_status: updatedOrder.paymentStatus,
        updated_at: updatedOrder.updatedAt,
      }).eq('id', orderId);
    } catch (err) {
      console.warn('Cloud DB order update error:', err);
    }
  }
}

// ==================== BANNERS ====================

export async function getBanners(): Promise<Banner[]> {
  if (typeof window === 'undefined') return INITIAL_BANNERS;

  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('id, image_url, alt_text, is_active, display_order, recommended_size, created_at')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: Banner[] = data.map((b) => ({
          id: b.id,
          imageUrl: b.image_url,
          altText: b.alt_text,
          isActive: b.is_active,
          displayOrder: b.display_order,
          recommendedSize: b.recommended_size || '1920x600 Desktop, 800x600 Mobile',
          createdAt: b.created_at,
        }));
        localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(formatted));
        return formatted;
      }
    } catch {}
  }

  const cached = localStorage.getItem(STORAGE_KEYS.BANNERS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  return INITIAL_BANNERS;
}

export async function saveBanner(banner: Partial<Banner> & { imageUrl: string }): Promise<Banner> {
  const existing = await getBanners();
  const id = banner.id || `banner-${Date.now()}`;
  const now = new Date().toISOString();

  const updated: Banner = {
    id,
    imageUrl: banner.imageUrl,
    altText: banner.altText || "Zain's Kitchen Signature Meal Banner",
    isActive: banner.isActive !== false,
    displayOrder: banner.displayOrder || existing.length + 1,
    recommendedSize: '1920x600 Desktop, 800x600 Mobile',
    createdAt: banner.createdAt || now,
  };

  const index = existing.findIndex((b) => b.id === id);
  let newBanners: Banner[];
  if (index >= 0) {
    newBanners = [...existing];
    newBanners[index] = updated;
  } else {
    newBanners = [...existing, updated];
  }

  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(newBanners));
  dispatchEventSafely('zk_banners_updated', newBanners);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('banners').upsert({
        id: updated.id,
        image_url: updated.imageUrl,
        alt_text: updated.altText,
        is_active: updated.isActive,
        display_order: updated.displayOrder,
        recommended_size: updated.recommendedSize,
      });
    } catch (err) {
      console.warn('Cloud DB banner sync error:', err);
    }
  }

  return updated;
}

export async function deleteBanner(id: string): Promise<void> {
  const existing = await getBanners();
  const filtered = existing.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(filtered));
  dispatchEventSafely('zk_banners_updated', filtered);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('banners').delete().eq('id', id);
    } catch (err) {
      console.warn('Cloud DB banner delete error:', err);
    }
  }
}

// ==================== CATERING INQUIRIES ====================

export async function getInquiries(): Promise<CateringInquiry[]> {
  if (typeof window === 'undefined') return [];

  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('catering_inquiries')
        .select('id, full_name, phone, email, organization_name, event_type, estimated_people, preferred_date, order_type, budget_range, message, status, notes, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted: CateringInquiry[] = data.map((i) => ({
          id: i.id,
          fullName: i.full_name,
          phone: i.phone,
          email: i.email,
          organizationName: i.organization_name,
          eventType: i.event_type,
          estimatedPeople: i.estimated_people,
          preferredDate: i.preferred_date,
          orderType: i.order_type,
          budgetRange: i.budget_range,
          message: i.message,
          status: i.status,
          notes: i.notes,
          createdAt: i.created_at,
        }));
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(formatted));
        return formatted;
      }
    } catch {}
  }

  const cached = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
  return cached ? JSON.parse(cached) : [];
}

export async function createInquiry(inquiryInput: Omit<CateringInquiry, 'id' | 'createdAt' | 'status'>): Promise<CateringInquiry> {
  const existing = await getInquiries();
  const id = `inq-${Date.now()}`;
  const now = new Date().toISOString();

  const newInquiry: CateringInquiry = {
    ...inquiryInput,
    id,
    status: 'New',
    createdAt: now,
  };

  const updated = [newInquiry, ...existing];
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  dispatchEventSafely('zk_inquiries_updated', updated);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('catering_inquiries').insert({
        id: newInquiry.id,
        full_name: newInquiry.fullName,
        phone: newInquiry.phone,
        email: newInquiry.email,
        organization_name: newInquiry.organizationName,
        event_type: newInquiry.eventType,
        estimated_people: newInquiry.estimatedPeople,
        preferred_date: newInquiry.preferredDate,
        order_type: newInquiry.orderType,
        budget_range: newInquiry.budgetRange,
        message: newInquiry.message,
        status: newInquiry.status,
      });
    } catch (err) {
      console.warn('Cloud DB inquiry insert error:', err);
    }
  }

  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: CateringInquiry['status'], notes?: string): Promise<void> {
  const existing = await getInquiries();
  const index = existing.findIndex((i) => i.id === id);
  if (index === -1) return;

  existing[index] = {
    ...existing[index],
    status,
    notes: notes !== undefined ? notes : existing[index].notes,
  };

  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(existing));
  dispatchEventSafely('zk_inquiries_updated', existing);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('catering_inquiries').update({
        status,
        notes,
      }).eq('id', id);
    } catch (err) {
      console.warn('Cloud DB inquiry update error:', err);
    }
  }
}

// ==================== SITE SETTINGS ====================

export async function getSettings(): Promise<SiteSettings> {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;

  if (isCloudDatabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'global_settings')
        .single();

      if (!error && data && data.settings_data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings_data));
        return data.settings_data;
      }
    } catch {}
  }

  const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  return INITIAL_SETTINGS;
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    paymentAccounts: {
      ...current.paymentAccounts,
      ...(settings.paymentAccounts || {}),
    },
    deliveryTiers: {
      ...current.deliveryTiers,
      ...(settings.deliveryTiers || {}),
    },
  };

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  dispatchEventSafely('zk_settings_updated', updated);

  if (isCloudDatabaseConfigured()) {
    try {
      await supabase.from('site_settings').upsert({
        id: 'global_settings',
        settings_data: updated,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Cloud DB settings sync error:', err);
    }
  }

  return updated;
}

// ==================== CART MANAGEMENT ====================

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cached = localStorage.getItem(STORAGE_KEYS.CART);
  return cached ? JSON.parse(cached) : [];
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  dispatchEventSafely('zk_cart_updated', items);
}

export function addToCart(product: Product, quantity: number = 1, specialInstructions?: string): CartItem[] {
  const cart = getCart();
  const index = cart.findIndex((item) => item.product.id === product.id);

  if (index >= 0) {
    cart[index].quantity += quantity;
    if (specialInstructions) cart[index].specialInstructions = specialInstructions;
  } else {
    // If lunch box, initialize with at least product.minimumOrderQuantity if quantity < min
    const initialQty = product.isLunchBox ? Math.max(quantity, product.minimumOrderQuantity || 5) : quantity;
    cart.push({
      product,
      quantity: initialQty,
      specialInstructions,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((item) => item.product.id !== productId);
  } else {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}
