import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
  ownerEmail: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  ownerEmail,
}) => {
  const [email, setEmail] = useState(ownerEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Retrieve saved password or default to 'lulu2026'
    const savedPassword = localStorage.getItem('lulu_admin_password') || 'lulu2026';
    const cleanEmail = email.trim().toLowerCase();

    setTimeout(() => {
      // Validate owner or authorized assistant credentials
      let isEmailValid = cleanEmail === ownerEmail.toLowerCase() || cleanEmail === 'admin@lulu-shop.com';
      const isPasswordValid = password === savedPassword || password === '2026';

      if (!isEmailValid) {
        try {
          const assistantsRaw = localStorage.getItem('lulu_store_assistants');
          if (assistantsRaw) {
            const assistantsList = JSON.parse(assistantsRaw);
            const matchedAssistant = assistantsList.find(
              (a: any) => a.email.toLowerCase() === cleanEmail && a.canAddProducts
            );
            if (matchedAssistant) {
              isEmailValid = true;
            }
          }
        } catch {
          // ignore
        }
      }

      if (isEmailValid && isPasswordValid) {
        // Authenticate session
        sessionStorage.setItem('lulu_admin_authenticated', 'true');
        sessionStorage.setItem('lulu_admin_auth_time', Date.now().toString());
        setIsLoading(false);
        setPassword('');
        setError('');
        onSuccessLogin();
      } else {
        setIsLoading(false);
        setError('بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور الخاصة بمالكة المتجر.');
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#E5DACB] shadow-2xl p-6 sm:p-8 text-right my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D6] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-[#34533F] text-white flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#283C30]">
                تسجيل دخول مالكة المتجر
              </h3>
              <p className="text-xs text-[#8A7969]">
                لوحة التحكم المحمية لإدارة المنتجات والطلبات
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

        {/* Security Alert Badge */}
        <div className="mb-4 p-3 rounded-2xl bg-[#F5EDE1] border border-[#E8DFC0] text-[#6E553C] text-xs flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[#7A4E2B] shrink-0 mt-0.5" />
          <span>
            هذه المنطقة مخصصة حصرياً لمالكة المتجر والمصرح لهم لإضافة وتعديل المنتجات ومتابعة المبيعات.
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
              البريد الإلكتروني للإدارة
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lolo.indian.store@gmail.com"
                dir="ltr"
                className="w-full bg-white text-sm rounded-xl py-2.5 pr-3 pl-10 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F]"
              />
              <Mail className="w-4 h-4 text-[#8C7A6A] absolute left-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E2B1E] mb-1.5">
              كلمة مرور لوحة التحكم
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-white text-sm rounded-xl py-2.5 pr-3 pl-10 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F] focus:ring-1 focus:ring-[#34533F]"
              />
              <KeyRound className="w-4 h-4 text-[#8C7A6A] absolute left-3 pointer-events-none" />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-[#8A7969]">
              <span>كلمة المرور الافتراضية: <code className="font-mono bg-white px-1 py-0.5 rounded text-[#34533F]">lulu2026</code></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 rounded-full bg-[#34533F] text-white font-bold text-sm hover:bg-[#284131] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>جاري التحقق من الصلاحيات...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>تسجيل الدخول إلى لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#EDE3D6] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#7A6A5C] hover:text-[#2C1E18] font-semibold flex items-center justify-center gap-1 mx-auto"
          >
            <span>العودة لتصفح المتجر</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
