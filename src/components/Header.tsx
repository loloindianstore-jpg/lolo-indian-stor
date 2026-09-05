import React from 'react';
import { ShoppingBag, Heart, Search, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearchFocus: () => void;
  onOpenSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearchFocus,
  onOpenSupport,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE7DC] px-4 py-3 sm:px-6">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Brand Name matching international shopping style */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <h1
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-black tracking-tight text-[#7A4E2B] flex items-center gap-1.5 cursor-pointer select-none"
            >
              <span>لولو الهندية</span>
              <span className="text-xl">🌿</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A17C5B]">
              Lulu India Shop • العراق
            </span>
          </div>
        </div>

        {/* Customer Action Controls ONLY: Search, Wishlist, Cart */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger button */}
          <button
            id="header-search-btn"
            type="button"
            onClick={onOpenSearchFocus}
            className="w-10 h-10 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] flex items-center justify-center transition-colors border border-[#E5DACB]"
            title="البحث عن منتج"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Customer Wishlist / Favorites button with count */}
          <button
            id="header-wishlist-btn"
            type="button"
            onClick={onOpenWishlist}
            className="relative w-10 h-10 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] flex items-center justify-center transition-colors border border-[#E5DACB]"
            title="قائمة المفضلة"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#FAF7F2]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer Cart Icon Button with Badge */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={onOpenCart}
            aria-label="سلة التسوق"
            className="relative w-10 h-10 rounded-full bg-[#34533F] hover:bg-[#284131] text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-[#A83232] text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-[#FAF7F2] animate-in fade-in zoom-in">
                {cartCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 bg-[#284131] text-white/80 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#FAF7F2]">
                0
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
