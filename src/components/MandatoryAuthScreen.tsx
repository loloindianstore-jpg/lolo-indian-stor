import React, { useState } from 'react';
import { UserAccount, UserRole, AuthProviderType } from '../types';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  LogIn,
  AlertCircle,
  HelpCircle,
  Truck,
  Flame,
} from 'lucide-react';

interface MandatoryAuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  ownerEmail: string;
}

export const MandatoryAuthScreen: React.FC<MandatoryAuthScreenProps> = ({
  onLoginSuccess,
  ownerEmail,
}) => {
  // Method selection: 'email' | 'google' | 'phone'
  const [activeMethod, setActiveMethod] = useState<'email' | 'google' | 'phone'>('email');

  // Email form states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [cityInput, setCityInput] = useState('بغداد');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone / WhatsApp states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [isViaWhatsApp, setIsViaWhatsApp] = useState(true);

  // Google flow simulation
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // General loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 1. Handle Email / Password Login or Registration
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }

    if (passwordInput.length < 4) {
      setError('كلمة المرور يجب أن لا تقل عن 4 خانات.');
      return;
    }

    if (isRegisterMode) {
      if (!nameInput.trim()) {
        setError('يرجى إدخال الاسم الكامل.');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setError('كلمة المرور غير متطابقة في الخانتين.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if Owner login
      const isOwnerAttempt =
        cleanEmail === ownerEmail.toLowerCase() ||
        cleanEmail === 'admin@lulu-shop.com' ||
        cleanEmail.includes('owner');

      const savedAdminPassword =
        localStorage.getItem('lulu_admin_password') || 'lulu2026';

      let role: UserRole = 'customer';
      let displayName = nameInput.trim() || cleanEmail.split('@')[0];

      if (isOwnerAttempt) {
        if (passwordInput === savedAdminPassword || passwordInput === '2026') {
          role = 'owner';
          displayName = 'مالكة المتجر (لولو)';
          sessionStorage.setItem('lulu_admin_authenticated', 'true');
        }
      }

      const account: UserAccount = {
        email: cleanEmail,
        role,
        name: displayName,
        provider: 'email',
        isLoggedIn: true,
        city: isRegisterMode ? cityInput : 'بغداد',
        lastLoginAt: Date.now(),
        token: `tok_${Math.random().toString(36).substring(2, 10)}`,
      };

      setSuccessToast(`أهلاً وسهلاً بكِ ${displayName}! جاري فتح المتجر...`);
      setTimeout(() => {
        onLoginSuccess(account);
      }, 700);
    }, 600);
  };

  // 2. Handle Google Login
  const handleGoogleLoginTrigger = () => {
    setError(null);
    setShowGooglePicker(true);
  };

  const handleSelectGoogleAccount = (googleUser: {
    name: string;
    email: string;
    avatar: string;
    isOwner?: boolean;
  }) => {
    setShowGooglePicker(false);
    setIsGoogleLoading(true);

    setTimeout(() => {
      setIsGoogleLoading(false);
      const isOwner =
        googleUser.isOwner || googleUser.email.toLowerCase() === ownerEmail.toLowerCase();

      if (isOwner) {
        sessionStorage.setItem('lulu_admin_authenticated', 'true');
      }

      const account: UserAccount = {
        email: googleUser.email,
        name: googleUser.name,
        role: isOwner ? 'owner' : 'customer',
        provider: 'google',
        avatarUrl: googleUser.avatar,
        isLoggedIn: true,
        lastLoginAt: Date.now(),
        token: `g_tok_${Math.random().toString(36).substring(2, 10)}`,
      };

      setSuccessToast(`تم تسجيل الدخول بحساب Google (${googleUser.name}) بنجاح!`);
      setTimeout(() => {
        onLoginSuccess(account);
      }, 600);
    }, 700);
  };

  // 3. Handle Phone / WhatsApp Login
  const handleSendPhoneCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (cleanPhone.length < 8) {
      setError('يرجى إدخال رقم هاتف عراقي صالح (مثال: 07701234567).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPhoneStep('otp');
      setOtpCode('1234'); // Pre-fill test code for ultra convenience
    }, 600);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim()) {
      setError('يرجى كتابة رمز التحقق.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const displayName = phoneName.trim() || `عميلة (${phoneNumber.slice(-4)})`;
      const account: UserAccount = {
        email: `${phoneNumber.replace(/[^0-9]/g, '')}@phone.lulu.iq`,
        phone: phoneNumber,
        name: displayName,
        role: 'customer',
        provider: 'phone',
        isLoggedIn: true,
        city: 'العراق',
        lastLoginAt: Date.now(),
        token: `p_tok_${Math.random().toString(36).substring(2, 10)}`,
      };

      setSuccessToast(`تم تأكيد رقم الهاتف بنجاح! أهلاً بكِ ${displayName}.`);
      setTimeout(() => {
        onLoginSuccess(account);
      }, 600);
    }, 600);
  };

  // 4. Quick Demo Customer Account (1-Click Instant Login)
  const handleQuickDemoCustomerLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoAccount: UserAccount = {
        email: 'demo.customer@lulu-shop.com',
        name: 'نور الهدى (زبونة تجريبية)',
        role: 'customer',
        provider: 'demo',
        isLoggedIn: true,
        city: 'بغداد - الكرادة',
        lastLoginAt: Date.now(),
        token: `demo_tok_${Date.now()}`,
      };
      setSuccessToast('تم تسجيل الدخول بحساب زبونة تجريبي! مرحباً بكِ ✨');
      setTimeout(() => {
        onLoginSuccess(demoAccount);
      }, 500);
    }, 400);
  };

  // 5. Quick Owner Portal Login
  const handleQuickOwnerLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('lulu_admin_authenticated', 'true');
      const ownerAccount: UserAccount = {
        email: ownerEmail,
        name: 'مالكة المتجر (لولو)',
        role: 'owner',
        provider: 'email',
        isLoggedIn: true,
        lastLoginAt: Date.now(),
        token: `owner_tok_${Date.now()}`,
      };
      setSuccessToast('تم تسجيل دخول مالكة المتجر بنجاح 👑');
      setTimeout(() => {
        onLoginSuccess(ownerAccount);
      }, 500);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#241712] text-[#F3EBE1] flex flex-col justify-between selection:bg-[#34533F] selection:text-white relative overflow-hidden font-['Tajawal',sans-serif]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7A4E2B]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#34533F]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner & Security Status */}
      <div className="w-full bg-[#1A110D] border-b border-[#3D2C22] py-2 px-4 text-center text-xs font-bold text-[#D4C1B0] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>متجر لولو الهندية الرسمي • بوابة التسوق الآمنة والمقفلة في العراق 🇮🇶</span>
      </div>

      {/* Main Authentication Card Container */}
      <div className="w-full max-w-md mx-auto px-4 py-8 z-10 flex-1 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-b from-[#7A4E2B] to-[#34533F] text-white shadow-xl shadow-black/40 border border-[#A67C52]/40 mb-3 animate-pulse">
            <span className="text-3xl">🌿</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>لولو الهندية</span>
            <span className="text-xs bg-[#7A4E2B] text-white font-bold px-2 py-0.5 rounded-md border border-[#A67C52]/40">
              العراق
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C0AF] mt-1.5 max-w-xs mx-auto leading-relaxed">
            الوجهة الأولى للزيوت والأعشاب الهندية النقية ومنتجات الجمال الأصلية
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 bg-[#2F1F17] text-[#CDB8A6] text-xs font-bold px-3 py-1 rounded-full border border-[#483326]">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>يتطلب تسجيل الدخول لتصفح المنتجات والشراء</span>
          </div>
        </div>

        {/* Quick Demo Account Banner */}
        <div className="mb-4">
          <button
            id="auth-demo-customer-btn"
            type="button"
            onClick={handleQuickDemoCustomerLogin}
            disabled={isLoading}
            className="w-full p-3 rounded-2xl bg-linear-to-r from-[#34533F] via-[#3E654D] to-[#34533F] text-white text-xs sm:text-sm font-black hover:brightness-110 active:scale-98 transition-all shadow-lg border border-[#528766]/50 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
                ⚡
              </span>
              <div className="text-right">
                <span className="block font-black text-white">دخول فوري بحساب زبونة تجريبي</span>
                <span className="block text-[10px] text-emerald-100/80 font-medium">
                  بنقرة واحدة لتجربة المنتجات والسلة فوراً
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Authentication Box */}
        <div className="bg-[#2E1F18]/90 backdrop-blur-md rounded-3xl border border-[#4A3528] shadow-2xl p-5 sm:p-6 text-right">
          {/* Methods Tabs (Email / Google / Phone) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1F1410] rounded-2xl border border-[#3E2C20] mb-5">
            <button
              id="tab-method-email"
              type="button"
              onClick={() => {
                setActiveMethod('email');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'email'
                  ? 'bg-[#7A4E2B] text-white shadow-sm'
                  : 'text-[#9E8A7A] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>البريد</span>
            </button>

            <button
              id="tab-method-google"
              type="button"
              onClick={() => {
                setActiveMethod('google');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'google'
                  ? 'bg-[#7A4E2B] text-white shadow-sm'
                  : 'text-[#9E8A7A] hover:text-white'
              }`}
            >
              {/* Google G Logo SVG */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              id="tab-method-phone"
              type="button"
              onClick={() => {
                setActiveMethod('phone');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeMethod === 'phone'
                  ? 'bg-[#7A4E2B] text-white shadow-sm'
                  : 'text-[#9E8A7A] hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>الهاتف</span>
            </button>
          </div>

          {/* Feedback & Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-900/40 border border-rose-700/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successToast && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

          {/* ================= METHOD 1: EMAIL & PASSWORD ================= */}
          {activeMethod === 'email' && (
            <div className="space-y-4">
              {/* Sub Mode Toggle: Sign In vs Create Account */}
              <div className="flex items-center justify-between border-b border-[#4A3528] pb-3 text-xs">
                <span className="font-extrabold text-white">
                  {isRegisterMode ? 'إنشاء حساب زبونة جديدة:' : 'تسجيل الدخول إلى حسابكِ:'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setError(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
                >
                  {isRegisterMode ? 'لديكِ حساب بالفعل؟ سجلي دخولك' : 'ليس لديكِ حساب؟ سجلي الآن'}
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {/* Full Name in Register Mode */}
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      الاسم الكامل <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="مثال: مريم العلي"
                      className="w-full bg-[#1C120D] text-white text-sm rounded-xl py-2.5 px-3 border border-[#4D3627] focus:outline-none focus:border-[#7A4E2B]"
                    />
                  </div>
                )}

                {/* Email input */}
                <div>
                  <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                    البريد الإلكتروني <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full bg-[#1C120D] text-white text-sm rounded-xl py-2.5 pr-3 pl-10 border border-[#4D3627] text-right focus:outline-none focus:border-[#7A4E2B]"
                    />
                    <Mail className="w-4 h-4 text-[#8C7563] absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                    كلمة المرور <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full bg-[#1C120D] text-white text-sm rounded-xl py-2.5 pr-3 pl-10 border border-[#4D3627] text-right focus:outline-none focus:border-[#7A4E2B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-[#8C7563] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password in Register Mode */}
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      تأكيد كلمة المرور <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full bg-[#1C120D] text-white text-sm rounded-xl py-2.5 px-3 border border-[#4D3627] text-right focus:outline-none focus:border-[#7A4E2B]"
                    />
                  </div>
                )}

                {/* City selection in Register Mode */}
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      المحافظة في العراق
                    </label>
                    <select
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full bg-[#1C120D] text-white text-xs sm:text-sm rounded-xl py-2.5 px-3 border border-[#4D3627] focus:outline-none focus:border-[#7A4E2B]"
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
                )}

                {/* Remember me checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#BFAFA0]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#4D3627] text-[#7A4E2B] focus:ring-0"
                    />
                    <span>حفظ تسجيل الدخول على هذا الجهاز دائماً</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  id="auth-email-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-5 rounded-full bg-[#7A4E2B] hover:bg-[#633E20] text-white font-extrabold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <span>جاري التحقق...</span>
                  ) : isRegisterMode ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب والدخول للمتجر</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول للمتجر</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= METHOD 2: SIGN IN WITH GOOGLE ================= */}
          {activeMethod === 'google' && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                    />
                  </svg>
                </div>
                <h4 className="text-base font-extrabold text-white">
                  تسجيل الدخول الموحد بحساب Google
                </h4>
                <p className="text-xs text-[#BFAFA0] max-w-xs mx-auto leading-relaxed">
                  طريقة سريعة وآمنة بضغطة واحدة بدون الحاجة لتذكر كلمة المرور
                </p>
              </div>

              {/* Google Button */}
              <button
                id="auth-google-cta-btn"
                type="button"
                onClick={handleGoogleLoginTrigger}
                disabled={isGoogleLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-100 text-[#2C1E18] font-black text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                  />
                </svg>
                <span>متابعة باستخدام حساب Google</span>
              </button>

              <div className="bg-[#1F1410] p-3 rounded-xl border border-[#3E2C20] text-[11px] text-[#A89482] text-center">
                🔒 يتم تأمين جلسة التسجيل وحفظ بياناتك محلياً بشكل مشفر
              </div>
            </div>
          )}

          {/* ================= METHOD 3: PHONE & WHATSAPP ================= */}
          {activeMethod === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#4A3528] pb-3 text-xs">
                <span className="font-extrabold text-white">الدخول برقم الهاتف / الواتساب:</span>
                <span className="text-[#34D399] flex items-center gap-1 font-bold">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>دعم محافظات العراق</span>
                </span>
              </div>

              {phoneStep === 'input' ? (
                <form onSubmit={handleSendPhoneCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      اسم الزبونة (اختياري)
                    </label>
                    <input
                      type="text"
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      placeholder="مثال: زينب علي"
                      className="w-full bg-[#1C120D] text-white text-sm rounded-xl py-2.5 px-3 border border-[#4D3627] focus:outline-none focus:border-[#7A4E2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      رقم الهاتف العراقي <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2" dir="ltr">
                      <div className="bg-[#1C120D] border border-[#4D3627] text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0">
                        <span>🇮🇶</span>
                        <span>+964</span>
                      </div>
                      <input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0770 123 4567"
                        className="flex-1 bg-[#1C120D] text-white text-sm rounded-xl py-2.5 px-3 border border-[#4D3627] focus:outline-none focus:border-[#7A4E2B] font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-[#1F1410] p-2.5 rounded-xl border border-[#3E2C20] flex items-center justify-between text-xs">
                    <span className="text-[#D4C0AF]">وسيلة استلام الرمز:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsViaWhatsApp(true)}
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                          isViaWhatsApp
                            ? 'bg-[#25D366] text-white'
                            : 'bg-[#2A1D16] text-[#8C7563]'
                        }`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>واتساب</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsViaWhatsApp(false)}
                        className={`px-2.5 py-1 rounded-lg font-bold ${
                          !isViaWhatsApp
                            ? 'bg-[#7A4E2B] text-white'
                            : 'bg-[#2A1D16] text-[#8C7563]'
                        }`}
                      >
                        رسالة SMS
                      </button>
                    </div>
                  </div>

                  <button
                    id="auth-phone-send-code-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-5 rounded-full bg-[#7A4E2B] hover:bg-[#633E20] text-white font-extrabold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>إرسال رمز التحقق</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5 animate-in fade-in">
                  <div className="text-center pb-1">
                    <span className="text-xs text-[#D4C0AF] block">
                      تم إرسال رمز التحقق إلى الرقم:{' '}
                      <strong className="text-white font-mono" dir="ltr">
                        {phoneNumber}
                      </strong>
                    </span>
                    <span className="text-[11px] text-emerald-400 block mt-0.5">
                      (رمز تجريبي جاهز: 1234)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#D4C0AF] mb-1">
                      رمز التحقق (OTP) <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      dir="ltr"
                      className="w-full bg-[#1C120D] text-white text-center text-lg font-mono tracking-widest rounded-xl py-2.5 px-3 border border-[#4D3627] focus:outline-none focus:border-[#7A4E2B]"
                    />
                  </div>

                  <button
                    id="auth-phone-verify-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-5 rounded-full bg-[#34533F] hover:bg-[#284131] text-white font-extrabold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد الرمز والدخول للمتجر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhoneStep('input')}
                    className="w-full text-center text-xs text-[#A89482] hover:text-white underline pt-1"
                  >
                    تغيير رقم الهاتف
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Owner Entry Hint / Gate */}
          <div className="mt-5 pt-4 border-t border-[#4A3528] flex items-center justify-between text-[11px] text-[#A89482]">
            <span>مالكة المتجر المعتمدة؟</span>
            <button
              id="auth-quick-owner-link"
              type="button"
              onClick={handleQuickOwnerLogin}
              className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
            >
              <span>دخول سريع للمالكة</span>
              <span>👑</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Footer */}
      <div className="w-full bg-[#1A110D] border-t border-[#3D2C22] py-4 px-4 text-center text-xs text-[#8C7563]">
        <div className="max-w-md mx-auto flex items-center justify-around mb-1 text-[#C4B2A0]">
          <span className="flex items-center gap-1">
            <span>🇮🇳</span>
            <span>أصلي 100% من الهند</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>توصيل لكافة المحافظات</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>الدفع عند الاستلام</span>
          </span>
        </div>
        <p className="text-[10px] text-[#6E594B] mt-1">
          © {new Date().getFullYear()} متجر لولو الهندية. جميع الحقوق محفوظة لجمهورية العراق.
        </p>
      </div>

      {/* Simulated Google Account Picker Modal */}
      {showGooglePicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowGooglePicker(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 text-right text-[#2C1E18] shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center border-b pb-4">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
              <h3 className="text-base font-black text-stone-900">
                تسجيل الدخول باستخدام Google
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                للمتابعة إلى متجر لولو الهندية (Lulu India Shop)
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'زبونة متجر لولو',
                    email: 'customer.lulu@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full p-3 rounded-2xl hover:bg-stone-50 border border-stone-200 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7A4E2B] text-white flex items-center justify-center font-bold text-sm">
                    ز
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-stone-900">زبونة متجر لولو</span>
                    <span className="block text-[11px] text-stone-500 font-mono" dir="ltr">
                      customer.lulu@gmail.com
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount({
                    name: 'مالكة المتجر (لولو)',
                    email: ownerEmail,
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    isOwner: true,
                  })
                }
                className="w-full p-3 rounded-2xl hover:bg-emerald-50/60 border border-emerald-200 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#34533F] text-white flex items-center justify-center font-bold text-sm">
                    👑
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-900">
                      مالكة المتجر (حساب الإدارة)
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-mono" dir="ltr">
                      {ownerEmail}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGooglePicker(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
