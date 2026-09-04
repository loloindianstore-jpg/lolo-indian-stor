import React from 'react';
import { CATEGORIES } from '../data/categories';
import { Sparkles, Leaf, Droplets, Sparkle } from 'lucide-react';

interface CategoriesGridProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // Render authentic category icons similar to the screenshot
  const renderCategoryIcon = (id: string) => {
    switch (id) {
      case 'oils':
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F8F4EE] group-hover:bg-[#F0E8DC] transition-colors">
            {/* Oil bottle graphic representation */}
            <svg
              className="w-8 h-8 text-[#784A28]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="7" y="7" width="10" height="14" rx="2" />
              <path d="M10 7V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
              <path d="M12 12v3" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
          </div>
        );
      case 'henna':
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#EFF6F1] group-hover:bg-[#E3EEE6] transition-colors">
            <svg
              className="w-8 h-8 text-[#305E3C]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
        );
      case 'shampoo':
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F9F5EC] group-hover:bg-[#F2ECE0] transition-colors">
            <svg
              className="w-8 h-8 text-[#B45309]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 8h8a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-9a2 2 0 0 1 2-2Z" />
              <path d="M12 8V4" />
              <path d="M10 4h4" />
              <path d="M9 2h6" />
            </svg>
          </div>
        );
      case 'care':
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FFFBEB] group-hover:bg-[#FEF3C7] transition-colors">
            <Sparkles className="w-7 h-7 text-[#D97706]" />
          </div>
        );
      default:
        return <Sparkle className="w-8 h-8 text-[#784A28]" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#2A1D16] tracking-tight">
          تسوقي حسب القسم
        </h3>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-[#34533F] hover:underline"
          >
            عرض جميع الأقسام
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              id={`category-card-${cat.id}`}
              type="button"
              onClick={() =>
                onSelectCategory(isSelected ? null : cat.name)
              }
              className={`group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 text-center border ${
                isSelected
                  ? 'bg-white border-[#34533F] ring-2 ring-[#34533F]/20 shadow-md transform -translate-y-0.5'
                  : 'bg-white hover:bg-[#FAF6F0] border-[#EAE3D6] shadow-xs'
              }`}
            >
              <div className="mb-3 transition-transform group-hover:scale-105">
                {renderCategoryIcon(cat.id)}
              </div>
              <span
                className={`text-sm sm:text-base font-bold transition-colors ${
                  isSelected ? 'text-[#34533F]' : 'text-[#332319]'
                }`}
              >
                {cat.name}
              </span>
              {isSelected && (
                <span className="mt-1 text-[10px] text-[#34533F] font-bold bg-[#EBF3ED] px-2 py-0.5 rounded-full">
                  محدد
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
