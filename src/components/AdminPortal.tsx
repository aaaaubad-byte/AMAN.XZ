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
  FileCheck,
  Check,
  X,
  AlertTriangle,
  Wallet,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AmanLogo } from './AmanLogo';
import {
  CustomerNumber,
  Protection,
  ProtectionRequest,
  PaymentTask,
  FinancialTransaction,
  PaymentMethod
} from '../types';

interface AdminPortalProps {
  numbers: CustomerNumber[];
  protections: Protection[];
  requests: ProtectionRequest[];
  tasks: PaymentTask[];
  transactions: FinancialTransaction[];
  paymentMethods: PaymentMethod[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onCompleteTask: (taskId: string, telecomRef: string) => void;
  onRescheduleTask: (taskId: string, newDate: string, reason: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  numbers,
  protections,
  requests,
  tasks,
  transactions,
  paymentMethods,
  onApproveRequest,
  onRejectRequest,
  onCompleteTask,
  onRescheduleTask
}) => {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'tasks' | 'requests' | 'transactions' | 'settings'>('requests');
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'OVERDUE' | 'DUE' | 'DUE_SOON' | 'UPCOMING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [telecomRef, setTelecomRef] = useState('');

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter !== 'ALL' && t.urgency !== taskFilter) return false;
    if (searchQuery && !t.phone_number.includes(searchQuery) && !t.customer_name.includes(searchQuery)) return false;
    return true;
  });

  const filteredRequests = requests.filter((r) => {
    if (searchQuery && !r.phone_number.includes(searchQuery) && !r.customer_name.includes(searchQuery)) return false;
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectingRequestId || !rejectReason.trim()) return;
    onRejectRequest(rejectingRequestId, rejectReason.trim());
    setRejectingRequestId(null);
    setRejectReason('');
  };

  const handleConfirmCompleteTask = () => {
    if (!completingTaskId || !telecomRef.trim()) return;
    onCompleteTask(completingTaskId, telecomRef.trim());
    setCompletingTaskId(null);
    setTelecomRef('');
  };

  const totalRevenue = transactions
    .filter((t) => t.type === 'customer_payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'telecom_renewal_expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-3xl border border-[#DCE9E6] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[720px] text-[#183B2D] font-['Cairo',sans-serif]">
      {/* 1. Official Left/Right Sidebar matching design image */}
      <aside className="w-full md:w-64 bg-[#F7FAF9] border-b md:border-b-0 md:border-l border-[#DCE9E6] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="pb-4 border-b border-[#DCE9E6]">
            <AmanLogo size="md" />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-right">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: Shield },
              { id: 'tasks', label: 'المهام التشغيلية', icon: Calendar, badge: tasks.filter((t) => t.status === 'open').length },
              { id: 'requests', label: 'طلبات الحماية', icon: FileCheck, badge: requests.filter((r) => r.status === 'under_review').length },
              { id: 'transactions', label: 'التحويلات والمعاملات', icon: Wallet },
              { id: 'settings', label: 'طرق الدفع والإعدادات', icon: Settings }
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#087F6E] text-white shadow-xs'
                      : 'text-[#183B2D] hover:bg-[#E9F8F5] hover:text-[#087F6E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#087F6E]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-white text-[#087F6E]' : 'bg-[#E9F8F5] text-[#087F6E]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User Card */}
        <div className="pt-4 border-t border-[#DCE9E6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#087F6E] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              أم
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#183B2D]">أحمد محمد</div>
              <div className="text-[10px] text-[#087F6E] font-semibold">مدير النظام (Admin)</div>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-[#6E7A77]" />
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Navbar */}
        <header className="px-6 py-4 border-b border-[#DCE9E6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right w-full sm:w-auto">
            <h2 className="text-xl font-bold text-[#183B2D]">
              {activeNav === 'dashboard' && 'لوحة المعلومات والمؤشرات'}
              {activeNav === 'tasks' && 'المهام التشغيلية اليومية لسداد الاتصالات'}
              {activeNav === 'requests' && 'مراجعة واعتماد طلبات الحماية الجديدة'}
              {activeNav === 'transactions' && 'سجل الحركات المالية والتحويلات'}
              {activeNav === 'settings' && 'إعدادات المنظومة ومحافظ التحصيل'}
            </h2>
            <p className="text-xs text-[#6E7A77]">
              منظومة أمان • تجربة الإدارة الموحدة (Admin Experience)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الهاتف أو العميل..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] focus:outline-none focus:border-[#087F6E] focus:bg-white text-right"
              />
              <Search className="w-4 h-4 text-[#6E7A77] absolute right-2.5 top-2.5" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB: DASHBOARD OVERVIEW */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#E9F8F5] border border-[#6EE7B7] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#087F6E] font-semibold">
                    <span>إجمالي الأرقام المحمية</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#087F6E]">{protections.length}</div>
                  <div className="text-[11px] text-[#183B2D]">حمايات سارية ونشطة</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#D97706] font-semibold">
                    <span>طلبات قيد المراجعة</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#D97706]">
                    {requests.filter((r) => r.status === 'under_review').length}
                  </div>
                  <div className="text-[11px] text-[#183B2D]">تتطلب الاعتماد والتدقيق</div>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-red-600 font-semibold">
                    <span>مهام مستحقة / متأخرة</span>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-red-600">
                    {tasks.filter((t) => t.urgency === 'OVERDUE' || t.urgency === 'DUE').length}
                  </div>
                  <div className="text-[11px] text-[#183B2D]">تحتاج سداد فوري بالشركة</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7FAF9] border border-[#DCE9E6] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#183B2D] font-semibold">
                    <span>صافي الإيرادات المحصلة</span>
                    <Wallet className="w-4 h-4 text-[#087F6E]" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#183B2D]">
                    {(totalRevenue - totalExpense).toLocaleString()} YER
                  </div>
                  <div className="text-[11px] text-[#6E7A77]">إجمالي المحصل: {totalRevenue.toLocaleString()} YER</div>
                </div>
              </div>

              {/* Quick Actions & Recent Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Requests Box */}
                <div className="p-5 rounded-2xl border border-[#DCE9E6] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DCE9E6] pb-3">
                    <h3 className="font-bold text-sm text-[#183B2D]">أحدث طلبات الحماية الواردة</h3>
                    <button
                      onClick={() => setActiveNav('requests')}
                      className="text-xs text-[#087F6E] font-semibold hover:underline"
                    >
                      عرض الكل
                    </button>
                  </div>
                  <div className="space-y-2">
                    {requests.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-[#F7FAF9] border border-[#DCE9E6] flex items-center justify-between text-xs">
                        <div className="text-right">
                          <span className="font-bold font-mono text-[#183B2D]" dir="ltr">+967 {r.phone_number}</span>
                          <span className="text-[#6E7A77] block text-[10px]">{r.customer_name} • {r.provider_name_ar}</span>
                        </div>
                        <span className="py-1 px-2.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-semibold text-[10px]">
                          قيد المراجعة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Operational Tasks */}
                <div className="p-5 rounded-2xl border border-[#DCE9E6] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DCE9E6] pb-3">
                    <h3 className="font-bold text-sm text-[#183B2D]">أولويات السداد لدى شركات الاتصالات</h3>
                    <button
                      onClick={() => setActiveNav('tasks')}
                      className="text-xs text-[#087F6E] font-semibold hover:underline"
                    >
                      عرض كافة المهام
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-3 rounded-xl bg-[#F7FAF9] border border-[#DCE9E6] flex items-center justify-between text-xs">
                        <div className="text-right">
                          <span className="font-bold font-mono text-[#183B2D]" dir="ltr">+967 {t.phone_number}</span>
                          <span className="text-[#6E7A77] block text-[10px]">{t.provider_name_ar} • الدورة: {t.cycle_number}</span>
                        </div>
                        <span
                          className={`py-1 px-2.5 rounded-full font-bold text-[10px] ${
                            t.urgency === 'OVERDUE'
                              ? 'bg-red-100 text-red-700'
                              : t.urgency === 'DUE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {t.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROTECTION REQUESTS (ATOMIC APPROVAL WORKFLOW) */}
          {activeNav === 'requests' && (
            <div className="space-y-4">
              <div className="bg-[#E9F8F5] border border-[#6EE7B7] p-4 rounded-2xl text-xs text-[#183B2D] space-y-1">
                <div className="font-bold text-sm text-[#087F6E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>محرك الاعتماد الذري المعتمد (Atomic Approval Engine)</span>
                </div>
                <p>
                  عند الضغط على <strong>«اعتماد الحماية»</strong>، تنفذ قاعدة البيانات 9 عمليات ذرية مترابطة في معاملة واحدة:
                  (تحديث الطلب إلى معتمد، إنشاء لقطة الحماية السنوية 1000 ريال، تسجيل الحركة المالية، وتوليد أول مهمة سداد دورية لشركة الاتصالات).
                </p>
              </div>

              {/* Table of Requests */}
              <div className="border border-[#DCE9E6] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#F7FAF9] text-[#6E7A77] border-b border-[#DCE9E6] font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">رقم الهاتف والشركة</th>
                      <th className="py-3.5 px-4">اسم العميل ورقم هاتفه</th>
                      <th className="py-3.5 px-4">طريقة وسند الدفع</th>
                      <th className="py-3.5 px-4">المبلغ والمدة</th>
                      <th className="py-3.5 px-4">الحالة</th>
                      <th className="py-3.5 px-4 text-center">الإجراء الإداري</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE9E6]">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#183B2D]">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#087F6E]" />
                            <span dir="ltr">+967 {req.phone_number}</span>
                          </div>
                          <span className="text-[11px] text-[#6E7A77] font-normal font-sans">
                            {req.provider_name_ar}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#183B2D]">{req.customer_name}</div>
                          <div className="text-[10px] text-[#6E7A77] font-mono">{req.customer_phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#183B2D]">{req.payment_method_name_ar}</div>
                          <div className="text-[10px] font-mono text-[#087F6E]">سند: {req.transfer_reference}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold font-mono text-[#183B2D]">
                            {req.protection_value_snapshot} {req.currency_snapshot}
                          </div>
                          <div className="text-[10px] text-[#6E7A77]">{req.duration_days_snapshot} يوماً</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-[11px] font-bold ${
                              req.status === 'under_review'
                                ? 'bg-[#FEF3C7] text-[#D97706]'
                                : req.status === 'approved'
                                ? 'bg-[#E9F8F5] text-[#087F6E]'
                                : 'bg-[#FEE2E2] text-[#DC2626]'
                            }`}
                          >
                            {req.status === 'under_review' ? 'قيد المراجعة' : req.status === 'approved' ? 'معتمد' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {req.status === 'under_review' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onApproveRequest(req.id)}
                                className="py-1.5 px-3 bg-[#087F6E] hover:bg-[#066759] text-white font-semibold rounded-lg shadow-xs flex items-center gap-1 active:scale-95 transition-all text-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>اعتماد الحماية</span>
                              </button>
                              <button
                                onClick={() => setRejectingRequestId(req.id)}
                                className="py-1.5 px-2.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-semibold rounded-lg flex items-center gap-1 transition-all text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>رفض</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#6E7A77]">تم اتخاذ الإجراء</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#6E7A77]">
                          لا توجد طلبات تطابق معايير البحث الحالية
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: OPERATIONAL PAYMENT TASKS (URGENCY & RENEWALS) */}
          {activeNav === 'tasks' && (
            <div className="space-y-4">
              {/* Urgency Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'ALL', label: 'كافة المهام', count: tasks.length },
                  { id: 'OVERDUE', label: 'متأخرة (OVERDUE)', count: tasks.filter((t) => t.urgency === 'OVERDUE').length, color: 'text-red-700 bg-red-50 border-red-200' },
                  { id: 'DUE', label: 'مستحقة اليوم (DUE)', count: tasks.filter((t) => t.urgency === 'DUE').length, color: 'text-amber-800 bg-amber-50 border-amber-200' },
                  { id: 'DUE_SOON', label: 'قريبة الاستحقاق (DUE_SOON)', count: tasks.filter((t) => t.urgency === 'DUE_SOON').length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                  { id: 'UPCOMING', label: 'قادمة (UPCOMING)', count: tasks.filter((t) => t.urgency === 'UPCOMING').length }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTaskFilter(f.id as any)}
                    className={`py-2 px-3.5 rounded-xl font-bold border transition-all whitespace-nowrap flex items-center gap-2 ${
                      taskFilter === f.id
                        ? 'bg-[#087F6E] text-white border-[#087F6E]'
                        : 'bg-white border-[#DCE9E6] text-[#183B2D] hover:bg-[#F7FAF9]'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tasks Table */}
              <div className="border border-[#DCE9E6] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#F7FAF9] text-[#6E7A77] border-b border-[#DCE9E6] font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">رقم الهاتف والشركة</th>
                      <th className="py-3.5 px-4">العميل</th>
                      <th className="py-3.5 px-4">الدورة والمبلغ المقدر</th>
                      <th className="py-3.5 px-4">تاريخ الاستحقاق</th>
                      <th className="py-3.5 px-4">درجة الاستعجال</th>
                      <th className="py-3.5 px-4 text-center">إجراء السداد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE9E6]">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#183B2D]">
                          <div dir="ltr">+967 {task.phone_number}</div>
                          <span className="text-[11px] text-[#6E7A77] font-normal font-sans">
                            {task.provider_name_ar}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#183B2D]">
                          {task.customer_name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#183B2D]">الدورة رقم {task.cycle_number}</div>
                          <div className="text-[10px] text-[#087F6E] font-mono">
                            {task.amount_snapshot} {task.amount_currency}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#183B2D]">
                          {new Date(task.due_date).toLocaleDateString('ar-YE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`py-1 px-3 rounded-full text-[10px] font-bold ${
                              task.urgency === 'OVERDUE'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : task.urgency === 'DUE'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : task.urgency === 'DUE_SOON'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : task.urgency === 'COMPLETED'
                                ? 'bg-[#E9F8F5] text-[#087F6E]'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {task.status === 'open' ? (
                            <button
                              onClick={() => setCompletingTaskId(task.id)}
                              className="py-1.5 px-3 bg-[#087F6E] hover:bg-[#066759] text-white font-semibold rounded-lg shadow-xs active:scale-95 transition-all text-xs"
                            >
                              إكمال وسداد الاتصالات
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#087F6E] font-semibold">مكتملة ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#6E7A77]">
                          لا توجد مهام مطابقة للفلتر المحدد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TRANSACTIONS & REVENUE */}
          {activeNav === 'transactions' && (
            <div className="space-y-4">
              <div className="border border-[#DCE9E6] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#F7FAF9] text-[#6E7A77] border-b border-[#DCE9E6] font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">نوع الحركة</th>
                      <th className="py-3.5 px-4">المرجع والبيان</th>
                      <th className="py-3.5 px-4">المبلغ والعملة</th>
                      <th className="py-3.5 px-4">الطرف المعني</th>
                      <th className="py-3.5 px-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE9E6]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`py-1 px-2.5 rounded-full text-[10px] font-bold ${
                              tx.type === 'customer_payment'
                                ? 'bg-[#E9F8F5] text-[#087F6E]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tx.type === 'customer_payment' ? 'تحصيل من عميل' : 'مصروف تجديد اتصالات'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#183B2D]">{tx.notes}</div>
                          <div className="text-[10px] font-mono text-[#6E7A77]">مرجع: {tx.transaction_reference}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span
                            className={
                              tx.type === 'customer_payment' ? 'text-[#087F6E]' : 'text-red-600'
                            }
                          >
                            {tx.type === 'customer_payment' ? '+' : '-'} {tx.amount.toLocaleString()} {tx.currency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#183B2D] font-medium">{tx.customer_name || 'شركة الاتصالات'}</td>
                        <td className="py-3 px-4 font-mono text-[#6E7A77]">
                          {new Date(tx.created_at).toLocaleDateString('ar-YE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & PAYMENT METHODS */}
          {activeNav === 'settings' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-[#DCE9E6] bg-white space-y-4">
                <h3 className="font-bold text-base text-[#183B2D]">إدارة طرق ومحافظ الدفع المعتمدة</h3>
                <p className="text-xs text-[#6E7A77]">
                  يمكن للمدير تعديل أرقام الحسابات الرسمية أو إضافة طرق دفع جديدة تظهر تلقائياً للعميل في واجهة التطبيق.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-4 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#183B2D]">{pm.name_ar}</span>
                        <span className="w-2 h-2 rounded-full bg-[#087F6E]" />
                      </div>
                      <div className="text-xs font-mono font-bold text-[#087F6E]">حساب: {pm.account_number}</div>
                      <div className="text-[11px] text-[#6E7A77]">{pm.account_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Reject Reason Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-right space-y-4 shadow-xl border border-[#DCE9E6] animate-in zoom-in-95">
            <h3 className="font-bold text-base text-[#183B2D]">رفض طلب الحماية</h3>
            <p className="text-xs text-[#6E7A77]">يرجى ذكر سبب الرفض ليظهر للعميل في قائمة الإشعارات:</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="مثال: رقم السند غير مطابق أو المبلغ المحول ناقص..."
              className="w-full p-3 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-xs text-[#183B2D] focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center gap-2">
              <button
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs"
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => setRejectingRequestId(null)}
                className="py-2.5 px-4 border border-[#DCE9E6] text-[#6E7A77] font-semibold rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Task Modal */}
      {completingTaskId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-right space-y-4 shadow-xl border border-[#DCE9E6] animate-in zoom-in-95">
            <h3 className="font-bold text-base text-[#183B2D]">إكمال مهمة سداد الاتصالات</h3>
            <p className="text-xs text-[#6E7A77]">
              أدخل رقم إشعار أو مرجع السداد الصادر من شركة الاتصالات لتوثيق دورة الحماية الحالية:
            </p>
            <input
              type="text"
              value={telecomRef}
              onChange={(e) => setTelecomRef(e.target.value)}
              placeholder="مثال: TEL-991823"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCE9E6] bg-[#F7FAF9] text-xs font-mono font-bold text-[#183B2D] focus:outline-none focus:border-[#087F6E]"
            />
            <div className="flex items-center gap-2">
              <button
                disabled={!telecomRef.trim()}
                onClick={handleConfirmCompleteTask}
                className="flex-1 py-2.5 bg-[#087F6E] hover:bg-[#066759] text-white font-semibold rounded-xl text-xs"
              >
                تأكيد الإكمال وجدولة الدورة التالية
              </button>
              <button
                onClick={() => setCompletingTaskId(null)}
                className="py-2.5 px-4 border border-[#DCE9E6] text-[#6E7A77] font-semibold rounded-xl text-xs"
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
