import {
  TelecomProvider,
  PaymentMethod,
  ProtectionPlan,
  CustomerNumber,
  ProtectionRequest,
  Protection,
  PaymentTask,
  FinancialTransaction,
  AuditLog,
  TaskUrgency
} from '../types';

export const TELECOM_PROVIDERS: TelecomProvider[] = [
  {
    id: 'prov-ym',
    code: 'yemen_mobile',
    name_ar: 'يمن موبايل',
    name_en: 'Yemen Mobile',
    number_length: 9,
    prefixes: ['77', '78'],
    is_active: true,
    color: '#D92D20' // Red
  },
  {
    id: 'prov-sb',
    code: 'sabafon',
    name_ar: 'سبأفون',
    name_en: 'SabaFon',
    number_length: 9,
    prefixes: ['71'],
    is_active: true,
    color: '#1570EF' // Blue
  },
  {
    id: 'prov-you',
    code: 'you_telecom',
    name_ar: 'يو للاتصالات',
    name_en: 'YOU Telecom',
    number_length: 9,
    prefixes: ['73'],
    is_active: true,
    color: '#FDB022' // Amber / MTN
  },
  {
    id: 'prov-y',
    code: 'y_telecom',
    name_ar: 'واي للاتصالات',
    name_en: 'Y Telecom',
    number_length: 9,
    prefixes: ['70'],
    is_active: true,
    color: '#087F6E' // Teal
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-jawali',
    type: 'wallet',
    name_ar: 'محفظة جوال (Jawali)',
    name_en: 'Jawali Wallet',
    account_number: '777000123',
    account_name: 'منظومة أمان لحماية الأرقام',
    instructions: 'يرجى التحويل إلى حساب المحفظة وإرفاق رقم الإشعار لسرعة الاعتماد',
    is_active: true
  },
  {
    id: 'pm-flosak',
    type: 'wallet',
    name_ar: 'محفظة فلوسك (Flosak)',
    name_en: 'Flosak Wallet',
    account_number: '711888345',
    account_name: 'أمان - حساب التحصيل المعتمد',
    instructions: 'قم بإجراء التحويل وكتابة رقم الهاتف في خانة البيان',
    is_active: true
  },
  {
    id: 'pm-onecash',
    type: 'wallet',
    name_ar: 'محفظة ون كاش (OneCash)',
    name_en: 'OneCash Wallet',
    account_number: '733999456',
    account_name: 'أمان لخدمات وضمان الاتصالات',
    instructions: 'التحويل المباشر متاح 24/7 ويتم التحقق منه تلقائياً',
    is_active: true
  }
];

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'plan-annual',
    provider_id: 'prov-all',
    name_ar: 'باقة الحماية السنوية المعتمدة',
    duration_days: 365,
    price: 1000,
    currency: 'YER',
    is_active: true,
    description: 'حماية شاملة ضد السحب أو إعادة البيع لمدة 365 يوماً مع تجديدات دورية منتظمة لدى الشركة'
  }
];

export function normalizePhone(raw: string): string {
  if (!raw) return '';
  let clean = raw.replace(/[^0-9]/g, '');
  if (clean.startsWith('00967')) clean = clean.substring(5);
  else if (clean.startsWith('967')) clean = clean.substring(3);
  if (clean.length === 10 && clean.startsWith('0')) clean = clean.substring(1);
  return clean;
}

export function detectProvider(phone: string): TelecomProvider | null {
  const clean = normalizePhone(phone);
  if (clean.length !== 9) return null;
  const prefix = clean.substring(0, 2);
  return TELECOM_PROVIDERS.find(p => p.prefixes.includes(prefix)) || null;
}

export function calculateUrgency(dueDateStr: string, status: string): TaskUrgency {
  if (status === 'completed') return 'COMPLETED';
  if (status === 'cancelled') return 'CANCELLED';
  const due = new Date(dueDateStr);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'OVERDUE';
  if (diffDays === 0) return 'DUE';
  if (diffDays <= 7) return 'DUE_SOON';
  return 'UPCOMING';
}

export const INITIAL_NUMBERS: CustomerNumber[] = [
  {
    id: 'num-1',
    customer_id: 'usr-customer-1',
    provider_id: 'prov-ym',
    phone_number: '771234567',
    provider_name_ar: 'يمن موبايل',
    provider_code: 'yemen_mobile',
    is_active: true,
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'num-2',
    customer_id: 'usr-customer-1',
    provider_id: 'prov-sb',
    phone_number: '719876543',
    provider_name_ar: 'سبأفون',
    provider_code: 'sabafon',
    is_active: true,
    created_at: '2026-02-15T12:00:00Z'
  },
  {
    id: 'num-3',
    customer_id: 'usr-customer-1',
    provider_id: 'prov-you',
    phone_number: '735551234',
    provider_name_ar: 'يو للاتصالات',
    provider_code: 'you_telecom',
    is_active: true,
    created_at: '2026-03-01T08:30:00Z'
  }
];

