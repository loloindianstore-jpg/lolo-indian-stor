import React, { useState } from 'react';
import { UserAccount, UserRole, Assistant } from '../types';
import { X, Mail, Shield, User, LogIn, LogOut, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  ownerEmail: string;
  assistants: Assistant[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  ownerEmail,
  assistants,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }

    // Determine role based on email
    let role: UserRole = 'customer';
    let displayName = nameInput.trim() || cleanEmail.split('@')[0];

    if (cleanEmail === ownerEmail.toLowerCase()) {
      role = 'owner';
      displayName = 'مالكة المتجر (لولو)';
    } else {
      const matchedAssistant = assistants.find(
        (a) => a.email.toLowerCase() === cleanEmail
      );
      if (matchedAssistant) {
        role = 'assistant';
        displayName = matchedAssistant.name || 'مساعد المتجر';
      }
    }

    onLogin({
      email: cleanEmail,
      role,
      name: displayName,
    });
    setEmailInput('');
    setNameInput('');
    setError('');
    onClose();
  };

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'owner') {
      onLogin({
        email: ownerEmail,
        role: 'owner',
        name: 'مالكة المتجر (لولو)',
      });
    } else if (role === 'assistant') {
      const firstAssistant = assistants[0];
      const assistantEmail = firstAssistant ? firstAssistant.email : 'assistant@lulu-shop.com';
      const assistantName = firstAssistant ? firstAssistant.name : 'مساعد معتمد (سارة)';
      onLogin({
        email: assistantEmail,
        role: 'assistant',
        name: assistantName,
      });
    } else {
      onLogin({
        email: 'customer@gmail.com',
        role: 'customer',
        name: 'عميلة المتجر',
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FCFAF6] rounded-3xl border border-[#E8DED1] shadow-2xl p-5 sm:p-7 text-right my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D6] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#34533F]/10 text-[#34533F] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#283C30]">
                {currentUser ? 'الحساب الحالي' : 'تسجيل الدخول بالبريد'}
              </h3>
              <p className="text-xs text-[#8A7969]">
                التحقق من الصلاحيات وأيقونة إضافة المنتجات
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

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8C7A6A] font-bold">حالة الحساب:</span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    currentUser.role === 'owner'
                      ? 'bg-[#34533F] text-white'
                      : currentUser.role === 'assistant'
                      ? 'bg-[#D97706] text-white'
                      : 'bg-[#EAE0D2] text-[#4A3728]'
                  }`}
                >
                  {currentUser.role === 'owner'
                    ? '👑 حسابي الشخصي (مالكة المتجر)'
                    : currentUser.role === 'assistant'
                    ? '⭐ مساعد معتمد (إضافة منتجات)'
                    : '🛍️ حساب عميل'}
                </span>
              </div>

              <div>
                <p className="text-base font-extrabold text-[#2C1E18]">
                  {currentUser.name}
                </p>
                <p className="text-xs text-[#7A6A5C] font-mono mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <div className="text-xs text-[#5C4D3E] pt-2 border-t border-[#F2EDE5]">
                {currentUser.role === 'owner' && (
                  <p className="text-[#34533F] font-semibold">
                    ✓ تظهر لديكِ أيقونة إضافة المنتجات والتحكم الكامل بالخصومات والمساعدين.
                  </p>
                )}
                {currentUser.role === 'assistant' && (
                  <p className="text-[#B45309] font-semibold">
                    ✓ تظهر لديكِ أيقونة إضافة وتعديل المنتجات كمساعد معتمد للمتجر.
                  </p>
                )}
                {currentUser.role === 'customer' && (
                  <p className="text-[#7A6A5C]">
                    ℹ️ أيقونة إضافة المنتجات مخفية للعملاء لضمان خصوصية المتجر.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          /* Not Logged In - Form */
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-white text-sm rounded-xl py-2.5 pr-3 pl-10 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
                  />
                  <Mail className="w-4 h-4 text-[#8C7A6A] absolute left-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2B1E] mb-1">
                  الاسم (اختياري)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="اسمك أو لقبك"
                  className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#34533F] text-white font-bold text-sm hover:bg-[#284131] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>
            </form>

            {/* Quick Testing Options */}
            <div className="pt-3 border-t border-[#EDE3D6]">
              <span className="text-[11px] font-bold text-[#8C7A6A] block mb-2">
                تجربة سريعة للأدوار والصلاحيات:
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('owner')}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF3EA] hover:bg-[#F2E5D5] text-[#34533F] text-xs font-bold flex items-center justify-between border border-[#E5DACB] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>👑</span>
                    <span>الدخول كمالكة المتجر (حسابي الشخصي)</span>
                  </span>
                  <span className="text-[10px] bg-[#34533F] text-white px-2 py-0.5 rounded-md">
                    تظهر أيقونة الإضافة
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('assistant')}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF3EA] hover:bg-[#F2E5D5] text-[#8C581E] text-xs font-bold flex items-center justify-between border border-[#E5DACB] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⭐</span>
                    <span>الدخول كمساعد معتمد</span>
                  </span>
                  <span className="text-[10px] bg-[#D97706] text-white px-2 py-0.5 rounded-md">
                    يمكنه إضافة منتجات
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer')}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#F8F4EE] text-[#5C4D3E] text-xs font-bold flex items-center justify-between border border-[#E5DACB] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span>🛍️</span>
                    <span>الدخول كعميلة / زائرة</span>
                  </span>
                  <span className="text-[10px] bg-[#EDE3D6] text-[#5C4D3E] px-2 py-0.5 rounded-md">
                    الأيقونة مخفية
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
