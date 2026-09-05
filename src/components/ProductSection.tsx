import React from 'react';
import { Product, DiscountSettings } from '../types';
import { ProductCard } from './ProductCard';
import { Package, Sparkles } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  discount: DiscountSettings;
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  selectedCategory,
  searchQuery,
  discount,
  wishlistIds,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}) => {
  // Filter products based on search and category
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products-section" className="w-full mt-6 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#2A1D16] tracking-tight flex items-center gap-2">
            <span>تشكيلة المنتجات الهندية</span>
            {products.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAE2D5] text-[#5C4D3E]">
                {filteredProducts.length}
              </span>
            )}
          </h3>
          {selectedCategory && (
            <p className="text-xs text-[#7A6453] mt-0.5">
              تصفية حسب: <span className="font-bold">{selectedCategory}</span>
            </p>
          )}
        </div>
      </div>

      {/* Case 1: No products in the store yet */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-[#DFCFC0] bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#F5EDE1] text-[#7A4E2B] flex items-center justify-center mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-extrabold text-[#2C1E18] mb-1">
            جاري تحضير التشكيلة الهندية الجديدة
          </h4>
          <p className="text-xs sm:text-sm text-[#736353] max-w-sm leading-relaxed">
            نقوم حالياً بفحص وتجهيز دفعات جديدة من زيوت الشعر وحنة الأعشاب الطبيعية المستوردة مباشرة من الهند.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Case 2: Filter/Search with no results */
        <div className="rounded-3xl border border-[#EAE2D5] bg-white p-8 text-center">
          <Package className="w-10 h-10 text-[#9A8674] mx-auto mb-2" />
          <h4 className="text-base font-bold text-[#2C1E18] mb-1">
            لم نجد منتجات مطابقة لطلبكِ
          </h4>
          <p className="text-xs text-[#736353]">
            جربي البحث باسم آخر أو إزالة التصفية لمشاهدة جميع منتجات العناية.
          </p>
        </div>
      ) : (
        /* Case 3: Public Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              discount={discount}
              isWishlisted={wishlistIds.includes(prod.id)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
