import React, { useState } from 'react';
import { CartItem, DiscountSettings } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Tag,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discount: DiscountSettings;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  discount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('بغداد');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);

  if (!isOpen) return null;

  // Compute prices with discount if active
  const calculateItemPrice = (originalPrice: number) => {
    if (discount.isEnabled && discount.percentage > 0) {
      return Math.round(originalPrice * (1 - discount.percentage / 100));
    }
    return originalPrice;
  };

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountedSubtotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item.product.price) * item.quantity,
    0
  );

  const totalDiscountSavings = rawSubtotal - discountedSubtotal;
  const deliveryFee = cartItems.length > 0 ? 5000 : 0; // 5000 IQD standard delivery
  const total = discountedSubtotal + deliveryFee;

  // Generate shareable cart link
  const getShareableCartUrl = () => {
    try {
      // Serialize essential cart data: id, quantity, and product snapshot
      const payload = cartItems.map((it) => ({
        id: it.product.id,
        title: it.product.title,
        price: it.product.price,
        imageUrl: it.product.imageUrl,
        category: it.product.category,
        description: it.product.description,
        q: it.quantity,
      }));
      const jsonStr = JSON.stringify(payload);
      // Safe base64 encode for UTF-8
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = new URL(window.location.href);
      url.searchParams.set('cart', encoded);
      return url.toString();
    } catch (err) {
      console.error('Error creating cart URL', err);
      return window.location.href;
    }
  };

  const handleCopyShareLink = () => {
    const url = getShareableCartUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const url = getShareableCartUrl();
    const message = encodeURIComponent(
      `مرحباً! لقد اخترت سلة مشتريات من متجر لولو الهندية تحتوي على (${cartItems.length}) منتجات. يمكنكِ الاطلاع عليها وإكمال الطلب عبر هذا الرابط:\n${url}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setOrderSuccess(true);
    setTimeout(() => {
      onClearCart();
      setOrderSuccess(false);
      setIsCheckingOut(false);
      onClose();
    }, 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FCFAF6] h-full shadow-2xl flex flex-col text-right border-l border-[#EAE0D2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFE7DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#34533F]/10 text-[#34533F] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2A1D16]">سلة التسوق</h3>
              <span className="text-xs text-[#8A7969]">
                {cartItems.reduce((acc, it) => acc + it.quantity, 0)} منتج
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowShareBox(!showShareBox)}
                className={`p-2 rounded-full border transition-colors flex items-center gap-1 text-xs font-bold ${
                  showShareBox
                    ? 'bg-[#34533F] text-white border-[#34533F]'
                    : 'bg-[#F3ECE1] text-[#4A3728] border-[#E5DACB] hover:bg-[#EAE0D2]'
                }`}
                title="مشاركة رابط هذه السلة"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden xs:inline">مشاركة السلة</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delivery banner */}
        <div className="bg-[#2E1E17] text-[#F3EBE1] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>🚚 الدفع عند الاستلام متاح لجميع محافظات العراق</span>
          {discount.isEnabled && (
            <span className="bg-[#9E4B3E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              خصم {discount.percentage}%
            </span>
          )}
        </div>

        {/* Shareable Cart Link Box (رابط لكل سلة يمكن مشاركتها) */}
        {showShareBox && cartItems.length > 0 && (
          <div className="bg-[#FAF3EA] p-3.5 border-b border-[#EADFCF] space-y-2.5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#3E2B1E] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#34533F]" />
                <span>رابط السلة للمشاركة المباشرة:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowShareBox(false)}
                className="text-xs text-[#8C7A6A] hover:text-black"
              >
                إغلاق
              </button>
            </div>
            <p className="text-[11px] text-[#6E5E50] leading-relaxed">
              يمكنكِ إرسال هذا الرابط لأي شخص؛ وعند فتحه ستظهر له نفس هذه المنتجات والكميات فوراً في سلته!
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex-1 py-2 px-3 rounded-xl bg-[#34533F] text-white text-xs font-bold hover:bg-[#284131] transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-300" />
                    <span>تم نسخ الرابط!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ رابط السلة</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors flex items-center gap-1"
                title="مشاركة عبر واتساب"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {orderSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF5EE] text-[#257538] flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-[#283C30] mb-2">
                تم استلام طلبكِ بنجاح!
              </h4>
              <p className="text-xs sm:text-sm text-[#6C5B4C] leading-relaxed mb-4">
                شكراً لتسوقكِ من متجر لولو الهندية. سنتواصل معكِ هاتفياً لتأكيد الشحن إلى {city}.
              </p>
              <div className="text-xs font-bold text-[#34533F] bg-[#EBF3ED] px-4 py-2 rounded-xl">
                المجموع: {total.toLocaleString('ar-IQ')} د.ع
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#8C7A6A]">
              <div className="w-16 h-16 rounded-full bg-[#F3EDE3] flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-[#A89481]" />
              </div>
              <p className="text-base font-bold text-[#3E2B1E] mb-1">
                سلة التسوق فارغة
              </p>
              <p className="text-xs text-[#8C7A6A] max-w-xs mb-5">
                تصفحي الأقسام وأضيفي منتجاتكِ الهندية المفضلة للعناية بالشعر والبشرة.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-full bg-[#34533F] text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-[#284131]"
              >
                تصفح المتجر
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleCompleteOrder} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#EFE7DC]">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-[#34533F] font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>العودة للسلة</span>
                </button>
              </div>

              <h4 className="text-base font-extrabold text-[#2C1E18]">
                بيانات التوصيل (العراق)
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: زينب علي"
                  className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1">
                  رقم الهاتف (للتوصيل) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0770xxxxxxx"
                  className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1">
                  المحافظة
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
                >
                  <option value="بغداد">بغداد</option>
                  <option value="البصرة">البصرة</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف الأشرف">النجف الأشرف</option>
                  <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                  <option value="نينوى (الموصل)">نينوى (الموصل)</option>
                  <option value="السليمانية">السليمانية</option>
                  <option value="بابل (الحلة)">بابل (الحلة)</option>
                  <option value="محافظة أخرى">محافظة أخرى</option>
                </select>
              </div>

              <div className="bg-[#F6EFE6] p-3.5 rounded-xl border border-[#E9DAC8] text-xs space-y-1.5 text-[#5C4B3D]">
                <div className="flex justify-between font-medium">
                  <span>سعر المنتجات:</span>
                  <span>{rawSubtotal.toLocaleString('ar-IQ')} د.ع</span>
                </div>

                {discount.isEnabled && totalDiscountSavings > 0 && (
                  <div className="flex justify-between font-bold text-[#9E4B3E]">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>خصم العرض ({discount.percentage}%):</span>
                    </span>
                    <span>-{totalDiscountSavings.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                )}

                <div className="flex justify-between font-medium">
                  <span>أجور التوصيل:</span>
                  <span>{deliveryFee.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#2A1D16] pt-2 border-t border-[#E3D3BF]">
                  <span>الإجمالي عند الاستلام:</span>
                  <span>{total.toLocaleString('ar-IQ')} د.ع</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#34533F] text-white font-bold text-sm hover:bg-[#284131] transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>تأكيد الطلب والدفع عند الاستلام</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const itemEffectivePrice = calculateItemPrice(item.product.price);
                const itemTotal = itemEffectivePrice * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="p-3 bg-white rounded-2xl border border-[#EFE7DC] shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#FAF6F0]"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-[#2A1D16] truncate">
                        {item.product.title}
                      </h5>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-black text-[#7A4E2B]">
                          {itemTotal.toLocaleString('ar-IQ')} د.ع
                        </span>
                        {discount.isEnabled && (
                          <span className="text-[10px] text-[#A89887] line-through">
                            {(item.product.price * item.quantity).toLocaleString('ar-IQ')} د.ع
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#E2D6C6] rounded-full bg-[#FAF7F2] p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5C4D3E]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 text-[#2A1D16]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#5C4D3E]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions when cart has items and not in checkout mode */}
        {!orderSuccess && cartItems.length > 0 && !isCheckingOut && (
          <div className="p-4 sm:p-5 border-t border-[#EFE7DC] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#5C4B3D]">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold">
                  {rawSubtotal.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>

              {discount.isEnabled && totalDiscountSavings > 0 && (
                <div className="flex justify-between font-bold text-[#9E4B3E]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>خصم العرض ({discount.percentage}%):</span>
                  </span>
                  <span>-{totalDiscountSavings.toLocaleString('ar-IQ')} د.ع</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>التوصيل (لكافة المحافظات):</span>
                <span className="font-bold">
                  {deliveryFee.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-[#2A1D16] pt-1.5 border-t border-[#F2ECE2]">
                <span>المجموع النهائي:</span>
                <span className="text-[#7A4E2B] text-base">
                  {total.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="proceed-checkout-btn"
                type="button"
                onClick={() => setIsCheckingOut(true)}
                className="flex-1 py-3 px-5 rounded-full bg-[#34533F] text-white font-bold text-sm sm:text-base hover:bg-[#284131] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>متابعة إتمام الطلب</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="py-3 px-3.5 rounded-full bg-[#F3ECE1] hover:bg-[#EAE0D2] text-[#4A3728] font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
                title="نسخ رابط هذه السلة"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-[#34533F]" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
