// ============================================================================
// AMAN | أمان — Core TypeScript Domain Types & Interfaces
// Strictly Matched to AMAN.XZ.txt and Official Design Identity
// ============================================================================

export type UserType = 'customer' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'disabled';
export type ProtectionStatus = 'active' | 'expired';
export type RequestStatus = 'under_review' | 'approved' | 'rejected';
export type TaskStatus = 'open' | 'completed' | 'cancelled';
export type TaskUrgency = 'OVERDUE' | 'DUE' | 'DUE_SOON' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethodType = 'wallet' | 'bank' | 'exchange';
export type TransactionType = 'customer_payment' | 'telecom_renewal_expense' | 'system_adjustment';

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  status: UserStatus;
  phone?: string;
  created_at: string;
}

export interface TelecomProvider {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  number_length: number;
  prefixes: string[];
  is_active: boolean;
  color: string;
}

export interface CustomerNumber {
  id: string;
  customer_id: string;
  provider_id: string;
  phone_number: string;
  provider_name_ar: string;
  provider_code: string;
  is_active: boolean;
  active_protection?: Protection;
  has_pending_request?: boolean;
  created_at: string;
}

export interface ProtectionPlan {
  id: string;
  provider_id: string;
  name_ar: string;
  duration_days: number;
  price: number;
  currency: string;
  is_active: boolean;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name_ar: string;
  name_en?: string;
  account_number: string;
  account_name: string;
  instructions?: string;
  is_active: boolean;
}

export interface ProtectionRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_number_id: string;
  phone_number: string;
  provider_id: string;
  provider_name_ar: string;
  plan_id: string;
  plan_name_ar: string;
  payment_method_id: string;
  payment_method_name_ar: string;
  protection_value_snapshot: number;
  duration_days_snapshot: number;
  currency_snapshot: string;
  transfer_reference: string;
  payment_proof_url?: string;
  status: RequestStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Protection {
  id: string;
  customer_id: string;
  customer_number_id: string;
  phone_number: string;
  provider_id: string;
  provider_name_ar: string;
  plan_id: string;
  created_from_request_id?: string;
  price_snapshot: number;
  duration_days_snapshot: number;
  currency_snapshot: string;
  starts_at: string;
  expires_at: string;
  status: ProtectionStatus;
  remaining_days: number;
}

export interface PaymentTask {
  id: string;
  protection_id: string;
  customer_number_id: string;
  phone_number: string;
  provider_id: string;
  provider_name_ar: string;
  customer_name: string;
  task_type: 'first' | 'recurring';
  due_date: string;
  telecom_due_at: string;
  status: TaskStatus;
  amount_snapshot: number;
  amount_currency: string;
  cycle_number: number;
  urgency: TaskUrgency;
  telecom_reference?: string;
  rescheduled_from_date?: string;
  rescheduled_reason?: string;
  completed_at?: string;
  completed_by?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  reference_id?: string;
  reference_type?: string;
  customer_id?: string;
  customer_name?: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}
