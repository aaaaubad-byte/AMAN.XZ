import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  Layers, 
  Radio, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Principle Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          المبادئ الصارمة لمنظومة أمان (AMAN Architectural Invariants)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          تطبيق أندرويد أصيل واحد (<span className="font-semibold text-emerald-700">ONE APK</span>) يتصل بقاعدة بيانات Supabase واحدة ويدعم تجربتين مبنيتين على الأدوار (Role-Based Experiences).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Experience Card */}
          <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">تجربة العميل [CLIENT]</h3>
                <span className="text-xs text-emerald-700 font-semibold">واجهة بسيطة وواضحة</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>الرئيسية [C-HOME]:</strong> ملخص الحساب، الأرقام المحمية، الإشعارات.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>أرقامي [C-NUMBERS]:</strong> إضافة رقم، الكشف التلقائي عن الشركة بناءً على البادئة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>طلب الحماية [C-PROTECT]:</strong> اختيار الباقة، طريقة الدفع (المحافظ)، إدخال رقم الحوالة، مراجعة وإرسال.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>عداد الحماية 365 يوماً:</strong> شريط التقدم، الأيام المتبقية، حالة الحماية (سارية / منتهية).</span>
              </li>
            </ul>
          </div>

          {/* Admin Experience Card */}
          <div className="border border-slate-200 bg-slate-50/80 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">تجربة المدير [ADMIN / MANAGER]</h3>
                <span className="text-xs text-slate-500 font-semibold">لوحة تحكم تشغيلية داخل نفس التطبيق</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <span><strong>لوحة المؤشرات [A-DASHBOARD]:</strong> إحصائيات فورية، الطلبات المعلقة، المهام العاجلة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <span><strong>مراجعة الطلبات [A-REQUESTS]:</strong> الاعتماد الذري (Atomic Approval) أو الرفض مع ذكر السبب.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <span><strong>مهام السداد للاتصالات [A-TASKS]:</strong> المهام المستحقة اليوم، المتأخرة، وإعادة الجدولة والإكمال.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <span><strong>إعدادات المهام والشركات:</strong> فترات التكرار (كل 90 يوماً)، مبالغ التجديد، الباقات.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Atomic Approval Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          دورة حياة طلب الحماية والاعتماد الذري (Atomic Protection Lifecycle)
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          تتم كافة العمليات الحساسة داخل دالة تخزين ذرية (RPC) واحدة تضمن عدم حدوث أي تعارض أو بيانات غير مكتملة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>1. تقديم الطلب</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              يقوم العميل باختيار الباقة والمحفظة وإدخال رقم الإشعار. الحالة: <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">under_review</code>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>2. الاعتماد الذري</span>
            </div>
            <p className="text-xs text-blue-900/80 leading-relaxed">
              ينفذ المدير <code className="bg-blue-100 px-1 py-0.5 rounded text-[11px]">approve_protection_request</code> داخل عملية PostgreSQL واحدة (Transaction).
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. إنشاء الحماية والمهمة</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              إنشاء سجل الحماية لمدة 365 يوماً، قيد الإيراد المالي، وإنشاء أول مهمة سداد لشركة الاتصالات فوراً.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>4. المهام الدورية (90 يوم)</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              عند إكمال المدير لأي مهمة، يتم إنشاء المهمة الدورية التالية تلقائياً بعد 90 يوماً طوال فترة سريان الـ 365 يوماً.
            </p>
          </div>
        </div>
      </div>

      {/* Telecom Providers in Yemen */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          شركات الاتصالات والبادئات المدعومة تلقائياً
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          يتم الكشف التلقائي عن شركة الاتصالات بمجرد كتابة الرقم (Auto-Detection) عبر الدالة <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">detect_provider_id</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">يمن موبايل</span>
              <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-semibold">CDMA / 4G</span>
            </div>
            <div className="flex gap-1.5">
              <span className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-bold text-slate-700">77</span>
              <span className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-bold text-slate-700">78</span>
            </div>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">سبأفون</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">GSM / 4G</span>
            </div>
            <div className="flex gap-1.5">
              <span className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-bold text-slate-700">71</span>
            </div>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">يو (YOU)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">MTN سابقاً</span>
            </div>
            <div className="flex gap-1.5">
              <span className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-bold text-slate-700">73</span>
            </div>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">واي (Y)</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">Y Telecom</span>
            </div>
            <div className="flex gap-1.5">
              <span className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded font-mono font-bold text-slate-700">70</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
