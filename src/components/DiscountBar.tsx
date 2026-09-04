import React, { useState } from 'react';
import { DiscountSettings } from '../types';
import { Tag, Sparkles, Percent, Settings, Check, X } from 'lucide-react';

interface DiscountBarProps {
  discount: DiscountSettings;
  onUpdateDiscount: (newSettings: DiscountSettings) => void;
  isOwnerOrAssistant: boolean;
}

export const DiscountBar: React.FC<DiscountBarProps> = ({
  discount,
  onUpdateDiscount,
  isOwnerOrAssistant,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customPercentage, setCustomPercentage] = useState(discount.percentage);
  const [customTitle, setCustomTitle] = useState(discount.title);

  const handleToggle = () => {
    onUpdateDiscount({
      ...discount,
      isEnabled: !discount.isEnabled,
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDiscount({
      isEnabled: true,
      percentage: Number(customPercentage) || 10,
      title: customTitle.trim() || `خصم ${customPercentage}% لفترة محدودة`,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-2">
      {/* 1. Shopper Banner when Discount is Active */}
      {discount.isEnabled && (
        <div className="bg-gradient-to-r from-[#9E4B3E] to-[#B35445] text-white py-2 px-4 rounded-2xl shadow-xs flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <span className="text-base animate-pulse">🔥</span>
            <span>
              {discount.title || `عروض وتخفيضات فعّالة الآن (خصم ${discount.percentage}%)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide">
              خصم {discount.percentage}%
            </span>
          </div>
        </div>
      )}

      {/* 2. Admin / Owner Control Toggle (زر يمكن تفعيله والغاءه اذا وجدت خصومات) */}
      {isOwnerOrAssistant && (
        <div className="bg-[#FAF2E6] border border-[#E9DAC6] p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                discount.isEnabled
                  ? 'bg-[#9E4B3E] text-white'
                  : 'bg-[#E5DACB] text-[#7A6A5C]'
              }`}
            >
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#3E2B1E]">
                  زر الخصومات والعروض:
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    discount.isEnabled
                      ? 'bg-[#9E4B3E] text-white'
                      : 'bg-[#E5DACB] text-[#5C4D3E]'
                  }`}
                >
                  {discount.isEnabled ? 'مفعّل حالياً' : 'معطّل'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6A5C]">
                {discount.isEnabled
                  ? `يطبق خصم ${discount.percentage}% فورياً على كافة المنتجات والسلة`
                  : 'يمكنكِ تفعيل الخصومات بنقرة واحدة عند وجود عروض'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Toggle Switch */}
            <button
              id="toggle-discount-btn"
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                discount.isEnabled ? 'bg-[#9E4B3E]' : 'bg-[#D6C7B6]'
              }`}
              title={discount.isEnabled ? 'إلغاء تفعيل الخصومات' : 'تفعيل الخصومات'}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  discount.isEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            {/* Custom Settings button */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5ECE1] border border-[#DFCFC0] text-[#5C4D3E] text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>تعديل النسبة</span>
            </button>
          </div>
        </div>
      )}

      {/* Editing Modal/Drop for Discount Details */}
      {isEditing && isOwnerOrAssistant && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white p-4 rounded-2xl border border-[#E5DACB] shadow-xs space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#F2EDE5]">
            <h5 className="text-xs font-bold text-[#3E2B1E] flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-[#9E4B3E]" />
              <span>إعدادات نسبة الخصم وعنوان العرض</span>
            </h5>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#8C7A6A] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                نسبة الخصم (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={customPercentage}
                  onChange={(e) => setCustomPercentage(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2 px-3 border border-[#DECDBE] text-right font-bold focus:outline-none focus:border-[#34533F]"
                />
                {/* Quick percentages */}
                {[10, 15, 20, 25].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCustomPercentage(p)}
                    className={`text-xs px-2 py-1.5 rounded-lg border font-bold ${
                      customPercentage === p
                        ? 'bg-[#34533F] text-white border-[#34533F]'
                        : 'bg-[#FAF7F2] text-[#5C4D3E] border-[#DECDBE]'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                عنوان العرض الترويجي
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="مثال: عروض نهاية الأسبوع الهندية"
                className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#34533F] text-white font-bold text-xs sm:text-sm hover:bg-[#284131] transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>حفظ وتفعيل نسبة الخصم</span>
          </button>
        </form>
      )}
    </div>
  );
};
