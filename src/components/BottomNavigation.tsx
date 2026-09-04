import React from 'react';
import { Home, Grid, ImagePlus, ShoppingBag, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'categories' | 'add' | 'cart' | 'account';
  cartCount: number;
  canAddProducts: boolean;
  onNavigate: (tab: 'home' | 'categories' | 'add' | 'cart' | 'account') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  cartCount,
  canAddProducts,
  onNavigate,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE1D3] py-2 px-4 shadow-lg sm:max-w-xl sm:mx-auto sm:rounded-t-3xl">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'home'
              ? 'text-[#34533F] font-bold'
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
              ? 'text-[#34533F] font-bold'
              : 'text-[#847363] hover:text-[#2A1D16]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[11px]">الأقسام</span>
        </button>

        {/* Center Button: "إضافة منتج" ONLY for Owner & Appointed Assistants; for Customers it's "حسابي" */}
        {canAddProducts ? (
          <button
            id="nav-tab-add"
            type="button"
            onClick={() => onNavigate('add')}
            className="flex flex-col items-center -mt-5 group"
            title="إضافة صورة ووصف منتج"
          >
            <div className="w-13 h-13 rounded-full bg-[#34533F] text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-all border-4 border-[#FAF7F2]">
              <ImagePlus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-[#34533F] mt-1">
              إضافة منتج
            </span>
          </button>
        ) : (
          <button
            id="nav-tab-account"
            type="button"
            onClick={() => onNavigate('account')}
            className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
              activeTab === 'account'
                ? 'text-[#34533F] font-bold'
                : 'text-[#847363] hover:text-[#2A1D16]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px]">حسابي</span>
          </button>
        )}

        {/* Cart */}
        <button
          id="nav-tab-cart"
          type="button"
          onClick={() => onNavigate('cart')}
          className={`relative flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
            activeTab === 'cart'
              ? 'text-[#34533F] font-bold'
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

        {/* If canAddProducts is true, also show account button on the far side */}
        {canAddProducts && (
          <button
            id="nav-tab-account-owner"
            type="button"
            onClick={() => onNavigate('account')}
            className={`flex flex-col items-center gap-1 transition-colors py-1 px-3 ${
              activeTab === 'account'
                ? 'text-[#34533F] font-bold'
                : 'text-[#847363] hover:text-[#2A1D16]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px]">حسابي</span>
          </button>
        )}
      </div>
    </div>
  );
};
