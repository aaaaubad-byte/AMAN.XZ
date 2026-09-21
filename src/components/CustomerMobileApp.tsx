import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Bell,
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Wallet,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Sparkles
} from 'lucide-react';
import { AmanLogo } from './AmanLogo';
import {
  CustomerNumber,
  Protection,
  ProtectionRequest,
  PaymentMethod
} from '../types';
import {
  detectProvider,
  normalizePhone,
  TELECOM_PROVIDERS,
  PAYMENT_METHODS
} from '../data/initialData';

interface CustomerMobileAppProps {
  numbers: CustomerNumber[];
  protections: Protection[];
  requests: ProtectionRequest[];
  onAddNumberAndRequest: (
    phone: string,
    providerId: string,
    providerName: string,
    paymentMethodId: string,
    reference: string
  ) => void;
}

export const CustomerMobileApp: React.FC<CustomerMobileAppProps> = ({
  numbers,
  protections,
  requests,
  onAddNumberAndRequest
}) => {
  // Navigation State within the Android App Mockup
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'home' | 'details' | 'add_number' | 'pay_sheet'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'notifications' | 'more'>('home');

  // Input states
  const [loginPhone, setLoginPhone] = useState('771234567');
  const [loginPass, setLoginPass] = useState('••••••••');
  const [showPass, setShowPass] = useState(false);

  // New Number & Request Form State
  const [newPhone, setNewPhone] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(PAYMENT_METHODS[0].id);
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  // Auto Provider Detection
  const detectedProvider = detectProvider(newPhone);

  const handleStartAddNumber = () => {
    setNewPhone('');
    setTransferRef('');
    setCurrentScreen('add_number');
  };

  const handleProceedToPayment = () => {
    if (!detectedProvider) return;
    setCurrentScreen('pay_sheet');
  };

  const handleConfirmProtectionRequest = () => {
    if (!detectedProvider || !transferRef.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAddNumberAndRequest(
        newPhone,
        detectedProvider.id,
        detectedProvider.name_ar,
        selectedWalletId,
        transferRef.trim()
      );
      setIsSubmitting(false);
      setCurrentScreen('home');
      setSuccessDialog(true);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Device Toolbar / Switcher Controls */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#DCE9E6] shadow-xs text-xs">
        <div className="flex items-center gap-2 font-semibold text-[#183B2D]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#087F6E] animate-pulse" />
          <span>تطبيق العميل (Android Emulator)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentScreen('splash')}
            className={`px-2 py-1 rounded-md transition-colors ${
              currentScreen === 'splash' ? 'bg-[#087F6E] text-white' : 'text-[#6E7A77] hover:bg-slate-100'
            }`}
          >
            البداية
          </button>
          <button
            onClick={() => setCurrentScreen('login')}
            className={`px-2 py-1 rounded-md transition-colors ${
              currentScreen === 'login' ? 'bg-[#087F6E] text-white' : 'text-[#6E7A77] hover:bg-slate-100'
            }`}
          >
            الدخول
          </button>
          <button
            onClick={() => setCurrentScreen('home')}
            className={`px-2 py-1 rounded-md transition-colors ${
              currentScreen === 'home' || currentScreen === 'details' ? 'bg-[#087F6E] text-white' : 'text-[#6E7A77] hover:bg-slate-100'
            }`}
          >
            الرئيسية
          </button>
        </div>
      </div>

      {/* Realistic Android Phone Mockup Frame */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col overflow-hidden select-none border-4 border-slate-700">
        
        {/* Dynamic Island / Android Speaker & Camera Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Screen Bezel & Canvas */}
        <div className="relative w-full h-full bg-[#F7FAF9] rounded-[38px] overflow-hidden flex flex-col text-[#183B2D] font-['Cairo',sans-serif]">
          
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold z-40 bg-transparent">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* SCREEN 1: SPLASH SCREEN */}
          {currentScreen === 'splash' && (
            <div className="flex-1 bg-gradient-to-b from-[#087F6E] via-[#065A4E] to-[#183B2D] text-white flex flex-col justify-between p-8 relative overflow-hidden animate-in fade-in duration-300">
              {/* Abstract decorative waves */}
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#6EE7B7]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#19899A]/20 blur-3xl pointer-events-none" />

              <div className="pt-16 text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-xl flex items-center justify-center">
                  <AmanLogo size="lg" variant="dark" showSubtitle={false} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">أمان | AMAN</h1>
                  <p className="text-emerald-200 text-sm mt-1 font-medium">أمان حماية وضمان</p>
                </div>
              </div>

              <div className="space-y-4 pb-8 z-10 text-center">
                <p className="text-xs text-emerald-100/80 leading-relaxed px-4">
                  المنظومة الوطنية الأولى المعتمدة لحماية وضمان أرقام الهواتف من السحب أو إعادة البيع
                </p>
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="w-full py-3.5 bg-white text-[#087F6E] hover:bg-emerald-50 font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-sm"
                >
                  ابدأ الآن
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: LOGIN SCREEN */}
          {currentScreen === 'login' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-300">
              <div className="space-y-6 pt-4">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-[#E9F8F5] text-[#087F6E] rounded-2xl mx-auto flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#183B2D]">مرحباً بك</h2>
                    <p className="text-xs text-[#6E7A77] mt-1">في منصة أمان لحماية أرقامك</p>
                  </div>
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-semibold text-[#183B2D] mb-1">
                      رقم الجوال أو البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="77xxxxxxx"
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-sm text-[#183B2D] focus:outline-none focus:border-[#087F6E] text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#183B2D] mb-1">
                      كلمة المرور
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        dir="ltr"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-sm text-[#183B2D] focus:outline-none focus:border-[#087F6E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-3 text-[#6E7A77]"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-left">
                    <button className="text-xs font-medium text-[#087F6E] hover:underline">
                      نسيت كلمة المرور؟
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="w-full py-3.5 bg-[#087F6E] hover:bg-[#066759] text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.98]"
                  >
                    دخول
                  </button>
                </div>
              </div>

              <div className="text-center pt-6 pb-2 text-xs text-[#6E7A77]">
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="font-bold text-[#087F6E] hover:underline"
                >
                  سجل الآن
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: CUSTOMER HOME DASHBOARD */}
          {(currentScreen === 'home' || currentScreen === 'details') && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Header Greeting Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9F8F5] border border-[#6EE7B7] flex items-center justify-center font-bold text-[#087F6E] text-sm shadow-xs">
                      أح
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#183B2D]">مرحباً، أحمد محمد</div>
                      <div className="text-[11px] text-[#087F6E] font-medium">حماية أرقامك أولويتنا</div>
                    </div>
                  </div>
                  <div className="relative p-2 rounded-xl bg-white border border-[#DCE9E6] shadow-xs cursor-pointer">
                    <Bell className="w-5 h-5 text-[#183B2D]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#087F6E]" />
                  </div>
                </div>

                {/* Primary Card: Protected Number Highlight */}
                {protections.length > 0 ? (
                  <div className="bg-gradient-to-br from-[#087F6E] via-[#0b8a78] to-[#19899A] rounded-2xl p-4 text-white shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7]" />
                        <span>مفعل • نشط</span>
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">
                        {protections[0].provider_name_ar}
                      </span>
                    </div>

                    <div className="text-right py-1">
                      <div className="text-xs text-emerald-100 font-medium">رقمك المحمي</div>
                      <div className="text-2xl font-bold font-mono tracking-wider" dir="ltr">
                        +967 {protections[0].phone_number.substring(0, 2)} {protections[0].phone_number.substring(2, 5)} {protections[0].phone_number.substring(5)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="text-emerald-100">ساري لمدة: {protections[0].duration_days_snapshot} يوماً</span>
                      <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                        متبقي {protections[0].remaining_days} يوم
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-4 border border-[#DCE9E6] text-center space-y-2">
                    <ShieldAlert className="w-8 h-8 text-[#D97706] mx-auto" />
                    <div className="text-sm font-bold text-[#183B2D]">لا توجد حماية نشطة حالياً</div>
                    <div className="text-xs text-[#6E7A77]">قم بإضافة رقمك وتفعيله الآن لحمايته من السحب</div>
                  </div>
                )}

                {/* Quick Actions Trio */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div
                    onClick={handleStartAddNumber}
                    className="p-3 bg-white rounded-xl border border-[#DCE9E6] shadow-xs cursor-pointer hover:border-[#087F6E] transition-all flex flex-col items-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E9F8F5] text-[#087F6E] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#183B2D]">حماية رقم</span>
                  </div>

                  <div
                    onClick={() => setCurrentScreen('details')}
                    className="p-3 bg-white rounded-xl border border-[#DCE9E6] shadow-xs cursor-pointer hover:border-[#087F6E] transition-all flex flex-col items-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E9F8F5] text-[#19899A] flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#183B2D]">تحويلات</span>
                  </div>

                  <div
                    onClick={() => setCurrentScreen('details')}
                    className="p-3 bg-white rounded-xl border border-[#DCE9E6] shadow-xs cursor-pointer hover:border-[#087F6E] transition-all flex flex-col items-center gap-1.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E9F8F5] text-[#087F6E] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#183B2D]">المعاملات</span>
                  </div>
                </div>

                {/* Big Primary Action: Add New Number */}
                <button
                  onClick={handleStartAddNumber}
                  className="w-full py-3.5 bg-[#087F6E] hover:bg-[#066759] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all text-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة رقم جديد لحمايته</span>
                </button>

                {/* Section: Protection Numbers & Requests Overview */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#183B2D]">أرقامي والطلبات</span>
                    <button
                      onClick={() => setCurrentScreen('details')}
                      className="text-[#087F6E] font-semibold hover:underline"
                    >
                      عرض الكل ({numbers.length + requests.length})
                    </button>
                  </div>

                  {/* Pending Requests List */}
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-[#183B2D]" dir="ltr">
                            +967 {req.phone_number}
                          </div>
                          <div className="text-[10px] text-[#6E7A77]">
                            {req.provider_name_ar} • سند: {req.transfer_reference}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold py-1 px-2.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                        قيد المراجعة
                      </span>
                    </div>
                  ))}

                  {/* Registered Numbers List */}
                  {numbers.map((num) => {
                    const isProtected = protections.some((p) => p.customer_number_id === num.id);
                    return (
                      <div
                        key={num.id}
                        className="p-3 bg-white rounded-xl border border-[#DCE9E6] shadow-xs flex items-center justify-between hover:border-[#087F6E] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isProtected ? 'bg-[#E9F8F5] text-[#087F6E]' : 'bg-slate-100 text-[#6E7A77]'
                            }`}
                          >
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold font-mono text-[#183B2D]" dir="ltr">
                              +967 {num.phone_number}
                            </div>
                            <div className="text-[10px] text-[#6E7A77]">
                              {num.provider_name_ar}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold py-1 px-2.5 rounded-full ${
                            isProtected
                              ? 'bg-[#E9F8F5] text-[#087F6E]'
                              : 'bg-slate-100 text-[#6E7A77]'
                          }`}
                        >
                          {isProtected ? 'مفعل ✓' : 'غير محمي'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Bar */}
              <div className="bg-white border-t border-[#DCE9E6] px-6 py-2 flex items-center justify-between text-xs z-30">
                <button
                  onClick={() => {
                    setActiveBottomTab('home');
                    setCurrentScreen('home');
                  }}
                  className={`flex flex-col items-center gap-1 ${
                    activeBottomTab === 'home' ? 'text-[#087F6E] font-bold' : 'text-[#6E7A77]'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px]">الرئيسية</span>
                </button>

                <button
                  onClick={() => {
                    setActiveBottomTab('notifications');
                  }}
                  className={`flex flex-col items-center gap-1 ${
                    activeBottomTab === 'notifications' ? 'text-[#087F6E] font-bold' : 'text-[#6E7A77]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="text-[10px]">الإشعارات</span>
                </button>

                <button
                  onClick={() => {
                    setActiveBottomTab('more');
                  }}
                  className={`flex flex-col items-center gap-1 ${
                    activeBottomTab === 'more' ? 'text-[#087F6E] font-bold' : 'text-[#6E7A77]'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px]">المزيد</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: ADD NUMBER (STEP 1: PHONE & PROVIDER AUTO-DETECTION) */}
          {currentScreen === 'add_number' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#DCE9E6] pb-3">
                  <h3 className="font-bold text-base text-[#183B2D]">إضافة رقم للحماية</h3>
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="p-1.5 rounded-lg text-[#6E7A77] hover:bg-slate-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-semibold text-[#183B2D] mb-1">
                      أدخل رقم الهاتف (9 أرقام)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="77xxxxxxx"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        dir="ltr"
                        maxLength={9}
                        className="w-full pl-16 pr-4 py-3 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-base font-mono font-bold text-[#183B2D] focus:outline-none focus:border-[#087F6E]"
                      />
                      <div className="absolute left-3 flex items-center gap-1 text-xs text-[#6E7A77]">
                        <span className="font-mono font-bold">+967</span>
                        <span>🇾🇪</span>
                      </div>
                    </div>
                  </div>

                  {/* Auto Provider Detection Banner */}
                  <div className="p-3.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] space-y-2">
                    <div className="text-xs font-semibold text-[#183B2D]">شركة الاتصالات المكتشفة:</div>
                    {detectedProvider ? (
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#087F6E]">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: detectedProvider.color }}
                          />
                          <span className="text-sm font-bold text-[#183B2D]">
                            {detectedProvider.name_ar}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#087F6E]">تم التحقق آلياً ✓</span>
                      </div>
                    ) : (
                      <div className="text-xs text-[#6E7A77]">
                        أدخل أول رقمين لاكتشاف الشركة (77, 78 يمن موبايل / 71 سبأفون / 73 يو / 70 واي)
                      </div>
                    )}
                  </div>

                  {/* Plan Information Card (Snapshot: 1000 YER / 365 Days) */}
                  <div className="p-3.5 rounded-xl bg-[#E9F8F5] border border-[#6EE7B7] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#087F6E]">الباقة المعتمدة</span>
                      <span className="text-sm font-bold font-mono text-[#087F6E]">1,000 YER</span>
                    </div>
                    <p className="text-[11px] text-[#183B2D]">
                      مدة الحماية: 365 يوماً كاملة مع تجديدات دورية منتظمة لدى شركة الاتصالات لضمان عدم سحب الرقم.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!detectedProvider}
                  onClick={handleProceedToPayment}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xs transition-all ${
                    detectedProvider
                      ? 'bg-[#087F6E] hover:bg-[#066759] text-white active:scale-[0.98]'
                      : 'bg-[#DCE9E6] text-[#6E7A77] cursor-not-allowed'
                  }`}
                >
                  متابعة إلى خطوة الدفع
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: PAYMENT BOTTOM SHEET (STEP 2: WALLET SELECTION & PROOF) */}
          {currentScreen === 'pay_sheet' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCE9E6] pb-3">
                  <h3 className="font-bold text-base text-[#183B2D]">اختر طريقة الدفع</h3>
                  <button
                    onClick={() => setCurrentScreen('add_number')}
                    className="p-1 rounded-lg text-[#6E7A77]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Wallets Selector */}
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWalletId(w.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedWalletId === w.id
                          ? 'border-[#087F6E] bg-[#E9F8F5]'
                          : 'border-[#DCE9E6] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedWalletId === w.id ? 'border-[#087F6E] bg-[#087F6E]' : 'border-slate-300'
                          }`}
                        >
                          {selectedWalletId === w.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#183B2D]">{w.name_ar}</div>
                          <div className="text-[10px] text-[#6E7A77] font-mono">رقم الحساب: {w.account_number}</div>
                        </div>
                      </div>
                      <Wallet className="w-4 h-4 text-[#087F6E]" />
                    </div>
                  ))}
                </div>

                {/* Transfer Reference Input */}
                <div className="space-y-1.5 text-right">
                  <label className="block text-xs font-semibold text-[#183B2D]">
                    رقم الحوالة أو إشعار التحويل
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: TRX-884920"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-sm font-mono text-[#183B2D] focus:outline-none focus:border-[#087F6E]"
                  />
                  <p className="text-[10px] text-[#6E7A77]">
                    يرجى تحويل 1,000 ريال يمني إلى رقم الحساب أعلاه وإدخال رقم الإشعار.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  disabled={!transferRef.trim() || isSubmitting}
                  onClick={handleConfirmProtectionRequest}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                    transferRef.trim() && !isSubmitting
                      ? 'bg-[#087F6E] hover:bg-[#066759] text-white active:scale-[0.98]'
                      : 'bg-[#DCE9E6] text-[#6E7A77] cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>تأكيد وإرسال الطلب للمراجعة</span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-2.5 text-xs text-[#6E7A77] hover:text-[#183B2D]"
                >
                  إلغاء والعودة
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Success Modal Simulation */}
      {successDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#DCE9E6] animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#E9F8F5] text-[#087F6E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#183B2D]">تم استلام طلب الحماية</h3>
            <p className="text-xs text-[#6E7A77] leading-relaxed">
              طلبك الآن قيد المراجعة والتدقيق بواسطة فريق أمان. سيتم تفعيل الحماية آلياً بمجرد مطابقة إشعار السداد.
            </p>
            <button
              onClick={() => setSuccessDialog(false)}
              className="w-full py-3 bg-[#087F6E] text-white font-bold rounded-xl hover:bg-[#066759] transition-all"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
