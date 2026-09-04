import React from 'react';
import { ArrowDown, ImagePlus, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onAddProduct: () => void;
  onExplore: () => void;
  hasProducts: boolean;
  canAddProducts: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onAddProduct,
  onExplore,
  hasProducts,
  canAddProducts,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#F5ECE1] border border-[#EBDDCF] p-6 sm:p-8 text-right shadow-xs transition-all">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#E9DAC8]/40 rounded-full blur-2xl pointer-events-none -translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#34533F]/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start text-right">
        <span className="text-[11px] font-extrabold tracking-widest text-[#947458] uppercase mb-2">
          LULU INDIA SHOP
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#283C30] leading-snug mb-3 flex items-center gap-1.5">
          <span>جمالج بطابع هندي</span>
          <span className="text-xl">✨</span>
        </h2>

        <p className="text-[#685848] text-sm sm:text-base leading-relaxed max-w-md mb-6 font-normal">
          منتجات هندية مختارة للعناية بالشعر والبشرة، مع تجربة تسوق بسيطة وسريعة.
        </p>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            id="hero-shop-btn"
            type="button"
            onClick={onExplore}
            className="px-7 py-3 rounded-full bg-[#34533F] text-white font-bold text-sm sm:text-base hover:bg-[#273F30] transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <span>تسوقي الآن</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          {/* Add Product Button is ONLY shown for Owner & Appointed Assistants! */}
          {canAddProducts && (
            <button
              id="hero-add-product-btn"
              type="button"
              onClick={onAddProduct}
              className="px-6 py-3 rounded-full font-bold text-sm sm:text-base transition-all shadow-xs active:scale-95 flex items-center gap-2 bg-[#EBDDCF] text-[#3E2B1E] hover:bg-[#E2D2C2]"
            >
              <ImagePlus className="w-4 h-4 text-inherit" />
              <span>إضافة صورة ووصف منتج</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
