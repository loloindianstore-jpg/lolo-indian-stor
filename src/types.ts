export type UserRole = 'owner' | 'assistant' | 'customer';

export type AuthProviderType = 'google' | 'phone' | 'email' | 'demo';

export interface UserAccount {
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  provider?: AuthProviderType;
  avatarUrl?: string;
  isLoggedIn?: boolean;
  city?: string;
  token?: string;
  lastLoginAt?: number;
}

export interface Assistant {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  canAddProducts: boolean;
}

export interface DiscountSettings {
  isEnabled: boolean;
  percentage: number; // e.g. 15 for 15%
  title: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  createdAt: number;
  rating?: number;
  reviewsCount?: number;
  isBestSeller?: boolean;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  notes?: string;
  items: CartItem[];
  total: number;
  discountSavings: number;
  createdAt: number;
  status: 'new' | 'confirmed' | 'delivered';
}

