export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // 'roti-lunchbox' | 'rice-lunchbox' | 'restaurant-main' | 'naan-bread' | 'restaurant-extras' | 'roti-addons' | 'rice-addons'
  categoryName: string;
  subCategory?: string;
  images: string[];
  thumbnail: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isDailySpecial?: boolean;
  isLunchBox?: boolean;
  includedItems?: string[];
  minimumOrderQuantity?: number; // e.g., 5 for lunchboxes
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isMainCategory: boolean;
  showInTopCategories: boolean;
  displayOrder: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isLunchBox: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'Delivery' | 'Pickup';
  deliveryAddress?: string;
  orderDate: string;
  preferredTime?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  specialInstructions?: string;
  paymentMethod: 'Cash on Delivery' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentProofUrl?: string; // Screenshot proof of payment
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CateringInquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  organizationName?: string;
  eventType: 'Office Lunch' | 'Bulk Lunch Boxes' | 'Family Gathering' | 'Small Event' | 'Recurring Weekly / Monthly Plan';
  estimatedPeople: number;
  preferredDate: string;
  orderType: 'Delivery' | 'Pickup';
  budgetRange?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Accepted' | 'Declined';
  notes?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  altText: string;
  isActive: boolean;
  displayOrder: number;
  recommendedSize: string; // e.g., '1920x600 Desktop, 800x600 Mobile'
  createdAt: string;
}

export interface SiteSettings {
  storeName: string;
  tagline: string;
  brandTaglines: string[];
  location: string;
  whatsappNumber: string; // '923038835378'
  whatsappFormatted: string; // '03038835378'
  instagramUsername: string; // '@zain.kitchen_'
  instagramUrl: string; // 'https://www.instagram.com/zain.kitchen_/'
  operatingHours: string; // 'Monday to Sunday, 10:00 AM - 10:00 PM'
  orderAcceptanceWindow: string; // '10:00 AM - 12:00 PM'
  breakfastDays: string; // 'Saturday & Sunday'
  minimumLunchBoxQuantity: number; // 5
  deliveryTiers: {
    tier1: { label: '0 - 3 km'; fee: number }; // 200
    tier2: { label: '3 - 6 km'; fee: number }; // 230
    tier3: { label: '6 km+'; fee: number }; // 270
  };
  packagingPolicy: string;
  paymentAccounts: {
    codEnabled: boolean;
    jazzCash: {
      enabled: boolean;
      accountTitle: string;
      accountNumber: string;
    };
    easyPaisa: {
      enabled: boolean;
      accountTitle: string;
      accountNumber: string;
    };
    bankTransfer: {
      enabled: boolean;
      bankName: string;
      accountTitle: string;
      accountNumber: string;
      iban: string;
    };
  };
  announcementText?: string;
  isAutoSyncEnabled: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  freeDelivery: boolean;
  isActive: boolean;
}
