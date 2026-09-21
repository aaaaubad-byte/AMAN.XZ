import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  Database, 
  ShieldAlert, 
  Table, 
  Eye, 
  Cpu, 
  Lock, 
  PlayCircle, 
  ExternalLink 
} from 'lucide-react';
import { AMAN_SQL_MIGRATION } from '../data/sqlSchema';

export const SqlMigrationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'tables' | 'rpcs' | 'views' | 'rls'>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(AMAN_SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([AMAN_SQL_MIGRATION], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'aman_supabase_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-4">
            <Database className="w-3.5 h-3.5" />
            <span>مخطط قاعدة بيانات أمان الرسمي — Supabase PostgreSQL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            ترحيل أمر بناء قاعدة البيانات (SQL Schema & RPCs)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            تم إعداد أمر SQL الكامل والشامل لإنشاء كافة الجداول، الأنواع المحصورة (Enums)، المشاهد اللحظية (Views)، الدوال الذرية المعرفة أمنياً (SECURITY DEFINER RPCs)، قواعد الأمان على مستوى السطر (RLS)، بالإضافة إلى بيانات التأسيس الأولية لمزودي الاتصالات في اليمن.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span>تم نسخ أمر SQL بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ أمر SQL بالكامل</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف SQL (.sql)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Steps to Execute in Supabase */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-emerald-600" />
          <span>خطوات ترحيل الأمر في لوحة تحكم Supabase:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
              1
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">فتح مشروع Supabase</h4>
            <p className="text-xs text-slate-500 leading-normal">
              ادخل إلى لوحة تحكم Supabase لمشروع أمان الخاص بك.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
              2
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">محرر SQL Editor</h4>
            <p className="text-xs text-slate-500 leading-normal">
              توجه إلى تبويب <span className="font-semibold text-slate-700">SQL Editor</span> من القائمة الجانبية ثم اضغط <span className="font-semibold text-slate-700">New Query</span>.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
              3
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">لصق الأمر وتنفيذه</h4>
            <p className="text-xs text-slate-500 leading-normal">
              الصق نص الأمر المنسوخ أعلاه في المحرر ثم اضغط زر <span className="font-semibold text-emerald-600">Run</span>.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mb-2">
              4
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">التحقق التلقائي</h4>
            <p className="text-xs text-slate-500 leading-normal">
              ستظهر رسالة <span className="font-semibold text-emerald-600">Success. No rows returned</span> وستكون كافة الجداول والدوال جاهزة للعمل فوراً.
            </p>
          </div>
        </div>
      </div>

      {/* Schema Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Table className="w-4 h-4 text-emerald-600" />
            <span>الجداول الأساسية</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">26</div>
          <div className="text-[11px] text-slate-400 mt-1">مع مفاتيح وعلاقات متسلسلة</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>الدوال الذرية (RPCs)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">18</div>
          <div className="text-[11px] text-slate-400 mt-1">تنفذ العمليات الحساسة في السيرفر</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>المشاهد (Views)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">5</div>
          <div className="text-[11px] text-slate-400 mt-1">حساب الأيام والحالات تلقائياً</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>سياسات الأمان (RLS)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">30+</div>
          <div className="text-[11px] text-slate-400 mt-1">عزل تام بين العميل والمدير</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>أنواع الحالات (Enums)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">9</div>
          <div className="text-[11px] text-slate-400 mt-1">تقييد دقيق لقيم الحقول</div>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-emerald-400 font-semibold">aman_supabase_schema.sql</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">{AMAN_SQL_MIGRATION.split('\n').length} سطر</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[550px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre">{AMAN_SQL_MIGRATION}</pre>
        </div>
      </div>
    </div>
  );
};
