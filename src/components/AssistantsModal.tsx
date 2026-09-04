import React, { useState } from 'react';
import { Assistant } from '../types';
import { X, UserPlus, Trash2, CheckCircle, ShieldCheck, Mail } from 'lucide-react';

interface AssistantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistants: Assistant[];
  onAddAssistant: (email: string, name: string, canAddProducts: boolean) => void;
  onRemoveAssistant: (id: string) => void;
  onTogglePermission: (id: string) => void;
}

export const AssistantsModal: React.FC<AssistantsModalProps> = ({
  isOpen,
  onClose,
  assistants,
  onAddAssistant,
  onRemoveAssistant,
  onTogglePermission,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [canAddProducts, setCanAddProducts] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح للمساعد.');
      return;
    }

    if (assistants.some((a) => a.email.toLowerCase() === cleanEmail)) {
      setError('هذا البريد مضاف بالفعل كمساعد.');
      return;
    }

    onAddAssistant(cleanEmail, name.trim() || 'مساعد المتجر', canAddProducts);
    setEmail('');
    setName('');
    setError('');
    setSuccessMsg('تم تعيين المساعد بنجاح! بمجرد تسجيل دخوله بهذا الإيميل ستظهر له أيقونة إضافة المنتجات.');
    setTimeout(() => setSuccessMsg(''), 4000);
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
            <div className="w-10 h-10 rounded-2xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#283C30]">
                تعيين وإدارة المساعدين
              </h3>
              <p className="text-xs text-[#8A7969]">
                المساعدون المعينون تظهر لديهم أيقونة إضافة وتعديل المنتجات
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
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add Assistant Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-[#E8DFC0] space-y-3 mb-6">
          <h4 className="text-sm font-bold text-[#3E2B1E] flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[#34533F]" />
            <span>تعيين مساعد جديد</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                بريد المساعد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="assistant@gmail.com"
                dir="ltr"
                className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2 px-3 border border-[#DECDBE] text-right focus:outline-none focus:border-[#34533F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4D3E] mb-1">
                اسم المساعد
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سارة أحمد"
                className="w-full bg-[#FAF7F2] text-sm rounded-xl py-2 px-3 border border-[#DECDBE] focus:outline-none focus:border-[#34533F]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="can-add-products-check"
              checked={canAddProducts}
              onChange={(e) => setCanAddProducts(e.target.checked)}
              className="w-4 h-4 rounded text-[#34533F] focus:ring-[#34533F] cursor-pointer"
            />
            <label htmlFor="can-add-products-check" className="text-xs font-bold text-[#3E2B1E] cursor-pointer">
              صلاحية إضافة وتعديل وحذف المنتجات في المتجر
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#34533F] text-white font-bold text-xs sm:text-sm hover:bg-[#284131] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة وتفعيل المساعد</span>
          </button>
        </form>

        {/* List of Current Assistants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold text-[#7A6A5C] uppercase tracking-wider">
              قائمة المساعدين المعتمدين ({assistants.length})
            </h4>
          </div>

          {assistants.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-[#DFCFC0] text-xs text-[#8C7A6A]">
              لم يتم تعيين أي مساعد بعد. يمكنكِ إضافة إيميل أي شخص ترغبين بمنحه صلاحية إضافة المنتجات.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {assistants.map((ast) => (
                <div
                  key={ast.id}
                  className="bg-white p-3 rounded-xl border border-[#EBE1D4] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#2C1E18]">
                        {ast.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onTogglePermission(ast.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          ast.canAddProducts
                            ? 'bg-[#EBF3ED] text-[#34533F] hover:bg-[#DDF0E2]'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                        title="اضغطي لتبديل الصلاحية"
                      >
                        {ast.canAddProducts ? '✓ يضيف منتجات' : '✕ معطل'}
                      </button>
                    </div>
                    <span className="text-[11px] text-[#7E6E5F] font-mono block truncate mt-0.5" dir="ltr">
                      {ast.email}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`هل أنتِ متأكدة من إزالة المساعد (${ast.name})؟`)) {
                        onRemoveAssistant(ast.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="إزالة المساعد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