export const INITIAL_PROTECTIONS: Protection[] = [
  {
    id: 'prot-1',
    customer_id: 'usr-customer-1',
    customer_number_id: 'num-1',
    phone_number: '771234567',
    provider_id: 'prov-ym',
    provider_name_ar: 'يمن موبايل',
    plan_id: 'plan-annual',
    price_snapshot: 1000,
    duration_days_snapshot: 365,
    currency_snapshot: 'YER',
    starts_at: '2026-01-10T10:00:00Z',
    expires_at: '2027-01-10T10:00:00Z',
    status: 'active',
    remaining_days: 111
  }
];

export const INITIAL_REQUESTS: ProtectionRequest[] = [
  {
    id: 'req-1',
    customer_id: 'usr-customer-1',
    customer_name: 'أحمد محمد الحاشدي',
    customer_phone: '771234567',
    customer_number_id: 'num-2',
    phone_number: '719876543',
    provider_id: 'prov-sb',
    provider_name_ar: 'سبأفون',
    plan_id: 'plan-annual',
    plan_name_ar: 'باقة الحماية السنوية (365 يوماً)',
    payment_method_id: 'pm-jawali',
    payment_method_name_ar: 'محفظة جوال (Jawali)',
    protection_value_snapshot: 1000,
    duration_days_snapshot: 365,
    currency_snapshot: 'YER',
    transfer_reference: 'TRX-9948201',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60',
    status: 'under_review',
    created_at: '2026-09-20T14:30:00Z'
  },
  {
    id: 'req-2',
    customer_id: 'usr-customer-2',
    customer_name: 'سامي عبد الله الصنعاني',
    customer_phone: '772233445',
    customer_number_id: 'num-ext-1',
    phone_number: '778899001',
    provider_id: 'prov-ym',
    provider_name_ar: 'يمن موبايل',
    plan_id: 'plan-annual',
    plan_name_ar: 'باقة الحماية السنوية (365 يوماً)',
    payment_method_id: 'pm-flosak',
    payment_method_name_ar: 'محفظة فلوسك (Flosak)',
    protection_value_snapshot: 1000,
    duration_days_snapshot: 365,
    currency_snapshot: 'YER',
    transfer_reference: 'FLS-400192',
    status: 'under_review',
    created_at: '2026-09-21T09:15:00Z'
  }
];

export const INITIAL_PAYMENT_TASKS: PaymentTask[] = [
  {
    id: 'task-1',
    protection_id: 'prot-1',
    customer_number_id: 'num-1',
    phone_number: '771234567',
    provider_id: 'prov-ym',
    provider_name_ar: 'يمن موبايل',
    customer_name: 'أحمد محمد الحاشدي',
    task_type: 'recurring',
    due_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days overdue
    telecom_due_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'open',
    amount_snapshot: 350,
    amount_currency: 'YER',
    cycle_number: 2,
    urgency: 'OVERDUE',
    created_at: '2026-06-10T10:00:00Z'
  },
  {
    id: 'task-2',
    protection_id: 'prot-ext-2',
    customer_number_id: 'num-ext-2',
    phone_number: '733445566',
    provider_id: 'prov-you',
    provider_name_ar: 'يو للاتصالات',
    customer_name: 'فؤاد سالم الريمي',
    task_type: 'recurring',
    due_date: new Date().toISOString(), // Today
    telecom_due_at: new Date().toISOString(),
    status: 'open',
    amount_snapshot: 400,
    amount_currency: 'YER',
    cycle_number: 1,
    urgency: 'DUE',
    created_at: '2026-07-21T08:00:00Z'
  },
  {
    id: 'task-3',
    protection_id: 'prot-ext-3',
    customer_number_id: 'num-ext-3',
    phone_number: '701122334',
    provider_id: 'prov-y',
    provider_name_ar: 'واي للاتصالات',
    customer_name: 'ماجد ناصر الحداد',
    task_type: 'first',
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days due soon
    telecom_due_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: 'open',
    amount_snapshot: 500,
    amount_currency: 'YER',
    cycle_number: 1,
    urgency: 'DUE_SOON',
    created_at: '2026-09-18T11:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    type: 'customer_payment',
    amount: 1000,
    currency: 'YER',
    customer_id: 'usr-customer-1',
    customer_name: 'أحمد محمد الحاشدي',
    transaction_reference: 'TRX-9948201',
    notes: 'سداد قيمة باقة حماية سنوية للرقم 771234567',
    created_at: '2026-01-10T10:05:00Z'
  },
  {
    id: 'tx-2',
    type: 'telecom_renewal_expense',
    amount: 350,
    currency: 'YER',
    customer_name: 'أحمد محمد الحاشدي',
    transaction_reference: 'YM-REC-88412',
    notes: 'مصاريف تجديد الدورة الأولى لشركة يمن موبايل للرقم 771234567',
    created_at: '2026-04-10T11:20:00Z'
  }
];
