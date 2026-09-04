import React, { useState } from 'react';
import { Product, DiscountSettings } from '../types';
import { ShoppingBag, Edit3, Trash2, Eye, Check, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  discount: DiscountSettings;
  canManage: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discount,
  canManage,
  onAddToCart,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isLongDescription = product.description.length > 90;
  const displayDescription =
    isLongDescription && !isExpanded
      ? `${product.description.slice(0, 90)}...`
      : product.description;

  const hasDiscount = discount.isEnabled && discount.percentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - discount.percentage / 100))
    : product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-3xl border border-[#EAE2D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#D5C7B4] transition-all flex flex-col cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-[#FAF5EE] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Pill */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#34533F] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-[#EBE3D7]">
          {product.category}
        </span>

        {/* Discount Badge if active */}
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-[#9E4B3E] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 animate-in zoom-in">
            <Tag className="w-3 h-3" />
            <span>خصم {discount.percentage}%</span>
          </span>
        )}

        {/* Quick Actions overlay - ONLY for Personal Account & Appointed Assistants! */}
        {canManage && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#4A3728] shadow-sm flex items-center justify-center transition-colors"
              title="تعديل المنتج والوصف"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('هل أنت متأكدة من حذف هذا المنتج؟')) {
                  onDelete(product.id);
                }
              }}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-red-50 text-red-600 shadow-sm flex items-center justify-center transition-colors"
              title="حذف المنتج"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info & Description */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-right">
        <div>
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-base sm:text-lg font-bold text-[#2A1E17] leading-snug group-hover:text-[#34533F] transition-colors">
              {product.title}
            </h4>
            <div className="shrink-0 text-left">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-base sm:text-lg font-black text-[#7A4E2B] whitespace-nowrap">
                  {discountedPrice.toLocaleString('ar-IQ')}
                </span>
                <span className="text-[10px] font-bold text-[#8C7A6A]">
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

          {/* Dedicated Description Section Below Product Title/Image */}
          <div className="mt-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DD]">
            <span className="text-[11px] font-bold text-[#8C7257] block mb-1">
              وصف المنتج:
            </span>
            <p className="text-xs sm:text-sm text-[#5C4D3E] leading-relaxed whitespace-pre-line">
              {displayDescription}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="mt-1 text-[11px] font-bold text-[#34533F] hover:underline"
              >
                {isExpanded ? 'عرض أقل' : 'قراءة المزيد...'}
              </button>
            )}
          </div>
        </div>

        {/* Action Button: Add to Cart */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE2] flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-95 ${
              addedAnimation
                ? 'bg-[#273F30] text-white'
                : 'bg-[#34533F] text-white hover:bg-[#284131]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>تمت الإضافة للسلة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة إلى السلة</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] transition-colors"
            title="عرض التفاصيل الكاملة"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
