import React from 'react';
import { UserAccount } from '../types';
import {
  X,
  Mail,
  User,
  LogOut,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  Lock,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenAdminDashboard?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenAdminDashboard,
}) => {
  if (!isOpen || !currentUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FCFAF6] rounded-3xl border border-[#E8DED1] shadow-2xl p-5 sm:p-6 text-right my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D6] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#34533F]/10 text-[#34533F] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#283C30]">
                حسابكِ في متجر لولو
              </h3>
              <p className="text-xs text-[#8A7969]">
                جلسة تسجيل الدخول المحفوظة
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

        {/* User Information Card */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFC0] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C7A6A] font-bold">نوع الحساب:</span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full ${
                  currentUser.role === 'owner'
                    ? 'bg-[#7A4E2B] text-white'
                    : currentUser.role === 'assistant'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#34533F] text-white'
                }`}
              >
                {currentUser.role === 'owner'
                  ? '👑 مالكة المتجر المعتمدة'
                  : currentUser.role === 'assistant'
                  ? '⭐ مساعدة معتمدة'
                  : '🛍️ زبونة متجر لولو'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-full bg-[#7A4E2B]/15 text-[#7A4E2B] flex items-center justify-center font-black text-lg border border-[#7A4E2B]/30 shrink-0">
                {currentUser.name ? currentUser.name.charAt(0) : 'ل'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-base font-extrabold text-[#2C1E18] truncate">
                  {currentUser.name || 'زبونة المتجر'}
                </p>
                <p className="text-xs text-[#7A6A5C] font-mono truncate" dir="ltr">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Extra details (Provider, Phone, City) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F2EDE5] text-xs">
              <div className="bg-[#FAF7F2] p-2 rounded-xl">
                <span className="text-[10px] text-[#8C7A6A] block">طريقة التسجيل:</span>
                <span className="font-bold text-[#4A3728]">
                  {currentUser.provider === 'google'
                    ? 'Google Account'
                    : currentUser.provider === 'phone'
                    ? 'هاتف / واتساب'
                    : currentUser.provider === 'demo'
                    ? 'حساب تجريبي'
                    : 'بريد وكلمة مرور'}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-2 rounded-xl">
                <span className="text-[10px] text-[#8C7A6A] block">المحافظة:</span>
                <span className="font-bold text-[#4A3728] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7A4E2B]" />
                  <span>{currentUser.city || 'العراق'}</span>
                </span>
              </div>
            </div>

            {currentUser.phone && (
              <div className="text-xs bg-[#FAF7F2] p-2 rounded-xl flex items-center justify-between">
                <span className="text-[#8C7A6A]">رقم الهاتف:</span>
                <span className="font-mono font-bold text-[#34533F]" dir="ltr">
                  {currentUser.phone}
                </span>
              </div>
            )}
          </div>

          {/* Quick link to admin dashboard if owner */}
          {currentUser.role === 'owner' && onOpenAdminDashboard && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminDashboard();
              }}
              className="w-full py-2.5 rounded-xl bg-[#7A4E2B] text-white hover:bg-[#633E20] font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>فتح لوحة تحكم الإدارة (Admin Dashboard)</span>
            </button>
          )}

          {/* Session Persistence info badge */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              جلستكِ محفوظة محلياً (LocalStorage) ولن يطلب منكِ إعادة الدخول عند فتح الرابط مجدداً إلا إذا ضغطتِ تسجيل الخروج.
            </span>
          </div>

          {/* Logout & Lock Button */}
          <button
            id="auth-modal-logout-btn"
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج وقفل المتجر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
