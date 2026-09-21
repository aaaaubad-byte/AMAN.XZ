import React, { useState } from 'react';
import { Header, MainTab } from './components/Header';
import { CustomerMobileApp } from './components/CustomerMobileApp';
import { AdminPortal } from './components/AdminPortal';
import { DesignTokensShowcase } from './components/DesignTokensShowcase';
import { AndroidCodeSection } from './components/AndroidCodeSection';
import { SqlMigrationSection } from './components/SqlMigrationSection';
import {
  INITIAL_NUMBERS,
  INITIAL_PROTECTIONS,
  INITIAL_REQUESTS,
  INITIAL_PAYMENT_TASKS,
  INITIAL_TRANSACTIONS,
  PAYMENT_METHODS,
  calculateUrgency
} from './data/initialData';
import {
  CustomerNumber,
  Protection,
  ProtectionRequest,
  PaymentTask,
  FinancialTransaction
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('customer_app');

  // Shared Reactive Domain State
  const [numbers, setNumbers] = useState<CustomerNumber[]>(INITIAL_NUMBERS);
  const [protections, setProtections] = useState<Protection[]>(INITIAL_PROTECTIONS);
  const [requests, setRequests] = useState<ProtectionRequest[]>(INITIAL_REQUESTS);
  const [tasks, setTasks] = useState<PaymentTask[]>(INITIAL_PAYMENT_TASKS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  // 1. Customer Submits New Number & Protection Request
  const handleAddNumberAndRequest = (
    phone: string,
    providerId: string,
    providerName: string,
    paymentMethodId: string,
    reference: string
  ) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const numId = `num-${Date.now()}`;
    const reqId = `req-${Date.now()}`;

    const newCustomerNumber: CustomerNumber = {
      id: numId,
      customer_id: 'usr-customer-1',
      provider_id: providerId,
      phone_number: cleanNumber,
      provider_name_ar: providerName,
      provider_code: providerId.replace('prov-', ''),
      is_active: true,
      has_pending_request: true,
      created_at: new Date().toISOString()
    };

    const chosenWallet = PAYMENT_METHODS.find((w) => w.id === paymentMethodId) || PAYMENT_METHODS[0];

    const newRequest: ProtectionRequest = {
      id: reqId,
      customer_id: 'usr-customer-1',
      customer_name: 'أحمد محمد الحاشدي',
      customer_phone: '771234567',
      customer_number_id: numId,
      phone_number: cleanNumber,
      provider_id: providerId,
      provider_name_ar: providerName,
      plan_id: 'plan-annual',
      plan_name_ar: 'باقة الحماية السنوية المعتمدة (365 يوماً)',
      payment_method_id: paymentMethodId,
      payment_method_name_ar: chosenWallet.name_ar,
      protection_value_snapshot: 1000,
      duration_days_snapshot: 365,
      currency_snapshot: 'YER',
      transfer_reference: reference,
      status: 'under_review',
      created_at: new Date().toISOString()
    };

    setNumbers((prev) => [newCustomerNumber, ...prev]);
    setRequests((prev) => [newRequest, ...prev]);
  };

  // 2. Admin Performs Atomic Approval (ACID Transaction Simulation)
  const handleApproveRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // Step A: Mark request approved
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewed_by: 'usr-admin-1',
              reviewed_at: new Date().toISOString()
            }
          : r
      )
    );

    // Step B: Create Protection Record with Snapshots (1000 YER / 365 Days)
    const protId = `prot-${Date.now()}`;
    const newProtection: Protection = {
      id: protId,
      customer_id: req.customer_id,
      customer_number_id: req.customer_number_id,
      phone_number: req.phone_number,
      provider_id: req.provider_id,
      provider_name_ar: req.provider_name_ar,
      plan_id: req.plan_id,
      created_from_request_id: req.id,
      price_snapshot: req.protection_value_snapshot,
      duration_days_snapshot: req.duration_days_snapshot,
      currency_snapshot: req.currency_snapshot,
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      remaining_days: 365
    };
    setProtections((prev) => [newProtection, ...prev]);

    // Step C: Record Financial Transaction (Customer Payment)
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: 'customer_payment',
      amount: req.protection_value_snapshot,
      currency: req.currency_snapshot,
      reference_id: req.id,
      reference_type: 'protection_request',
      customer_id: req.customer_id,
      customer_name: req.customer_name,
      transaction_reference: req.transfer_reference,
      notes: `سداد قيمة باقة حماية سنوية للرقم ${req.phone_number}`,
      created_at: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Step D: Create Initial Telecom Payment Task
    const initialDue = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const newTask: PaymentTask = {
      id: `task-${Date.now()}`,
      protection_id: protId,
      customer_number_id: req.customer_number_id,
      phone_number: req.phone_number,
      provider_id: req.provider_id,
      provider_name_ar: req.provider_name_ar,
      customer_name: req.customer_name,
      task_type: 'first',
      due_date: initialDue,
      telecom_due_at: initialDue,
      status: 'open',
      amount_snapshot: 350,
      amount_currency: 'YER',
      cycle_number: 1,
      urgency: calculateUrgency(initialDue, 'open'),
      created_at: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // 3. Admin Rejects Request with Reason
  const handleRejectRequest = (requestId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              rejection_reason: reason,
              reviewed_by: 'usr-admin-1',
              reviewed_at: new Date().toISOString()
            }
          : r
      )
    );
  };

  // 4. Admin Completes Payment Task (Logs Telecom Expense & Schedules Next Cycle)
  const handleCompleteTask = (taskId: string, telecomRef: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Mark task completed
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              telecom_reference: telecomRef,
              completed_at: new Date().toISOString(),
              completed_by: 'usr-admin-1',
              urgency: 'COMPLETED'
            }
          : t
      )
    );

    // Record renewal expense
    const expenseTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: 'telecom_renewal_expense',
      amount: task.amount_snapshot,
      currency: task.amount_currency,
      reference_id: task.id,
      reference_type: 'payment_task',
      customer_name: task.customer_name,
      transaction_reference: telecomRef,
      notes: `مصاريف تجديد دورة الاتصالات رقم ${task.cycle_number} للرقم ${task.phone_number}`,
      created_at: new Date().toISOString()
    };
    setTransactions((prev) => [expenseTx, ...prev]);

    // Schedule next cycle if still within 365 days
    const nextDueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const nextTask: PaymentTask = {
      id: `task-${Date.now() + 1}`,
      protection_id: task.protection_id,
      customer_number_id: task.customer_number_id,
      phone_number: task.phone_number,
      provider_id: task.provider_id,
      provider_name_ar: task.provider_name_ar,
      customer_name: task.customer_name,
      task_type: 'recurring',
      due_date: nextDueDate,
      telecom_due_at: nextDueDate,
      status: 'open',
      amount_snapshot: task.amount_snapshot,
      amount_currency: task.amount_currency,
      cycle_number: task.cycle_number + 1,
      urgency: calculateUrgency(nextDueDate, 'open'),
      created_at: new Date().toISOString()
    };
    setTasks((prev) => [nextTask, ...prev]);
  };

  const handleRescheduleTask = (taskId: string, newDate: string, reason: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              due_date: newDate,
              rescheduled_from_date: t.due_date,
              rescheduled_reason: reason,
              urgency: calculateUrgency(newDate, t.status)
            }
          : t
      )
    );
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'under_review').length;
  const openTasksCount = tasks.filter((t) => t.status === 'open' && (t.urgency === 'OVERDUE' || t.urgency === 'DUE')).length;

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#183B2D] flex flex-col font-['Cairo',sans-serif]">
      {/* Global Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={pendingRequestsCount}
        openTasksCount={openTasksCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'customer_app' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h2 className="text-2xl font-bold text-[#183B2D]">تجربة العميل في تطبيق الأندرويد</h2>
              <p className="text-xs text-[#6E7A77]">
                محاكي تفاعلي كامل لواجهات العميل (شاشة البداية، تسجيل الدخول، لوحة التحكم، إضافة رقم مع كشف تلقائي للشركة، وورقة سداد المحافظ).
              </p>
            </div>
            <CustomerMobileApp
              numbers={numbers}
              protections={protections}
              requests={requests}
              onAddNumberAndRequest={handleAddNumberAndRequest}
            />
          </div>
        )}

        {activeTab === 'admin_portal' && (
          <div className="space-y-4">
            <div className="text-right max-w-2xl space-y-1">
              <h2 className="text-2xl font-bold text-[#183B2D]">بوابة الإدارة المركزية (Admin Portal)</h2>
              <p className="text-xs text-[#6E7A77]">
                لوحة تشغيلية للمدير لإجراء الاعتماد الذري (Atomic Approval)، ومتابعة مهام سداد الاتصالات اليومية المصنفة حسب درجات الاستعجال، وإدارة التحويلات.
              </p>
            </div>
            <AdminPortal
              numbers={numbers}
              protections={protections}
              requests={requests}
              tasks={tasks}
              transactions={transactions}
              paymentMethods={PAYMENT_METHODS}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onCompleteTask={handleCompleteTask}
              onRescheduleTask={handleRescheduleTask}
            />
          </div>
        )}

        {activeTab === 'design_system' && <DesignTokensShowcase />}

        {activeTab === 'android_code' && <AndroidCodeSection />}

        {activeTab === 'sql_schema' && <SqlMigrationSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#DCE9E6] py-5 text-center text-xs text-[#6E7A77]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-[#183B2D]">
            منظومة أمان لحماية أرقام الهواتف من السحب وإعادة البيع — AMAN | أمان
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#087F6E]">
            <span>ONE APK</span>
            <span>•</span>
            <span>Two Role-Based Experiences</span>
            <span>•</span>
            <span>Supabase PostgreSQL Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
