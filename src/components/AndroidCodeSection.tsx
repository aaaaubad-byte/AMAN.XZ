import React from 'react';
import { 
  FolderGit2, 
  Smartphone, 
  FileCode2, 
  Sparkles, 
  Check, 
  Clock, 
  Palette, 
  Shield, 
  Cpu 
} from 'lucide-react';

export const AndroidCodeSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Visual Identity Notice Card */}
      <div className="bg-amber-500/10 border border-amber-300/60 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Palette className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                بانتظار الهوية البصرية
              </span>
              <span className="text-xs text-slate-500">مرحلة بناء الواجهات (Phase 5)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              الهيكل البرمجي لتطبيق Android جاهز ومربوط بالكامل مع Supabase
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              بناءً على توجيهاتك: <span className="font-semibold text-slate-900">«بالنسبة للهوية البصرية سوف اعطيك صور عندما تصل إلى مرحلة بناء الواجهات»</span>.
              تم تجهيز هيكل المشروع، طبقات الاتصال بالشبكة، نماذج البيانات، إدارة الجلسات والمصادقة، وجميع الدوال الذرية. وبمجرد تزويدنا بصور الهوية البصرية سيتم تطبيق الشاشات والألوان الرسمية وشعار المنظومة.
            </p>
          </div>
        </div>
      </div>

      {/* Android Architecture Highlights */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-emerald-600" />
          <span>هيكلية مشروع تطبيق أندرويد الأصيل (Kotlin + Jetpack Compose)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>طبقة النواة والأمان (Core)</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>core/auth/SessionManager.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>core/network/SupabaseClient.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>core/network/SupabaseConfig.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>core/security/AppLockManager.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>core/security/BiometricAuth.kt</span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>طبقة البيانات والمستودع (Data)</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>data/model/Models.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>data/repository/AmanRepo.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>viewmodel/AmanViewModel.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>rbac/Permissions.kt</span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>شاشات العميل والمدير (UI)</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>screens/splash/SplashScreen.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>screens/auth/AuthScreens.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>screens/customer/CustomerScreens.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>screens/admin/AdminScreens.kt</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>components/AmanNavigation.kt</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Target Spec Summary */}
      <div className="bg-slate-900 text-white rounded-xl p-6">
        <h4 className="text-sm font-bold text-emerald-400 mb-2">
          جاهزية استلام صور الهوية البصرية:
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          يمكنك إرسال صور الهوية البصرية (الشعار، الأيقونات، الخطوط، نماذج الشاشات أو لوحة الألوان) في أي وقت عبر الدردشة، وسنقوم فوراً بدمجها في مجلد الموارد <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">app/src/main/res/drawable</code> وضبط الثيم في <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">ui/theme/Color.kt</code> و <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">Theme.kt</code> بدقة وتطابق كامل.
        </p>
      </div>
    </div>
  );
};
