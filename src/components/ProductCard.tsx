import React, { useState } from 'react';
import { Product, DiscountSettings } from '../types';
import { ShoppingBag, Eye, Check, Tag, Star, Heart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  discount: DiscountSettings;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discount,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const isLongDescription = product.description.length > 85;
  const displayDescription =
    isLongDescription && !isExpanded
      ? `${product.description.slice(0, 85)}...`
      : product.description;

  const hasDiscount = discount.isEnabled && discount.percentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - discount.percentage / 100))
    : product.price;

  // Star rating fallback
  const ratingValue = product.rating || 4.9;
  const reviewsTotal = product.reviewsCount || 38;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-3xl border border-[#EAE2D5] overflow-hidden shadow-xs hover:shadow-md hover:border-[#D5C7B4] transition-all flex flex-col cursor-pointer text-right"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-[#FAF5EE] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Pill */}
        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#34533F] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-[#EBE3D7]">
          {product.category}
        </span>

        {/* Customer Wishlist Button (SHEIN style) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#7A6A5C] shadow-xs flex items-center justify-center transition-transform active:scale-90"
          title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
            }`}
          />
        </button>

        {/* Discount Badge if active */}
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-[#9E4B3E] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 animate-in zoom-in">
            <Tag className="w-3 h-3" />
            <span>خصم {discount.percentage}%</span>
          </span>
        )}

        {/* Quality Authenticity Badge */}
        <span className="absolute bottom-3 left-3 bg-[#241A15]/80 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>أصلي 100%</span>
        </span>
      </div>

      {/* Product Info & Description */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Customer Rating Bar */}
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-[#7A6A5C]">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-[#2A1E17] text-xs">{ratingValue}</span>
            <span className="text-[11px] text-[#8C7A6A]">({reviewsTotal} تقييم)</span>
          </div>

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
          <div className="mt-2 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DD]">
            <span className="text-[11px] font-bold text-[#8C7257] block mb-1">
              مواصفات ومزايا المنتج:
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

        {/* Action Button: Add to Cart & View */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE2] flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer ${
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
