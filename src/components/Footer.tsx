import React from 'react';
import { Lock, ShieldCheck, Heart, Sparkles, MessageCircle, Phone, Truck } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  return (
    <footer className="w-full bg-[#241A15] text-[#D8C7B8] pt-10 pb-20 sm:pb-12 border-t border-[#3A2B23] mt-12">
      <div className="max-w-xl sm:max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-right">
        {/* Value Propositions / SHEIN-Style Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 border-b border-[#3D2C23] text-center">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#2D211B]/60">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-xs font-bold text-[#EFE7DC]">مستورد أصلي من الهند</span>
            <span className="text-[10px] text-[#A69382]">أعشاب وزيوت طبيعية 100%</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#2D211B]/60">
            <Truck className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-bold text-[#EFE7DC]">توصيل لكافة المحافظات</span>
            <span className="text-[10px] text-[#A69382]">بغداد وكافة مدن العراق</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#2D211B]/60">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold text-[#EFE7DC]">الدفع عند الاستلام</span>
            <span className="text-[10px] text-[#A69382]">معاينة المنتج قبل الدفع</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#2D211B]/60">
            <MessageCircle className="w-6 h-6 text-green-400" />
            <span className="text-xs font-bold text-[#EFE7DC]">خدمة عملاء سريعة</span>
            <span className="text-[10px] text-[#A69382]">استشارات فورية عبر واتساب</span>
          </div>
        </div>

        {/* Brand and Description */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">متجر لولو الهندية 🌿</span>
              <span className="text-[10px] font-bold tracking-widest text-[#B59C86] uppercase bg-[#34241C] px-2 py-0.5 rounded-full">
                Lulu India Store
              </span>
            </div>
            <p className="text-xs text-[#A89481] mt-1 max-w-md leading-relaxed">
              منصتكِ الموثوقة للتسوق من الهند مباشرة. أفضل زيوت الشعر الهندية، الحنة النقية، وخلاصات الأعشاب الطبيعية للعناية المتكاملة.
            </p>
          </div>

          {/* WhatsApp Support CTA */}
          <a
            href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20%D9%84%D9%88%D9%84%D9%88%20%D8%A7%D9%84%D9%87%D9%86%D8%AF%D9%8A%D8%A9%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#1EBE5D] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل معنا عبر واتساب</span>
          </a>
        </div>

        {/* Bottom Bar with Discreet Admin Portal Entrance */}
        <div className="pt-6 border-t border-[#382820] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7564]">
          <p>© {new Date().getFullYear()} متجر لولو الهندية. جميع الحقوق محفوظة.</p>

          {/* Discreet Admin Lock Gate */}
          <button
            id="footer-admin-link"
            type="button"
            onClick={onOpenAdminLogin}
            className="flex items-center gap-1.5 text-xs text-[#8C7564] hover:text-[#D8C7B8] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#34241C]"
            title="بوابة إدارة المتجر لمالكة المتجر"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>بوابة الإدارة (مالكة المتجر)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
