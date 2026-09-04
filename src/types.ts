export type UserRole = 'owner' | 'assistant' | 'customer';

export interface UserAccount {
  email: string;
  role: UserRole;
  name?: string;
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

