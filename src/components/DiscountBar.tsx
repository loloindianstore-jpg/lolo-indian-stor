import React from 'react';
import { DiscountSettings } from '../types';
import { Flame, Sparkles } from 'lucide-react';

interface DiscountBarProps {
  discount: DiscountSettings;
}

export const DiscountBar: React.FC<DiscountBarProps> = ({ discount }) => {
  if (!discount.isEnabled) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-1">
      <div className="bg-gradient-to-r from-[#8E3B2E] via-[#A84A3B] to-[#8E3B2E] text-white py-2.5 px-4 rounded-2xl shadow-sm flex items-center justify-between text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="text-base animate-bounce">🔥</span>
          <span className="truncate">
            {discount.title || `عروض وتخفيضات فعّالة الآن (خصم ${discount.percentage}%)`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide border border-white/20">
            خصم {discount.percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
