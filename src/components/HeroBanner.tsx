import React from 'react';
import { ArrowDown, Sparkles, Tag, Flame, ShieldCheck } from 'lucide-react';
import { DiscountSettings } from '../types';

interface HeroBannerProps {
  discount: DiscountSettings;
  onExplore: () => void;
  onExploreDeals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  discount,
  onExplore,
  onExploreDeals,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5ECE1] to-[#EBE0D0] border border-[#E8DFC0] p-6 sm:p-8 text-right shadow-xs transition-all">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-[#DFCBB5]/40 rounded-full blur-2xl pointer-events-none -translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#34533F]/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start text-right">
        {/* SHEIN-style Top Flash Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wider bg-[#34533F] text-white px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>منتجات هندية أصلية 100%</span>
          </span>

          {discount.isEnabled && (
            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-[#9E4B3E] text-white px-2.5 py-1 rounded-full animate-pulse shadow-xs">
              <Flame className="w-3 h-3" />
              <span>خصم {discount.percentage}%</span>
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#243429] leading-snug mb-2 flex items-center gap-1.5">
          <span>جمالج بطابع هندي أصيل</span>
          <span className="text-xl">✨</span>
        </h2>

        <p className="text-[#655444] text-xs sm:text-sm leading-relaxed max-w-md mb-5 font-normal">
          أقوى زيوت تطويل وتكثيف الشعر، حنة راجستان الطبيعية، وأعشاب العناية بالبشرة المستوردة مباشرة من مزارع الهند، مع توصيل لجميع محافظات العراق والدفع عند الاستلام.
        </p>

        {/* Promo Code Pill */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs border border-[#DECDBE] px-3 py-1.5 rounded-xl mb-5 text-xs text-[#5C4D3E]">
          <Tag className="w-3.5 h-3.5 text-[#9E4B3E]" />
          <span>كوبون ترويجي إضافي: <strong className="font-mono text-[#34533F] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8DFC0]">LULU10</strong></span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="hero-shop-btn"
            type="button"
            onClick={onExplore}
            className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-[#34533F] text-white font-extrabold text-sm sm:text-base hover:bg-[#273F30] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>تسوقي الآن</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          {discount.isEnabled && (
            <button
              id="hero-deals-btn"
              type="button"
              onClick={onExploreDeals}
              className="px-5 py-3 rounded-full font-bold text-xs sm:text-sm bg-white text-[#9E4B3E] hover:bg-[#FAF7F2] border border-[#DFCFC0] transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>تصفح العروض</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
