import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Bell,
  Settings,
  User,
  Search,
  CheckCircle2,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronDown,
  Upload,
  ArrowUpRight,
  Clock,
  XCircle,
  FileCheck
} from 'lucide-react';
import { AmanLogo } from './AmanLogo';

export const DesignTokensShowcase: React.FC = () => {
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [showDemoSheet, setShowDemoSheet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('jawali');

  const colorPalette = [
    { name: 'Primary', hex: '#087F6E', rgb: 'RGB 8 127 110', textDark: false },
    { name: 'Secondary', hex: '#19899A', rgb: 'RGB 25 154 154', textDark: false },
    { name: 'Accent', hex: '#6EE7B7', rgb: 'RGB 110 231 183', textDark: true },
    { name: 'Light', hex: '#E9F8F5', rgb: 'RGB 233 248 245', textDark: true },
    { name: 'Background', hex: '#F7FAF9', rgb: 'RGB 247 250 249', textDark: true, border: true },
    { name: 'Surface', hex: '#FFFFFF', rgb: 'RGB 255 255 255', textDark: true, border: true },
    { name: 'Text Primary', hex: '#183B2D', rgb: 'RGB 24 59 45', textDark: false },
    { name: 'Text Secondary', hex: '#6E7A77', rgb: 'RGB 110 122 119', textDark: false },
    { name: 'Border', hex: '#DCE9E6', rgb: 'RGB 220 233 230', textDark: true, border: true }
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Visual Identity Header Banner */}
      <div className="bg-gradient-to-r from-[#087F6E] via-[#19899A] to-[#087F6E] p-8 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100">
            <span>نظام التصميم المعتمد</span>
            <span>•</span>
            <span>Design System & Design Tokens</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">الهوية البصرية الرسمية لمنظومة «أمان»</h1>
          <p className="text-emerald-100/90 text-sm max-w-2xl">
            مبنية بالكامل وفق وثيقة الهوية البصرية المعتمدة (الباليتة اللونية، خط Cairo للغة العربية، الأيقونات الدقيقة، ومكونات واجهات المستخدم للأندرويد ولوحة الإدارة).
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <AmanLogo size="lg" variant="dark" />
        </div>
      </div>

      {/* 1. Color Palette */}
      <section className="bg-white p-6 rounded-2xl border border-[#DCE9E6] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#183B2D]">لوحة الألوان المعتمدة (Color Palette)</h2>
          <span className="text-xs text-[#6E7A77] font-mono">RGB & Hex Tokens</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {colorPalette.map((c) => (
            <div key={c.name} className="flex flex-col items-center text-center group">
              <div
                className={`w-16 h-16 rounded-full shadow-xs mb-3 transition-transform group-hover:scale-105 ${
                  c.border ? 'border border-[#DCE9E6]' : ''
                }`}
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-bold text-sm text-[#183B2D]">{c.name}</span>
              <span className="text-xs font-mono text-[#6E7A77]">{c.hex}</span>
              <span className="text-[10px] text-[#6E7A77] mt-0.5">{c.rgb}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography & Iconography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Typography */}
        <section className="bg-white p-6 rounded-2xl border border-[#DCE9E6] shadow-xs">
          <h2 className="text-xl font-bold text-[#183B2D] mb-4">الخطوط والطباعة (Typography)</h2>
          <div className="space-y-4 text-right">
            <div className="flex items-baseline justify-between border-b border-[#DCE9E6] pb-3">
              <span className="text-xs text-[#6E7A77] font-mono">H1 • 32/40 Bold</span>
              <h1 className="text-2xl font-bold text-[#183B2D]">أمان حماية وضمان لكافة أرقامك</h1>
            </div>
            <div className="flex items-baseline justify-between border-b border-[#DCE9E6] pb-3">
              <span className="text-xs text-[#6E7A77] font-mono">H2 • 24/32 Semibold</span>
              <h2 className="text-xl font-semibold text-[#183B2D]">تفاصيل الباقة وتجديد الاشتراك</h2>
            </div>
            <div className="flex items-baseline justify-between border-b border-[#DCE9E6] pb-3">
              <span className="text-xs text-[#6E7A77] font-mono">H3 • 20/28 Medium</span>
              <h3 className="text-lg font-medium text-[#183B2D]">المهام التشغيلية اليومية لشركات الاتصالات</h3>
            </div>
            <div className="flex items-baseline justify-between border-b border-[#DCE9E6] pb-3">
              <span className="text-xs text-[#6E7A77] font-mono">Body • 16/24 Regular</span>
              <p className="text-base text-[#183B2D]">يتم تجديد الأرقام وحمايتها دورياً لمنع سحبها من قبل الشركة.</p>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#6E7A77] font-mono">Caption • 14/20 Regular</span>
              <span className="text-sm text-[#6E7A77]">الرقم محمي حتى 10 يناير 2027</span>
            </div>
          </div>
        </section>

        {/* Iconography */}
        <section className="bg-white p-6 rounded-2xl border border-[#DCE9E6] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#183B2D]">الأيقونات الرسمية (Iconography)</h2>
            <span className="text-xs text-[#6E7A77] font-mono">Stroke: 2px | Corner: 8px | Size: 24px</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 text-center">
            {[
              { icon: ShieldCheck, label: 'حماية' },
              { icon: Phone, label: 'هاتف' },
              { icon: Bell, label: 'إشعارات' },
              { icon: Calendar, label: 'جدولة' },
              { icon: Briefcase, label: 'معاملات' },
              { icon: CheckCircle2, label: 'مكتمل' },
              { icon: Search, label: 'بحث' },
              { icon: Settings, label: 'إعدادات' },
              { icon: User, label: 'مستخدم' },
              { icon: ShieldAlert, label: 'تنبيه' },
              { icon: Upload, label: 'رفع' },
              { icon: Clock, label: 'انتظار' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F7FAF9] border border-[#DCE9E6] flex flex-col items-center gap-2 hover:bg-[#E9F8F5] transition-colors"
              >
                <item.icon className="w-6 h-6 text-[#087F6E]" strokeWidth={2} />
                <span className="text-xs text-[#183B2D] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. UI Components Matrix (Buttons, Inputs, Cards, Tags) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[#183B2D]">عناصر واجهات المستخدم (UI Components)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1: Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE9E6] space-y-4">
            <h3 className="font-bold text-base text-[#183B2D] border-b border-[#DCE9E6] pb-2">الأزرار (Buttons)</h3>
            
            {/* Primary Button */}
            <button className="w-full py-3 px-6 bg-[#087F6E] hover:bg-[#066759] text-white font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]">
              زر أساسي
            </button>

            {/* Secondary Button */}
            <button className="w-full py-3 px-6 bg-white border border-[#087F6E] text-[#087F6E] hover:bg-[#E9F8F5] font-semibold rounded-xl transition-all active:scale-[0.98]">
              زر ثانوي
            </button>

            {/* Text Button */}
            <button className="w-full py-2.5 px-4 text-[#087F6E] hover:text-[#066759] font-medium text-sm transition-colors">
              زر نصي
            </button>

            {/* Disabled Button */}
            <button disabled className="w-full py-3 px-6 bg-[#DCE9E6] text-[#6E7A77] font-semibold rounded-xl cursor-not-allowed">
              زر معطل
            </button>

            {/* Upload Button */}
            <div className="border border-dashed border-[#DCE9E6] hover:border-[#087F6E] bg-[#F7FAF9] p-4 rounded-xl text-center cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[#087F6E] mx-auto mb-1" />
              <span className="text-xs font-semibold text-[#183B2D]">حاوي تحميل سند السداد</span>
            </div>
          </div>

          {/* Column 2: Inputs */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE9E6] space-y-4">
            <h3 className="font-bold text-base text-[#183B2D] border-b border-[#DCE9E6] pb-2">الحقول (Inputs)</h3>
            
            <div>
              <label className="block text-xs font-semibold text-[#183B2D] mb-1 text-right">الإسم الكامل</label>
              <input
                type="text"
                placeholder="ادخل الاسم الكامل"
                defaultValue="أحمد محمد الحاشدي"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-[#183B2D] text-sm focus:outline-none focus:border-[#087F6E] focus:bg-white text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B2D] mb-1 text-right">رقم الهاتف</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  defaultValue="771234567"
                  dir="ltr"
                  className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-[#183B2D] text-sm font-mono focus:outline-none focus:border-[#087F6E] focus:bg-white"
                />
                <div className="absolute left-3 flex items-center gap-1.5 text-xs text-[#6E7A77]">
                  <span className="font-mono">+967</span>
                  <span className="text-base leading-none">🇾🇪</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183B2D] mb-1 text-right">اختر المحافظة</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-[#183B2D] text-sm focus:outline-none focus:border-[#087F6E] text-right">
                  <option>صنعاء</option>
                  <option>عدن</option>
                  <option>تعز</option>
                  <option>حضرموت</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#6E7A77] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث عن رقم أو معاملة..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-sm text-[#183B2D] focus:outline-none focus:border-[#087F6E] text-right"
                />
                <Search className="w-4 h-4 text-[#6E7A77] absolute right-3 top-3.5" />
              </div>
            </div>
          </div>

          {/* Column 3: Cards */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE9E6] space-y-4">
            <h3 className="font-bold text-base text-[#183B2D] border-b border-[#DCE9E6] pb-2">البطاقات (Cards)</h3>

            {/* Protected Number Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#087F6E] to-[#19899A] text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-100">رقم محمي</div>
                  <div className="text-sm font-bold font-mono tracking-wider" dir="ltr">+967 77 123 4567</div>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-white/80" />
            </div>

            {/* Pending Request Card */}
            <div className="p-4 rounded-xl bg-white border border-[#FDB022]/40 hover:border-[#FDB022] text-[#183B2D] flex items-center justify-between transition-colors shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-[#D97706]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#D97706]">طلب حماية</div>
                  <div className="text-xs text-[#6E7A77]">قيد المراجعة والتدقيق</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#6E7A77]" />
            </div>

            {/* Completed Transaction Card */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE9E6] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9F8F5] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#087F6E]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#183B2D]">معاملة سداد مكتملة</div>
                  <div className="text-xs font-mono font-bold text-[#087F6E]">1,000 YER</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#6E7A77]" />
            </div>
          </div>

          {/* Column 4: Status Tags & Interactive Modals */}
          <div className="bg-white p-6 rounded-2xl border border-[#DCE9E6] space-y-4">
            <h3 className="font-bold text-base text-[#183B2D] border-b border-[#DCE9E6] pb-2">شارات الحالة (Status & Tags)</h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <span className="py-1.5 px-3 rounded-full bg-[#E9F8F5] text-[#087F6E] border border-[#6EE7B7]/40">
                مفعل ✓
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#F0FDF4] text-[#15803D] border border-green-200">
                مقبول
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#FEF3C7] text-[#D97706] border border-amber-200">
                قيد المراجعة
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-red-200">
                مرفوض
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200">
                قادم
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#FFEDD5] text-[#C2410C] border border-orange-200">
                منتهي
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#F1F5F9] text-[#475569] border border-slate-200">
                ملغي
              </span>
              <span className="py-1.5 px-3 rounded-full bg-[#F7FAF9] text-[#6E7A77] border border-[#DCE9E6]">
                غير محمي
              </span>
            </div>

            <div className="pt-2 border-t border-[#DCE9E6] space-y-2">
              <button
                onClick={() => setShowDemoDialog(true)}
                className="w-full py-2 px-3 text-xs bg-[#E9F8F5] text-[#087F6E] font-semibold rounded-lg hover:bg-[#6EE7B7]/30 transition-colors"
              >
                معاينة نافذة النجاح (Dialog)
              </button>
              <button
                onClick={() => setShowDemoSheet(true)}
                className="w-full py-2 px-3 text-xs bg-[#F7FAF9] border border-[#DCE9E6] text-[#183B2D] font-semibold rounded-lg hover:bg-[#E9F8F5] transition-colors"
              >
                معاينة ورقة الدفع (Bottom Sheet)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Success Dialog Preview */}
      {showDemoDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-[#DCE9E6] animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#E9F8F5] text-[#087F6E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#183B2D]">تم تفعيل الحماية بنجاح</h3>
            <p className="text-sm text-[#6E7A77]">
              تم تفعيل حماية رقمك بنجاح وضمان عدم سحبه لمدة 365 يوماً مع تجديدات دورية منتظمة.
            </p>
            <button
              onClick={() => setShowDemoDialog(false)}
              className="w-full py-3 bg-[#087F6E] text-white font-semibold rounded-xl hover:bg-[#066759] transition-all"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* Interactive Payment Bottom Sheet Preview */}
      {showDemoSheet && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md text-right space-y-4 shadow-xl border border-[#DCE9E6] animate-in slide-in-from-bottom">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden" />
            <h3 className="text-lg font-bold text-[#183B2D] text-center">اختر طريقة الدفع</h3>
            
            <div className="space-y-2">
              {[
                { id: 'jawali', name: 'محفظة جوال (Jawali)', sub: 'تحويل فوري مباشر' },
                { id: 'flosak', name: 'محفظة فلوسك (Flosak)', sub: 'حساب رقم: 711888345' },
                { id: 'onecash', name: 'محفظة ون كاش (OneCash)', sub: 'متاح على مدار الساعة' }
              ].map((w) => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWallet(w.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedWallet === w.id
                      ? 'border-[#087F6E] bg-[#E9F8F5]'
                      : 'border-[#DCE9E6] hover:border-[#19899A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedWallet === w.id ? 'border-[#087F6E] bg-[#087F6E]' : 'border-slate-300'
                    }`}>
                      {selectedWallet === w.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#183B2D]">{w.name}</div>
                      <div className="text-xs text-[#6E7A77]">{w.sub}</div>
                    </div>
                  </div>
                  <Briefcase className="w-5 h-5 text-[#087F6E]" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDemoSheet(false)}
                className="flex-1 py-3 bg-[#087F6E] text-white font-semibold rounded-xl hover:bg-[#066759] transition-all"
              >
                تأكيد ومتابعة
              </button>
              <button
                onClick={() => setShowDemoSheet(false)}
                className="py-3 px-5 border border-[#DCE9E6] text-[#6E7A77] font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
