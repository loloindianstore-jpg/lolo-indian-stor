import React from 'react';
import { Product, DiscountSettings } from '../types';
import { ProductCard } from './ProductCard';
import { ImagePlus, Sparkles, Plus, Layers, Package } from 'lucide-react';
import { PRESET_IMAGES } from '../data/categories';

interface ProductSectionProps {
  products: Product[];
  selectedCategory: string | null;
  searchQuery: string;
  discount: DiscountSettings;
  canAddProducts: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewDetails: (product: Product) => void;
  onOpenAddModal: () => void;
  onAddSampleProduct: (preset: typeof PRESET_IMAGES[0]) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  selectedCategory,
  searchQuery,
  discount,
  canAddProducts,
  onAddToCart,
  onEdit,
  onDelete,
  onViewDetails,
  onOpenAddModal,
  onAddSampleProduct,
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
            <span>المنتجات المعروضة</span>
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

        {/* Add product button ONLY for Owner and Appointed Assistants */}
        {products.length > 0 && canAddProducts && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#34533F] text-white text-xs sm:text-sm font-bold hover:bg-[#284131] transition-all shadow-xs"
          >
            <ImagePlus className="w-4 h-4" />
            <span>إضافة منتج آخر</span>
          </button>
        )}
      </div>

      {/* Case 1: No products added at all */}
      {products.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#DFCFC0] bg-white/70 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#F5EDE1] text-[#7A4E2B] flex items-center justify-center mb-4 shadow-xs">
            {canAddProducts ? (
              <ImagePlus className="w-10 h-10" />
            ) : (
              <Package className="w-10 h-10" />
            )}
          </div>

          <h4 className="text-lg sm:text-xl font-extrabold text-[#2C1E18] mb-2">
            {canAddProducts
              ? 'لا توجد منتجات معروضة حالياً'
              : 'مرحباً بكِ في متجر لولو الهندية'}
          </h4>

          <p className="text-sm text-[#736353] max-w-md leading-relaxed mb-6">
            {canAddProducts
              ? 'المتجر خالٍ وجاهز لإضافة منتجاتكِ. استخدمي أيقونة إضافة صورة ووصف المنتج لإضافة المنتجات فوراً.'
              : 'جاري تجهيز وتحديث تشكيلة المنتجات الهندية الأصلية للعناية بالشعر والبشرة. تابعونا قريباً!'}
          </p>

          {canAddProducts && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                id="empty-state-add-btn"
                type="button"
                onClick={onOpenAddModal}
                className="py-3 px-6 rounded-full bg-[#34533F] text-white font-bold text-sm sm:text-base hover:bg-[#284131] transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <ImagePlus className="w-5 h-5" />
                <span>إضافة صورة ووصف منتج جديد</span>
              </button>

              <button
                type="button"
                onClick={() => onAddSampleProduct(PRESET_IMAGES[0])}
                className="py-3 px-5 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                title="إضافة نموذج هندي تلقائي للتجربة"
              >
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>تجربة إضافة نموذج فوري</span>
              </button>
            </div>
          )}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Case 2: Filter/Search with no results */
        <div className="rounded-3xl border border-[#EAE2D5] bg-white p-8 text-center">
          <Layers className="w-12 h-12 text-[#9A8674] mx-auto mb-3" />
          <h4 className="text-base sm:text-lg font-bold text-[#2C1E18] mb-1">
            لم نجد منتجات مطابقة للبحث
          </h4>
          <p className="text-xs sm:text-sm text-[#736353] mb-4">
            جربي البحث بكلمات أخرى أو إلغاء تصفية القسم.
          </p>
          {canAddProducts && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="py-2.5 px-5 rounded-full bg-[#34533F] text-white text-xs sm:text-sm font-bold"
            >
              إضافة منتج جديد لهذا القسم
            </button>
          )}
        </div>
      ) : (
        /* Case 3: Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              discount={discount}
              canManage={canAddProducts}
              onAddToCart={onAddToCart}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
