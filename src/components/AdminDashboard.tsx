import React, { useState } from 'react';
import {
  Product,
  DiscountSettings,
  Assistant,
  Order,
  UserAccount,
} from '../types';
import { PRESET_IMAGES } from '../data/categories';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Tag,
  Percent,
  Users,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Sparkles,
  Search,
  MessageCircle,
  CheckCircle2,
  Clock,
  Settings,
  KeyRound,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  discount: DiscountSettings;
  assistants: Assistant[];
  orders: Order[];
  currentUser: UserAccount | null;
  onUpdateDiscount: (newSettings: DiscountSettings) => void;
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddSampleProduct: (preset: typeof PRESET_IMAGES[0]) => void;
  onAddAssistant: (email: string, name: string, canAdd: boolean) => void;
  onRemoveAssistant: (id: string) => void;
  onToggleAssistantPermission: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  discount,
  assistants,
  orders,
  currentUser,
  onUpdateDiscount,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddSampleProduct,
  onAddAssistant,
  onRemoveAssistant,
  onToggleAssistantPermission,
  onUpdateOrderStatus,
  onExitAdmin,
  onLogoutAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'discounts' | 'orders' | 'assistants' | 'security'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Discount form state
  const [discountPercent, setDiscountPercent] = useState(discount.percentage);
  const [discountTitle, setDiscountTitle] = useState(discount.title);
  const [discountSavedToast, setDiscountSavedToast] = useState(false);

  // Assistant form state
  const [assistantEmail, setAssistantEmail] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [assistantError, setAssistantError] = useState('');
  const [assistantSuccess, setAssistantSuccess] = useState('');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDiscount({
      ...discount,
      percentage: Number(discountPercent) || 10,
      title: discountTitle.trim() || `عروض خاصة بخصم ${discountPercent}%`,
    });
    setDiscountSavedToast(true);
    setTimeout(() => setDiscountSavedToast(false), 3000);
  };

  const handleToggleDiscountStatus = () => {
    onUpdateDiscount({
      ...discount,
      isEnabled: !discount.isEnabled,
    });
  };

  const handleCreateAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    setAssistantError('');
    setAssistantSuccess('');

    const cleanEmail = assistantEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAssistantError('يرجى كتابة بريد إلكتروني صالح.');
      return;
    }

    if (assistants.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setAssistantError('هذا البريد مضاف مسبقاً في قائمة المساعدين.');
      return;
    }

    onAddAssistant(cleanEmail, assistantName.trim() || 'مساعد المتجر', true);
    setAssistantEmail('');
    setAssistantName('');
    setAssistantSuccess('تم تعيين المساعد بنجاح! سيتمكن من تسجيل الدخول للوحة التحكم.');
    setTimeout(() => setAssistantSuccess(''), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 4) {
      setPasswordError('كلمة المرور يجب أن تكون 4 أحرف أو أرقام على الأقل.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور غير متطابقة في الخانتين.');
      return;
    }

    localStorage.setItem('lulu_admin_password', newPassword);
    setPasswordSuccess('تم تحديث كلمة مرور لوحة التحكم بنجاح!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#2C1E18] flex flex-col font-['Tajawal',sans-serif]">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#1E2D24] text-white shadow-md border-b border-[#2D4235] px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#34533F] border border-[#486E56] flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-1.5">
                  <span>لوحة تحكم مالكة المتجر</span>
                  <span className="text-xs bg-emerald-700/80 text-emerald-100 font-bold px-2 py-0.5 rounded-md">
                    محمية ومؤمنة
                  </span>
                </h1>
              </div>
              <p className="text-xs text-emerald-200/80">
                متجر لولو الهندية • إدارة المنتجات، الأسعار، العروض والطلبات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Public Storefront Button */}
            <button
              id="admin-view-store-btn"
              type="button"
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/10"
              title="معاينة المتجر كما يراه الزبائن"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">معاينة المتجر العام</span>
            </button>

            {/* Logout Admin Button */}
            <button
              id="admin-logout-btn"
              type="button"
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 text-xs sm:text-sm font-bold transition-all border border-rose-700/40"
              title="تسجيل الخروج من لوحة التحكم"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-3xl border border-[#E8DFC0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A6A5C] font-bold block">إجمالي المنتجات</span>
              <span className="text-2xl font-black text-[#283C30]">{products.length}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#EBF5EE] text-[#34533F] flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8DFC0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A6A5C] font-bold block">طلبات الزبائن</span>
              <span className="text-2xl font-black text-[#7A4E2B]">{orders.length}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#7A4E2B] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8DFC0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A6A5C] font-bold block">حالة الخصومات</span>
              <span className={`text-sm font-black px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                discount.isEnabled ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {discount.isEnabled ? `خصم ${discount.percentage}% فعّال` : 'معطلة'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2] text-red-600 flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8DFC0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A6A5C] font-bold block">المساعدين المصرح لهم</span>
              <span className="text-2xl font-black text-[#D97706]">{assistants.length}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E8DFC0]">
          <button
            id="tab-products"
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-[#34533F] text-white shadow-sm'
                : 'bg-white text-[#5C4D3E] hover:bg-[#F3EBE0] border border-[#EAE0D2]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والمخزون ({products.length})</span>
          </button>

          <button
            id="tab-discounts"
            type="button"
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'discounts'
                ? 'bg-[#34533F] text-white shadow-sm'
                : 'bg-white text-[#5C4D3E] hover:bg-[#F3EBE0] border border-[#EAE0D2]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>العروض والخصومات</span>
          </button>

          <button
            id="tab-orders"
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-[#34533F] text-white shadow-sm'
                : 'bg-white text-[#5C4D3E] hover:bg-[#F3EBE0] border border-[#EAE0D2]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>طلبات الزبائن ({orders.length})</span>
          </button>

          <button
            id="tab-assistants"
            type="button"
            onClick={() => setActiveTab('assistants')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'assistants'
                ? 'bg-[#34533F] text-white shadow-sm'
                : 'bg-white text-[#5C4D3E] hover:bg-[#F3EBE0] border border-[#EAE0D2]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>المساعدين ({assistants.length})</span>
          </button>

          <button
            id="tab-security"
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-[#34533F] text-white shadow-sm'
                : 'bg-white text-[#5C4D3E] hover:bg-[#F3EBE0] border border-[#EAE0D2]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>أمان وكلمة المرور</span>
          </button>
        </div>

        {/* ================= TAB 1: PRODUCTS MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Action Bar with ADD PRODUCT BUTTON (EXCLUSIVE TO ADMIN) */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFC0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#283C30] flex items-center gap-2">
                  <span>إدارة منتجات المتجر</span>
                  <span className="text-xs bg-[#EBF5EE] text-[#34533F] font-bold px-2.5 py-0.5 rounded-full">
                    {filteredProducts.length} منتج
                  </span>
                </h3>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  أضيفي وعدّلي المنتجات والصور والأسعار بالدينار العراقي
                </p>
              </div>

              {/* PRIMARY ADD PRODUCT BUTTON */}
              <button
                id="admin-add-product-main-btn"
                type="button"
                onClick={onOpenAddProduct}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#34533F] text-white font-extrabold text-sm sm:text-base hover:bg-[#284131] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة منتج جديد مع صورة ووصف</span>
              </button>
            </div>

            {/* Filter and Search Bar inside Admin */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="البحث في المنتجات بالاسم أو القسم أو الوصف..."
                  className="w-full bg-white text-sm rounded-2xl py-2.5 pr-10 pl-4 border border-[#E5DACB] text-right focus:outline-none focus:border-[#34533F]"
                />
                <Search className="w-4 h-4 text-[#8C7A6A] absolute right-3.5 top-3.5 pointer-events-none" />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full sm:w-48 bg-white text-sm rounded-2xl py-2.5 px-3 border border-[#E5DACB] text-right font-medium focus:outline-none focus:border-[#34533F]"
              >
                <option value="all">جميع الأقسام</option>
                <option value="زيوت الشعر">زيوت الشعر</option>
                <option value="الحنة">الحنة</option>
                <option value="شامبو">شامبو</option>
                <option value="العناية">العناية</option>
              </select>
            </div>

            {/* Products List / Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-[#DFCFC0] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#F5EDE1] text-[#34533F] flex items-center justify-center mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#2C1E18] mb-1">
                  لا توجد أي منتجات مضافة حالياً
                </h4>
                <p className="text-xs sm:text-sm text-[#736353] max-w-md mb-5 leading-relaxed">
                  ابدئي بإضافة أول منتج هندي أصلي لمتجرك مع صورته وسعره ووصفه، أو أضيفي نماذج جاهزة فورياً للتجربة.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenAddProduct}
                    className="py-3 px-6 rounded-full bg-[#34533F] text-white font-bold text-sm hover:bg-[#284131] flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منتج جديد الآن</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddSampleProduct(PRESET_IMAGES[0])}
                    className="py-3 px-5 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] font-bold text-xs sm:text-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#D97706]" />
                    <span>إضافة نموذج هندي جاهز</span>
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8DFC0] p-8 text-center text-xs text-[#7A6A5C]">
                لم يتم العثور على منتجات مطابقة للبحث أو التصفية.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-16/10 bg-[#FAF5EE] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#34533F] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between text-right">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-base font-extrabold text-[#2A1E17] leading-tight">
                            {product.title}
                          </h4>
                          <span className="text-sm font-black text-[#7A4E2B] whitespace-nowrap">
                            {product.price.toLocaleString('ar-IQ')} د.ع
                          </span>
                        </div>

                        <p className="text-xs text-[#6C5B4C] line-clamp-2 leading-relaxed mb-3">
                          {product.description}
                        </p>
                      </div>

                      {/* Admin Product Actions (EDIT & DELETE) */}
                      <div className="pt-3 border-t border-[#F2EDE5] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#F5ECE1] hover:bg-[#EAE0D2] text-[#4A3728] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          title="تعديل بيانات المنتج"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#34533F]" />
                          <span>تعديل المنتج</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنتِ متأكدة من حذف المنتج (${product.title}) نهائياً؟`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: OFFERS & DISCOUNTS ================= */}
        {activeTab === 'discounts' && (
          <div className="bg-white rounded-3xl border border-[#E8DFC0] p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-[#F0EAE0] pb-4">
              <h3 className="text-lg font-black text-[#283C30] flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#9E4B3E]" />
                <span>التحكم بخصومات وعروض المتجر العامة</span>
              </h3>
              <p className="text-xs text-[#8A7969] mt-1">
                يمكنكِ تفعيل أو إلغاء الخصم بنقرة واحدة وتحديد نسبة التخفيض التي تظهر للزبائن
              </p>
            </div>

            {/* Toggle Status Card */}
            <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#E8DFC0] flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#3E2B1E] block">
                  مفتاح الخصومات العام:
                </span>
                <span className="text-xs text-[#7A6A5C]">
                  {discount.isEnabled
                    ? `مفعّل حالياً بخصم ${discount.percentage}% على كامل سلة التسوق`
                    : 'معطل حالياً - المنتجات تباع بالسعر الأصلي'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleDiscountStatus}
                className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  discount.isEnabled ? 'bg-[#9E4B3E]' : 'bg-[#D6C7B6]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    discount.isEnabled ? '-translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {discountSavedToast && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ وتحديث إعدادات العرض بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveDiscount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
                    نسبة الخصم المئوية (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] text-right font-bold focus:outline-none focus:border-[#34533F]"
                    />
                    {[10, 15, 20, 25].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setDiscountPercent(p)}
                        className={`text-xs px-3 py-2 rounded-xl border font-bold ${
                          discountPercent === p
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
                  <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
                    عنوان شريط العرض الترويجي للزبائن
                  </label>
                  <input
                    type="text"
                    value={discountTitle}
                    onChange={(e) => setDiscountTitle(e.target.value)}
                    placeholder="مثال: عروض وخصومات حصرية لفترة محدودة ✨"
                    className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-[#34533F] text-white font-bold text-sm hover:bg-[#284131] transition-all flex items-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات وتطبيقها</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 3: CUSTOMER ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC0] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#283C30]">
                  طلبات الشراء الواردة من الزبائن
                </h3>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  متابعة الطلبات المكتملة عبر السلة والتواصل مع العملاء للتوصيل في العراق
                </p>
              </div>
              <span className="text-xs bg-[#FAF0E6] text-[#7A4E2B] font-extrabold px-3 py-1 rounded-full">
                {orders.length} طلب
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8DFC0] p-8 sm:p-12 text-center text-xs text-[#7A6A5C]">
                <ShoppingBag className="w-10 h-10 text-[#C4B3A2] mx-auto mb-3" />
                <p className="text-sm font-bold text-[#3E2B1E] mb-1">
                  لا توجد طلبات واردة بعد
                </p>
                <p>بمجرد أن تقوم أي زبونة بإتمام الطلب من السلة، ستظهر تفاصيلها وعنوانها هنا مباشرة.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-3xl border border-[#E8DFC0] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EDE5] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-[#283C30]">
                            {order.customerName}
                          </span>
                          <span className="text-xs font-bold text-[#7A6A5C] bg-[#FAF5EE] px-2.5 py-0.5 rounded-full">
                            📍 {order.city}
                          </span>
                        </div>
                        <span className="text-xs text-[#8A7969] block mt-0.5">
                          رقم الهاتف: <code className="font-mono text-[#34533F] font-bold" dir="ltr">{order.customerPhone}</code>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className={`text-xs font-bold py-1.5 px-3 rounded-full border ${
                            order.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'delivered'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="new">طلب جديد</option>
                          <option value="confirmed">تم التأكيد هاتفياً</option>
                          <option value="delivered">تم التوصيل للزبونة</option>
                        </select>

                        {/* Direct WhatsApp connect */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `مرحباً ${order.customerName}، نتواصل معكِ من متجر لولو الهندية بخصوص طلبكِ بقيمة ${order.total.toLocaleString(
                              'ar-IQ'
                            )} د.ع للتوصيل إلى ${order.city}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-3 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#1EBE5D] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>

                    {/* Ordered Items summary */}
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl space-y-2 text-xs">
                      <span className="font-bold text-[#6C5B4C] block">المنتجات المطلوبة:</span>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[#3E2B1E]">
                            <span>
                              {it.quantity} × {it.product.title} ({it.product.category})
                            </span>
                            <span className="font-bold">
                              {(it.product.price * it.quantity).toLocaleString('ar-IQ')} د.ع
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#EDE3D6] flex justify-between font-black text-sm text-[#283C30]">
                        <span>المجموع مع التوصيل:</span>
                        <span className="text-[#7A4E2B]">{order.total.toLocaleString('ar-IQ')} د.ع</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: ASSISTANTS ================= */}
        {activeTab === 'assistants' && (
          <div className="bg-white rounded-3xl border border-[#E8DFC0] p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-[#F0EAE0] pb-4">
              <h3 className="text-lg font-black text-[#283C30] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D97706]" />
                <span>تعيين وإدارة المساعدين لإضافة المنتجات</span>
              </h3>
              <p className="text-xs text-[#8A7969] mt-1">
                يمكنكِ إضافة بريد المساعدين لمنحهم صلاحية الدخول للوحة التحكم وإضافة أو تعديل المنتجات
              </p>
            </div>

            {assistantError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold">
                {assistantError}
              </div>
            )}

            {assistantSuccess && (
              <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{assistantSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAssistant} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFC0] space-y-3">
              <h4 className="text-xs font-bold text-[#3E2B1E]">إضافة مساعد جديد:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={assistantEmail}
                  onChange={(e) => setAssistantEmail(e.target.value)}
                  placeholder="بريد المساعد (name@example.com)"
                  dir="ltr"
                  className="w-full bg-white text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
                />
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="اسم المساعد (مثال: سارة)"
                  className="w-full bg-white text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-full bg-[#34533F] text-white text-xs sm:text-sm font-bold hover:bg-[#284131] transition-all"
              >
                إضافة المساعد وتفعيل الصلاحية
              </button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-[#7A6A5C] uppercase">
                قائمة المساعدين الحاليين ({assistants.length}):
              </h4>
              {assistants.length === 0 ? (
                <p className="text-xs text-[#8C7A6A]">لا يوجد مساعدون معينون حالياً.</p>
              ) : (
                assistants.map((ast) => (
                  <div
                    key={ast.id}
                    className="p-3 rounded-2xl border border-[#EAE0D2] flex items-center justify-between gap-3 bg-[#FCFAF6]"
                  >
                    <div>
                      <span className="text-sm font-bold text-[#2C1E18] block">{ast.name}</span>
                      <span className="text-xs text-[#7A6A5C] font-mono" dir="ltr">{ast.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleAssistantPermission(ast.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          ast.canAddProducts
                            ? 'bg-green-100 text-green-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {ast.canAddProducts ? '✓ مصرح له' : 'معطل'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveAssistant(ast.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="إزالة المساعد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SECURITY ================= */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-[#E8DFC0] p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="border-b border-[#F0EAE0] pb-4">
              <h3 className="text-lg font-black text-[#283C30] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#34533F]" />
                <span>أمان لوحة التحكم وكلمة المرور</span>
              </h3>
              <p className="text-xs text-[#8A7969] mt-1">
                حماية لوحة الإدارة بكلمة مرور خاصة لمنع أي زائر من الدخول إليها
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخلي كلمة مرور جديدة"
                  dir="ltr"
                  className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعيدي كتابة كلمة المرور"
                  dir="ltr"
                  className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-[#34533F] text-white text-xs sm:text-sm font-bold hover:bg-[#284131] transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>تحديث كلمة المرور</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
