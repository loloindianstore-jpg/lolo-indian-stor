import React, { useState } from 'react';
import { Product, DiscountSettings } from '../types';
import { X, ShoppingBag, Check, MessageCircle, ShieldCheck, Sparkles, Tag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  discount: DiscountSettings;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  discount,
  onClose,
  onAddToCart,
}) => {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const hasDiscount = discount.isEnabled && discount.percentage > 0;
  const effectivePrice = hasDiscount
    ? Math.round(product.price * (1 - discount.percentage / 100))
    : product.price;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsAppOrder = () => {
    const priceText = `${effectivePrice.toLocaleString('ar-IQ')} د.ع`;
    const text = encodeURIComponent(
      `مرحباً متجر لولو الهندية، أود الاستفسار وطلب منتج: ${product.title} بسعر ${priceText}.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#EAE2D5] shadow-2xl overflow-hidden text-right my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full aspect-16/10 sm:aspect-16/11 bg-[#F9F5EE] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#34533F] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
            {product.category}
          </div>

          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-[#9E4B3E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>خصم {discount.percentage}%</span>
            </div>
          )}
        </div>

        {/* Details Container */}
        <div className="p-5 sm:p-7 space-y-4">
          {/* Header Title & Price */}
          <div className="flex items-start justify-between gap-3 border-b border-[#F0EAE0] pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#283C30]">
                {product.title}
              </h3>
              <span className="text-xs text-[#8A7969] mt-0.5 block">
                متجر لولو الهندية • منتج أصلي ومضمون
              </span>
            </div>
            <div className="text-left shrink-0">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-xl sm:text-2xl font-black text-[#7A4E2B]">
                  {effectivePrice.toLocaleString('ar-IQ')}
                </span>
                <span className="text-xs font-bold text-[#8C7A6A]">
                  د.ع
                </span>
              </div>
              {hasDiscount && (
                <span className="text-xs text-[#A89887] line-through block text-left">
                  {product.price.toLocaleString('ar-IQ')} د.ع
                </span>
              )}
            </div>
          </div>

          {/* Product Description: Prominently Below Product Image */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE7DC]">
            <h4 className="text-xs font-bold uppercase text-[#8C7257] tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تفاصيل ووصف المنتج</span>
            </h4>
            <p className="text-sm text-[#4C3B2E] leading-relaxed whitespace-pre-line font-medium">
              {product.description}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#6B5A4B] pt-1">
            <div className="flex items-center gap-1.5 bg-[#F8F4EE] p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#34533F]" />
              <span>مستخلصات وأعشاب طبيعية</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F8F4EE] p-2 rounded-xl">
              <span>🚚</span>
              <span>توصيل لكافة محافظات العراق</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className={`w-full sm:flex-1 py-3 px-6 rounded-full font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-98 ${
                added
                  ? 'bg-[#273F30] text-white'
                  : 'bg-[#34533F] text-white hover:bg-[#284131]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>تمت الإضافة للسلة!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>إضافة إلى سلة الشراء</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full sm:w-auto py-3 px-5 rounded-full bg-[#EBF5EE] hover:bg-[#DDF0E2] text-[#257538] font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب عبر واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
