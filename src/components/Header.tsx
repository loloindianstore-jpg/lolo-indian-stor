import React from 'react';
import { ShoppingBag, ImagePlus, User, UserCheck, Users, Shield } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  cartCount: number;
  currentUser: UserAccount | null;
  canAddProducts: boolean;
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
  onOpenAuth: () => void;
  onOpenAssistants: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  currentUser,
  canAddProducts,
  onOpenCart,
  onOpenAddProduct,
  onOpenAuth,
  onOpenAssistants,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE7DC] px-4 py-3 sm:px-6">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Brand Name matching screenshot */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black tracking-tight text-[#7A4E2B] flex items-center gap-1.5 cursor-pointer">
              <span>لولو الهندية</span>
              <span className="text-xl">🌿</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A17C5B]">
              Lulu India Shop
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* User Account / Login Button */}
          <button
            id="header-user-btn"
            type="button"
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              currentUser?.role === 'owner'
                ? 'bg-[#34533F]/10 text-[#34533F] border-[#34533F]/25'
                : currentUser?.role === 'assistant'
                ? 'bg-[#D97706]/10 text-[#B45309] border-[#D97706]/25'
                : 'bg-[#F3ECE1] text-[#5C4D3E] border-[#E5DACB] hover:bg-[#EAE0D2]'
            }`}
            title="إدارة الحساب وتسجيل الدخول"
          >
            {currentUser?.role === 'owner' ? (
              <>
                <span className="text-xs">👑</span>
                <span className="hidden sm:inline">حسابي الشخصي</span>
              </>
            ) : currentUser?.role === 'assistant' ? (
              <>
                <span className="text-xs">⭐</span>
                <span className="hidden sm:inline">مساعد معتمد</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </>
            )}
          </button>

          {/* Manage Assistants Button (Visible ONLY to Owner) */}
          {currentUser?.role === 'owner' && (
            <button
              id="header-assistants-btn"
              type="button"
              onClick={onOpenAssistants}
              className="p-2 rounded-full bg-[#F3ECE1] text-[#7A4E2B] hover:bg-[#EAE0D2] border border-[#E5DACB] transition-colors"
              title="تعيين وإدارة المساعدين لإضافة المنتجات"
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          {/* Quick Add Product Button with Image Icon - HIDDEN for Customers, ONLY for Owner & Appointed Assistants! */}
          {canAddProducts && (
            <button
              id="header-add-product-btn"
              type="button"
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#34533F] text-white text-xs sm:text-sm font-semibold hover:bg-[#284131] transition-all shadow-xs active:scale-95 animate-in fade-in"
              title="إضافة منتج مع صورة ووصف"
            >
              <ImagePlus className="w-4 h-4" />
              <span className="hidden xs:inline">إضافة منتج</span>
            </button>
          )}

          {/* Cart Icon Button with Badge */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={onOpenCart}
            aria-label="سلة التسوق"
            className="relative w-10 h-10 rounded-full bg-[#F3ECE1] hover:bg-[#EADFCF] text-[#4A3728] flex items-center justify-center transition-all active:scale-95 border border-[#E5DACB]"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-[#A83232] text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-[#FAF7F2] animate-in fade-in zoom-in">
                {cartCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 bg-[#9E4B3E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#FAF7F2]">
                0
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
