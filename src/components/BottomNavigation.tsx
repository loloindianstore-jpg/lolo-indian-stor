import React from 'react';
import { Home, Grid, Tag, Heart, ShoppingBag } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'categories' | 'deals' | 'wishlist' | 'cart';
  cartCount: number;
  wishlistCount: number;
  onNavigate: (tab: 'home' | 'categories' | 'deals' | 'wishlist' | 'cart') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  cartCount,
  wishlistCount,
  onNavigate,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE1D3] py-2 px-3 shadow-lg sm:max-w-xl sm:mx-auto sm:rounded-t-3xl">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'home'
              ? 'text-[#34533F] font-black'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">الرئيسية</span>
        </button>

        {/* Categories */}
        <button
          id="nav-tab-categories"
          type="button"
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'categories'
              ? 'text-[#34533F] font-black'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[11px]">الأقسام</span>
        </button>

        {/* Deals / Flash Sales (SHEIN-style) */}
        <button
          id="nav-tab-deals"
          type="button"
          onClick={() => onNavigate('deals')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'deals'
              ? 'text-[#9E4B3E] font-black'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <div className="relative">
            <Tag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-[11px]">العروض</span>
        </button>

        {/* Wishlist */}
        <button
          id="nav-tab-wishlist"
          type="button"
          onClick={() => onNavigate('wishlist')}
          className={`relative flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'wishlist'
              ? 'text-[#34533F] font-black'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">المفضلة</span>
        </button>

        {/* Cart */}
        <button
          id="nav-tab-cart"
          type="button"
          onClick={() => onNavigate('cart')}
          className={`relative flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'cart'
              ? 'text-[#34533F] font-black'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#A83232] text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">السلة</span>
        </button>
      </div>
    </div>
  );
};
