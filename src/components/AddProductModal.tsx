import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES, PRESET_IMAGES } from '../data/categories';
import {
  X,
  Upload,
  ImagePlus,
  Camera,
  Check,
  Sparkles,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt'>, editId?: string) => void;
  productToEdit?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  productToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setImageUrl(productToEdit.imageUrl);
      setDescription(productToEdit.description);
    } else {
      setTitle('');
      setCategory(CATEGORIES[0].name);
      setPrice('');
      setImageUrl('');
      setDescription('');
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setImageUrl(event.target.result);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('يرجى إضافة صورة للمنتج (بالرفع أو اختيار صورة جاهزة).');
      return;
    }
    if (!title.trim()) {
      setError('يرجى كتابة اسم المنتج.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setError('يرجى كتابة سعر صحيح للمنتج بالدينار العراقي.');
      return;
    }
    if (!description.trim()) {
      setError('يرجى إضافة وصف للمنتج ليظهر أسفل صورة المنتج.');
      return;
    }

    onSaveProduct(
      {
        title: title.trim(),
        category,
        price: Number(price),
        imageUrl,
        description: description.trim(),
      },
      productToEdit?.id
    );

    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setImageUrl(preset.url);
    if (!title) setTitle(preset.title);
    if (!description) setDescription(preset.description);
    if (price === '') setPrice(preset.price);
    setCategory(preset.category);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FCFAF6] rounded-3xl border border-[#E8DED1] shadow-2xl p-5 sm:p-7 text-right my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D6] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#34533F]/10 text-[#34533F] flex items-center justify-center">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#283C30]">
                {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <p className="text-xs text-[#8A7969]">
                أضيفي صورة ووصفاً جذاباً للمنتج
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE8DD] hover:bg-[#E2D8C9] text-[#5C4D3E] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* SECTION 1: ADD IMAGE ICON & UPLOAD AREA */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#3E2B1E] mb-2">
              صورة المنتج <span className="text-[#9E4B3E]">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#34533F]/30 bg-white group">
                <img
                  src={imageUrl}
                  alt="معاينة المنتج"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-full bg-white text-[#2C1E18] text-xs font-bold shadow-md hover:bg-[#FAF7F2] transition-colors flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    تغيير الصورة
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? 'border-[#34533F] bg-[#34533F]/5'
                    : 'border-[#DECDBE] hover:border-[#34533F] bg-white hover:bg-[#F8F3EB]'
                }`}
              >
                {/* Prominent Add Image Icon */}
                <div className="w-14 h-14 rounded-full bg-[#F5EDE1] text-[#34533F] flex items-center justify-center shadow-xs">
                  <ImagePlus className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#3E2B1E]">
                    اضغطي هنا لرفع صورة للمنتج
                  </p>
                  <p className="text-xs text-[#8E7E70] mt-0.5">
                    يدعم السحب والإفلات أو التصوير المباشر
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#34533F] bg-[#EBF3ED] px-3 py-1 rounded-full">
                  <Upload className="w-3.5 h-3.5" />
                  اختيار من الهاتف أو الحاسوب
                </span>
              </div>
            )}

            {/* Quick Presets for Convenient Testing */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#8C7A6A] block mb-1.5">
                أو اختاري صورة نموذجية سريعة:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="group relative rounded-xl overflow-hidden border border-[#E5DACB] aspect-square hover:border-[#34533F] transition-all"
                    title={preset.title}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: PRODUCT TITLE & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#3E2B1E] mb-1.5">
                اسم المنتج <span className="text-[#9E4B3E]">*</span>
              </label>
              <input
                id="product-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: زيت الحشيش الهندي"
                className="w-full bg-white text-[#2C1E18] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#3E2B1E] mb-1.5">
                القسم <span className="text-[#9E4B3E]">*</span>
              </label>
              <select
                id="product-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-[#2C1E18] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 3: PRICE */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#3E2B1E] mb-1.5">
              السعر (بالدينار العراقي د.ع) <span className="text-[#9E4B3E]">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="product-price-input"
                type="number"
                min="500"
                step="500"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="مثال: 25000"
                className="w-full bg-white text-[#2C1E18] text-sm rounded-xl py-2.5 pr-3 pl-16 border border-[#DECDBE] focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F]"
              />
              <span className="absolute left-3 text-xs font-bold text-[#7E6E5F] pointer-events-none">
                د.ع
              </span>
            </div>
          </div>

          {/* SECTION 4: PRODUCT DESCRIPTION (مع إمكانية إضافة وصف أسفل المنتج) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[#3E2B1E]">
                وصف المنتج (يظهر أسفل المنتج) <span className="text-[#9E4B3E]">*</span>
              </label>
              <span className="text-[11px] text-[#8E7E70]">
                {description.length} حرف
              </span>
            </div>
            <textarea
              id="product-description-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتبي وصفاً جذاباً ومفصلاً: فوائد المنتج، المكونات الهندية الطبيعية، طريقة الاستخدام للحصول على أفضل نتيجة..."
              className="w-full bg-white text-[#2C1E18] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F] leading-relaxed resize-none"
            />
            <p className="text-[11px] text-[#8C7A6A] mt-1">
              💡 سيظهر هذا الوصف مباشرة أسفل صورة واسم المنتج لتوضيح كافة التفاصيل للمشتري.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              id="submit-product-btn"
              type="submit"
              className="flex-1 py-3 px-5 rounded-full bg-[#34533F] text-white font-bold text-sm sm:text-base hover:bg-[#273F30] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'حفظ التعديلات' : 'حفظ ونشر المنتج'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-full bg-[#EDE3D6] text-[#4A3728] font-bold text-sm hover:bg-[#E2D6C6] transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
