-- ============================================================================
-- AMAN | أمان — Complete Supabase PostgreSQL Production Schema & RPCs
-- Reference Standard for Unified AMAN Android Application (Customer + Admin)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS (Strictly matched to AMAN Reference Spec AMAN.XZ.txt)
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE public.user_type AS ENUM ('customer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.protection_status AS ENUM ('active', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.request_status AS ENUM ('under_review', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.task_status AS ENUM ('open', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method_type AS ENUM ('wallet', 'bank', 'exchange');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.transaction_type AS ENUM ('customer_payment', 'telecom_renewal_expense', 'system_adjustment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE TABLES
-- ----------------------------------------------------------------------------

-- [1] Users (Clients & Admins)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    user_type public.user_type NOT NULL DEFAULT 'customer',
    status public.user_status NOT NULL DEFAULT 'active',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [2] Telecom Providers (Yemen Mobile, SabaFon, YOU, Y)
CREATE TABLE IF NOT EXISTS public.telecom_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    number_length INTEGER NOT NULL DEFAULT 9,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_visible_to_customer BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [3] Telecom Prefixes (77, 78, 71, 73, 70)
CREATE TABLE IF NOT EXISTS public.telecom_prefixes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.telecom_providers(id) ON DELETE CASCADE,
    prefix VARCHAR(4) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Backward compatibility alias view for provider_prefixes
CREATE OR REPLACE VIEW public.provider_prefixes AS 
SELECT id, provider_id, prefix, is_active, created_at FROM public.telecom_prefixes;

-- [4] Customer Numbers
CREATE TABLE IF NOT EXISTS public.customer_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.telecom_providers(id) ON DELETE RESTRICT,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [5] Protection Plans (1 Year / 365 Days, Default 1000 YER)
CREATE TABLE IF NOT EXISTS public.protection_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.telecom_providers(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 365,
    price NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    currency TEXT NOT NULL DEFAULT 'YER',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_visible_to_customer BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Packages alias view for protection_plans
CREATE OR REPLACE VIEW public.packages AS 
SELECT id, provider_id, name_ar AS name, duration_days, price, currency, is_active, is_visible_to_customer, sort_order, description, created_at, updated_at 
FROM public.protection_plans;

-- [6] Payment Methods (Electronic Wallets & Exchange Banks)
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type public.payment_method_type NOT NULL DEFAULT 'wallet',
    name_ar TEXT NOT NULL,
    account_number TEXT NOT NULL DEFAULT '',
    account_name TEXT NOT NULL DEFAULT '',
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [7] Protection Requests
CREATE TABLE IF NOT EXISTS public.protection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_number_id UUID NOT NULL REFERENCES public.customer_numbers(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.telecom_providers(id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES public.protection_plans(id) ON DELETE RESTRICT,
    payment_method_id UUID NOT NULL REFERENCES public.payment_methods(id) ON DELETE RESTRICT,
    protection_value_snapshot NUMERIC(12, 2) NOT NULL,
    duration_days_snapshot INTEGER NOT NULL DEFAULT 365,
    currency_snapshot TEXT NOT NULL DEFAULT 'YER',
    transfer_reference TEXT NOT NULL,
    payment_proof_url TEXT,
    status public.request_status NOT NULL DEFAULT 'under_review',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique index ensuring no duplicate pending requests for the same number
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_protection_request 
ON public.protection_requests (customer_number_id) 
WHERE status = 'under_review';

-- [8] Protections (Active Subscriptions)
CREATE TABLE IF NOT EXISTS public.protections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_number_id UUID NOT NULL REFERENCES public.customer_numbers(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.telecom_providers(id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES public.protection_plans(id) ON DELETE RESTRICT,
    created_from_request_id UUID REFERENCES public.protection_requests(id) ON DELETE SET NULL,
    price_snapshot NUMERIC(12, 2) NOT NULL,
    duration_days_snapshot INTEGER NOT NULL DEFAULT 365,
    currency_snapshot TEXT NOT NULL DEFAULT 'YER',
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status public.protection_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique partial index: strictly ONE active protection per phone number
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_protection_per_number 
ON public.protections (customer_number_id) 
WHERE status = 'active';

-- [9] Operational Payment Tasks (Internal Admin Only)
CREATE TABLE IF NOT EXISTS public.payment_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protection_id UUID NOT NULL REFERENCES public.protections(id) ON DELETE CASCADE,
    customer_number_id UUID NOT NULL REFERENCES public.customer_numbers(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.telecom_providers(id) ON DELETE SET NULL,
    task_type TEXT NOT NULL DEFAULT 'first', -- 'first' or 'recurring'
    due_date TIMESTAMPTZ NOT NULL,
    telecom_due_at TIMESTAMPTZ,
    status public.task_status NOT NULL DEFAULT 'open',
    amount_snapshot NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amount_currency TEXT NOT NULL DEFAULT 'YER',
    cycle_number INTEGER NOT NULL DEFAULT 1,
    telecom_reference TEXT,
    rescheduled_from_date TIMESTAMPTZ,
    rescheduled_reason TEXT,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint preventing duplicate next-task cycles for the same protection
CREATE UNIQUE INDEX IF NOT EXISTS uq_task_cycle_per_protection 
ON public.payment_tasks (protection_id, cycle_number) 
WHERE status <> 'cancelled';

-- [10] Task Settings per Telecom Provider
CREATE TABLE IF NOT EXISTS public.task_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL UNIQUE REFERENCES public.telecom_providers(id) ON DELETE CASCADE,
    first_task_enabled BOOLEAN NOT NULL DEFAULT true,
    first_task_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    recurring_task_enabled BOOLEAN NOT NULL DEFAULT true,
    recurring_task_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    interval_days INTEGER NOT NULL DEFAULT 90, -- Default 90 days recurring cycle
    visibility_days_before INTEGER NOT NULL DEFAULT 7, -- Default 7 days before due date
    manual_reschedule_enabled BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [11] Financial Transactions (Customer payments & Telecom expenses)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type public.transaction_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'YER',
    reference_id UUID,
    reference_type TEXT,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    transaction_reference TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [12] Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL DEFAULT 'customer', -- 'customer' or 'admin'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [13] Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details TEXT NOT NULL,
    before_data JSONB,
    after_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [14] State Transition Logs (Strict requirement for state change auditing)
CREATE TABLE IF NOT EXISTS public.state_transition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'protection_request', 'protection', 'payment_task'
    entity_id UUID NOT NULL,
    from_state TEXT NOT NULL,
    to_state TEXT NOT NULL,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- [15] System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type, status);
CREATE INDEX IF NOT EXISTS idx_customer_numbers_customer ON public.customer_numbers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_numbers_phone ON public.customer_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_telecom_prefixes_prefix ON public.telecom_prefixes(prefix);
CREATE INDEX IF NOT EXISTS idx_protection_requests_status ON public.protection_requests(status);
CREATE INDEX IF NOT EXISTS idx_protection_requests_customer ON public.protection_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_protections_customer ON public.protections(customer_id);
CREATE INDEX IF NOT EXISTS idx_protections_status_expires ON public.protections(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_payment_tasks_status_due ON public.payment_tasks(status, due_date);
CREATE INDEX IF NOT EXISTS idx_payment_tasks_protection ON public.payment_tasks(protection_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_state_transition_logs_entity ON public.state_transition_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 4. SECURITY & ANTI-ESCALATION TRIGGERS
-- ----------------------------------------------------------------------------

-- Check if current authenticated caller is a verified active admin
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND user_type = 'admin' AND status = 'active'
    );
$$;

-- Prevent non-admins from escalating their role or modifying critical account properties
CREATE OR REPLACE FUNCTION public.prevent_user_self_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
    -- If database superuser or an authenticated admin is updating, allow
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    -- Prevent non-admin user from changing user_type
    IF NEW.user_type <> OLD.user_type THEN
        RAISE EXCEPTION 'غير مصرح لك بتغيير رتبة الحساب أو صلاحيات الإدارة' USING ERRCODE = '42501';
    END IF;

    -- Prevent non-admin user from changing status
    IF NEW.status <> OLD.status THEN
        RAISE EXCEPTION 'غير مصرح لك بتعديل حالة الحساب' USING ERRCODE = '42501';
    END IF;

    -- Prevent modifying user id
    IF NEW.id <> OLD.id THEN
        RAISE EXCEPTION 'لا يمكن تغيير معرّف الحساب' USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.users;
CREATE TRIGGER trg_prevent_privilege_escalation
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_user_self_privilege_escalation();

-- Auto-register user from auth.users (Forces user_type = 'customer' on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        user_type,
        status,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'customer', -- STRICT DEFAULT: Clients can NEVER register themselves as admin
        'active',
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 5. PHONE NORMALIZATION & TELECOM DETECTION FUNCTIONS
-- ----------------------------------------------------------------------------

-- Normalizes Yemeni phone number: removes +967, 00967, leading 0, spaces, dashes
CREATE OR REPLACE FUNCTION public.normalize_phone(p_raw TEXT)
RETURNS TEXT
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    v_clean TEXT;
BEGIN
    IF p_raw IS NULL THEN RETURN NULL; END IF;
    v_clean := regexp_replace(p_raw, '[^0-9]', '', 'g');
    
    IF v_clean LIKE '00967%' THEN
        v_clean := substring(v_clean from 6);
    ELSIF v_clean LIKE '967%' THEN
        v_clean := substring(v_clean from 4);
    END IF;
    
    IF length(v_clean) = 10 AND v_clean LIKE '0%' THEN
        v_clean := substring(v_clean from 2);
    END IF;
    
    RETURN v_clean;
END;
$$;

-- Detects provider ID from prefix automatically; customers never choose provider
CREATE OR REPLACE FUNCTION public.detect_provider_id(p_phone TEXT)
RETURNS UUID
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_normalized TEXT;
    v_prefix VARCHAR(4);
    v_provider_id UUID;
BEGIN
    v_normalized := public.normalize_phone(p_phone);
    
    IF length(v_normalized) <> 9 THEN
        RETURN NULL;
    END IF;
    
    v_prefix := substring(v_normalized from 1 for 2);
    
    SELECT tp.provider_id INTO v_provider_id
    FROM public.telecom_prefixes tp
    WHERE tp.prefix = v_prefix AND tp.is_active = true;
    
    RETURN v_provider_id;
END;
$$;

-- Client helper to detect provider info without selecting
CREATE OR REPLACE FUNCTION public.detect_phone_info(p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_normalized TEXT;
    v_prefix VARCHAR(4);
    v_provider public.telecom_providers%ROWTYPE;
BEGIN
    v_normalized := public.normalize_phone(p_phone);
    
    IF length(v_normalized) <> 9 THEN
        RETURN jsonb_build_object('is_valid', false, 'error', 'يجب أن يتكون رقم الهاتف من 9 أرقام');
    END IF;
    
    v_prefix := substring(v_normalized from 1 for 2);
    
    SELECT p.* INTO v_provider
    FROM public.telecom_prefixes tp
    JOIN public.telecom_providers p ON p.id = tp.provider_id
    WHERE tp.prefix = v_prefix AND tp.is_active = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('is_valid', false, 'error', 'بادئة الرقم غير تابعة لأي شركة اتصالات مدعومة');
    END IF;
    
    RETURN jsonb_build_object(
        'is_valid', true,
        'normalized_number', v_normalized,
        'prefix', v_prefix,
        'provider_id', v_provider.id,
        'provider_name_ar', v_provider.name_ar,
        'provider_code', v_provider.code
    );
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. BUSINESS LOGIC RPCS (CUSTOMER WORKFLOW)
-- ----------------------------------------------------------------------------

-- Add customer number: verifies ownership, normalizes, detects provider automatically
CREATE OR REPLACE FUNCTION public.add_customer_number(p_number TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_clean_number TEXT;
    v_provider_id UUID;
    v_new_id UUID;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'يجب تسجيل الدخول لإضافة رقم' USING ERRCODE = '42501';
    END IF;

    v_clean_number := public.normalize_phone(p_number);
    
    IF length(v_clean_number) <> 9 THEN
        RAISE EXCEPTION 'رقم الهاتف غير صالح، يجب أن يتكون من 9 أرقام' USING ERRCODE = '22023';
    END IF;

    v_provider_id := public.detect_provider_id(v_clean_number);
    IF v_provider_id IS NULL THEN
        RAISE EXCEPTION 'عفواً، بادئة الرقم غير مدعومة حالياً من شركات الاتصالات المعتمدة' USING ERRCODE = '22023';
    END IF;

    -- Check if number already registered
    IF EXISTS (SELECT 1 FROM public.customer_numbers WHERE phone_number = v_clean_number) THEN
        RAISE EXCEPTION 'هذا الرقم مسجل بالفعل في منظومة أمان' USING ERRCODE = '23505';
    END IF;

    INSERT INTO public.customer_numbers (
        customer_id,
        provider_id,
        phone_number,
        is_active
    ) VALUES (
        auth.uid(),
        v_provider_id,
        v_clean_number,
        true
    ) RETURNING id INTO v_new_id;

    -- Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        auth.uid(),
        'add_customer_number',
        'customer_number',
        v_new_id,
        'إضافة رقم هاتف جديد: ' || v_clean_number
    );

    RETURN v_new_id;
END;
$$;

-- Submit protection request: validates ownership, plan, active status, prevents duplicate active/pending
CREATE OR REPLACE FUNCTION public.submit_protection_request(
    p_customer_number_id UUID,
    p_plan_id UUID,
    p_payment_method_id UUID,
    p_transfer_reference TEXT,
    p_payment_proof_url TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_num public.customer_numbers%ROWTYPE;
    v_plan public.protection_plans%ROWTYPE;
    v_pm public.payment_methods%ROWTYPE;
    v_req_id UUID;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'يجب تسجيل الدخول لتقديم طلب حماية' USING ERRCODE = '42501';
    END IF;

    -- Idempotency check
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_req_id FROM public.protection_requests WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
            RETURN v_req_id;
        END IF;
    END IF;

    -- Verify Customer Number Ownership
    SELECT * INTO v_num FROM public.customer_numbers 
    WHERE id = p_customer_number_id AND customer_id = auth.uid();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'الرقم غير موجود أو لا ينتمي لحسابك' USING ERRCODE = 'P0002';
    END IF;

    -- Rule: Cannot submit if active protection exists
    IF EXISTS (
        SELECT 1 FROM public.protections 
        WHERE customer_number_id = p_customer_number_id 
          AND status = 'active' 
          AND expires_at > now()
    ) THEN
        RAISE EXCEPTION 'هذا الرقم محمي بالفعل، ولا يمكن تقديم طلب حماية جديد حتى يقترب موعد انتهائه' USING ERRCODE = '23505';
    END IF;

    -- Rule: Cannot submit if pending request already exists
    IF EXISTS (
        SELECT 1 FROM public.protection_requests 
        WHERE customer_number_id = p_customer_number_id 
          AND status = 'under_review'
    ) THEN
        RAISE EXCEPTION 'يوجد طلب حماية قيد المراجعة بالفعل لهذا الرقم' USING ERRCODE = '23505';
    END IF;

    -- Verify Plan & Provider Match
    SELECT * INTO v_plan FROM public.protection_plans WHERE id = p_plan_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'باقة الحماية المختارة غير صالحة أو غير نشطة' USING ERRCODE = 'P0002';
    END IF;

    IF v_plan.provider_id <> v_num.provider_id THEN
        RAISE EXCEPTION 'الباقة المختارة لا تتطابق مع شركة اتصالات الرقم' USING ERRCODE = '22023';
    END IF;

    -- Verify Payment Method
    SELECT * INTO v_pm FROM public.payment_methods WHERE id = p_payment_method_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'طريقة السداد المختارة غير متوفرة' USING ERRCODE = 'P0002';
    END IF;

    IF p_transfer_reference IS NULL OR trim(p_transfer_reference) = '' THEN
        RAISE EXCEPTION 'يجب إدخال رقم إشعار أو مرجع الحوالة' USING ERRCODE = '22023';
    END IF;

    -- Insert Protection Request
    INSERT INTO public.protection_requests (
        customer_id,
        customer_number_id,
        provider_id,
        plan_id,
        payment_method_id,
        protection_value_snapshot,
        duration_days_snapshot,
        currency_snapshot,
        transfer_reference,
        payment_proof_url,
        status,
        idempotency_key
    ) VALUES (
        auth.uid(),
        p_customer_number_id,
        v_num.provider_id,
        v_plan.id,
        v_pm.id,
        v_plan.price,
        v_plan.duration_days,
        v_plan.currency,
        trim(p_transfer_reference),
        p_payment_proof_url,
        'under_review',
        p_idempotency_key
    ) RETURNING id INTO v_req_id;

    -- Log State Transition
    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'protection_request',
        v_req_id,
        'none',
        'under_review',
        auth.uid(),
        'تقديم طلب حماية جديد'
    );

    -- Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        auth.uid(),
        'submit_protection_request',
        'protection_request',
        v_req_id,
        'تقديم طلب حماية للرقم ' || v_num.phone_number || ' - باقة: ' || v_plan.name_ar
    );

    RETURN v_req_id;
END;
$$;

-- ----------------------------------------------------------------------------
-- 7. ATOMIC APPROVAL & ADMIN OPERATIONS RPCS
-- ----------------------------------------------------------------------------

-- ATOMIC APPROVAL: Executes all operations in ONE single unyielding transaction
CREATE OR REPLACE FUNCTION public.approve_protection_request(p_request_id UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_req public.protection_requests%ROWTYPE;
    v_num public.customer_numbers%ROWTYPE;
    v_protection_id UUID;
    v_task_settings public.task_settings%ROWTYPE;
    v_first_task_id UUID;
    v_starts_at TIMESTAMPTZ;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Strict Admin Authorization Check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'صلاحيات المدير مطلوبة لتنفيذ هذا الإجراء' USING ERRCODE = '42501';
    END IF;

    -- Row Lock on Request
    SELECT * INTO v_req FROM public.protection_requests
    WHERE id = p_request_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'طلب الحماية غير موجود' USING ERRCODE = 'P0002';
    END IF;

    IF v_req.status <> 'under_review' THEN
        RAISE EXCEPTION 'الطلب ليس في حالة قيد المراجعة (الحالة الحالية: %)', v_req.status USING ERRCODE = '22023';
    END IF;

    -- Fetch Phone Number Row
    SELECT * INTO v_num FROM public.customer_numbers WHERE id = v_req.customer_number_id;

    -- Rule: Double-check that no active protection exists for this phone number
    IF EXISTS (
        SELECT 1 FROM public.protections
        WHERE customer_number_id = v_req.customer_number_id
          AND status = 'active'
          AND expires_at > now()
    ) THEN
        RAISE EXCEPTION 'يوجد حماية نشطة سارية بالفعل لهذا الرقم' USING ERRCODE = '23505';
    END IF;

    -- 1. State Transition for Request
    UPDATE public.protection_requests
    SET status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = v_req.id;

    -- 2. State Transition Log for Request
    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'protection_request',
        v_req.id,
        'under_review',
        'approved',
        auth.uid(),
        'اعتماد طلب الحماية من قبل المدير'
    );

    -- 3. Calculate Protection Dates
    v_starts_at := now();
    v_expires_at := v_starts_at + make_interval(days => v_req.duration_days_snapshot);

    -- 4. Create Protection Record with Immutable Historical Snapshots
    INSERT INTO public.protections (
        customer_id,
        customer_number_id,
        provider_id,
        plan_id,
        created_from_request_id,
        price_snapshot,
        duration_days_snapshot,
        currency_snapshot,
        starts_at,
        expires_at,
        status
    ) VALUES (
        v_req.customer_id,
        v_req.customer_number_id,
        v_req.provider_id,
        v_req.plan_id,
        v_req.id,
        v_req.protection_value_snapshot,
        v_req.duration_days_snapshot,
        v_req.currency_snapshot,
        v_starts_at,
        v_expires_at,
        'active'
    ) RETURNING id INTO v_protection_id;

    -- 5. State Transition Log for Protection
    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'protection',
        v_protection_id,
        'none',
        'active',
        auth.uid(),
        'تفعيل الحماية السنوية'
    );

    -- 6. Record Customer Payment in Financial Transactions
    INSERT INTO public.financial_transactions (
        type,
        amount,
        currency,
        reference_id,
        reference_type,
        customer_id,
        payment_method_id,
        transaction_reference,
        notes,
        created_by
    ) VALUES (
        'customer_payment',
        v_req.protection_value_snapshot,
        v_req.currency_snapshot,
        v_protection_id,
        'protection',
        v_req.customer_id,
        v_req.payment_method_id,
        v_req.transfer_reference,
        'سداد قيمة باقة حماية للرقم ' || v_num.phone_number,
        auth.uid()
    );

    -- 7. Check Task Settings & Atomically Create First Task if Enabled
    SELECT * INTO v_task_settings FROM public.task_settings
    WHERE provider_id = v_req.provider_id AND is_active = true;

    IF FOUND AND v_task_settings.first_task_enabled THEN
        INSERT INTO public.payment_tasks (
            protection_id,
            customer_number_id,
            provider_id,
            task_type,
            due_date,
            telecom_due_at,
            status,
            amount_snapshot,
            amount_currency,
            cycle_number
        ) VALUES (
            v_protection_id,
            v_req.customer_number_id,
            v_req.provider_id,
            'first',
            v_starts_at,
            v_starts_at,
            'open',
            v_task_settings.first_task_amount,
            'YER',
            1
        ) RETURNING id INTO v_first_task_id;

        INSERT INTO public.state_transition_logs (
            entity_type,
            entity_id,
            from_state,
            to_state,
            actor_id,
            reason
        ) VALUES (
            'payment_task',
            v_first_task_id,
            'none',
            'open',
            auth.uid(),
            'إنشاء المهمة التشغيلية الأولى تلقائياً عند اعتماد الحماية'
        );
    END IF;

    -- 8. Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        after_data,
        details
    ) VALUES (
        auth.uid(),
        'approve_protection_request',
        'protection_request',
        v_req.id,
        jsonb_build_object('protection_id', v_protection_id, 'first_task_id', v_first_task_id),
        'اعتماد طلب الحماية وتفعيل اشتراك الحماية للرقم: ' || v_num.phone_number
    );

    -- 9. Notification to Customer
    INSERT INTO public.notifications (
        recipient_id,
        recipient_type,
        title,
        message,
        type,
        metadata
    ) VALUES (
        v_req.customer_id,
        'customer',
        'تم تفعيل حماية رقمك بنجاح',
        'تم اعتماد طلبك وتفعيل حماية الرقم ' || v_num.phone_number || ' بنجاح لمدة ' || v_req.duration_days_snapshot || ' يوماً.',
        'request_approved',
        jsonb_build_object('protection_id', v_protection_id, 'customer_number_id', v_req.customer_number_id)
    );

    RETURN v_protection_id;
END;
$$;

-- REJECT PROTECTION REQUEST
CREATE OR REPLACE FUNCTION public.reject_protection_request(
    p_request_id UUID,
    p_rejection_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_req public.protection_requests%ROWTYPE;
    v_phone TEXT;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'صلاحيات المدير مطلوبة لتنفيذ هذا الإجراء' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_req FROM public.protection_requests
    WHERE id = p_request_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'طلب الحماية غير موجود' USING ERRCODE = 'P0002';
    END IF;

    IF v_req.status <> 'under_review' THEN
        RAISE EXCEPTION 'الطلب ليس في حالة قيد المراجعة' USING ERRCODE = '22023';
    END IF;

    IF p_rejection_reason IS NULL OR trim(p_rejection_reason) = '' THEN
        RAISE EXCEPTION 'يجب تحديد سبب الرفض' USING ERRCODE = '22023';
    END IF;

    SELECT phone_number INTO v_phone FROM public.customer_numbers WHERE id = v_req.customer_number_id;

    UPDATE public.protection_requests
    SET status = 'rejected',
        rejection_reason = trim(p_rejection_reason),
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = v_req.id;

    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'protection_request',
        v_req.id,
        'under_review',
        'rejected',
        auth.uid(),
        p_rejection_reason
    );

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        after_data,
        details
    ) VALUES (
        auth.uid(),
        'reject_protection_request',
        'protection_request',
        v_req.id,
        jsonb_build_object('rejection_reason', p_rejection_reason),
        'رفض طلب الحماية للرقم: ' || COALESCE(v_phone, '')
    );

    INSERT INTO public.notifications (
        recipient_id,
        recipient_type,
        title,
        message,
        type,
        metadata
    ) VALUES (
        v_req.customer_id,
        'customer',
        'تحديث بشأن طلب الحماية',
        'عفواً، تم رفض طلب حماية الرقم ' || COALESCE(v_phone, '') || ' للأسباب التالية: ' || p_rejection_reason,
        'request_rejected',
        jsonb_build_object('request_id', v_req.id)
    );

    RETURN true;
END;
$$;

-- ----------------------------------------------------------------------------
-- 8. PAYMENT TASK LIFECYCLE & URGENCY LOGIC
-- ----------------------------------------------------------------------------

-- Calculates urgency according to the exact specification formula:
-- difference < 0  -> OVERDUE
-- difference = 0  -> DUE
-- difference <= 7 -> DUE_SOON
-- otherwise       -> UPCOMING
CREATE OR REPLACE FUNCTION public.calculate_task_urgency(
    p_due_date TIMESTAMPTZ,
    p_status public.task_status
)
RETURNS TEXT
LANGUAGE sql IMMUTABLE AS $$
    SELECT CASE
        WHEN p_status = 'completed' THEN 'COMPLETED'
        WHEN p_status = 'cancelled' THEN 'CANCELLED'
        WHEN (p_due_date::date - CURRENT_DATE) < 0 THEN 'OVERDUE'
        WHEN (p_due_date::date - CURRENT_DATE) = 0 THEN 'DUE'
        WHEN (p_due_date::date - CURRENT_DATE) <= 7 THEN 'DUE_SOON'
        ELSE 'UPCOMING'
    END;
$$;

-- COMPLETE PAYMENT TASK: COMPLETED is final. Triggers next recurring task.
CREATE OR REPLACE FUNCTION public.complete_payment_task(
    p_task_id UUID,
    p_telecom_reference TEXT
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_task public.payment_tasks%ROWTYPE;
    v_prot public.protections%ROWTYPE;
    v_task_settings public.task_settings%ROWTYPE;
    v_next_due_date TIMESTAMPTZ;
    v_next_task_id UUID;
    v_phone TEXT;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'صلاحيات المدير مطلوبة لتنفيذ هذا الإجراء' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_task FROM public.payment_tasks
    WHERE id = p_task_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'المهمة غير موجودة' USING ERRCODE = 'P0002';
    END IF;

    -- Invariant: COMPLETED is final
    IF v_task.status = 'completed' THEN
        RAISE EXCEPTION 'المهمة مكتملة بالفعل ولا يمكن إكمالها مرة أخرى' USING ERRCODE = '22023';
    END IF;

    -- Invariant: CANCELLED is final, cannot be completed
    IF v_task.status = 'cancelled' THEN
        RAISE EXCEPTION 'لا يمكن إكمال مهمة ملغاة' USING ERRCODE = '22023';
    END IF;

    IF p_telecom_reference IS NULL OR trim(p_telecom_reference) = '' THEN
        RAISE EXCEPTION 'يجب إدخال الرقم المرجعي أو إيصال السداد لشركة الاتصالات' USING ERRCODE = '22023';
    END IF;

    SELECT * INTO v_prot FROM public.protections WHERE id = v_task.protection_id;
    SELECT phone_number INTO v_phone FROM public.customer_numbers WHERE id = v_task.customer_number_id;

    -- Update Task to Completed
    UPDATE public.payment_tasks
    SET status = 'completed',
        completed_at = now(),
        completed_by = auth.uid(),
        telecom_reference = trim(p_telecom_reference),
        updated_at = now()
    WHERE id = v_task.id;

    -- State Transition Log
    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'payment_task',
        v_task.id,
        v_task.status::text,
        'completed',
        auth.uid(),
        'إكمال سداد المهمة لشركة الاتصالات - المرجع: ' || trim(p_telecom_reference)
    );

    -- Record Operational Telecom Renewal Expense
    IF v_task.amount_snapshot > 0 THEN
        INSERT INTO public.financial_transactions (
            type,
            amount,
            currency,
            reference_id,
            reference_type,
            customer_id,
            notes,
            created_by
        ) VALUES (
            'telecom_renewal_expense',
            v_task.amount_snapshot,
            v_task.amount_currency,
            v_task.id,
            'payment_task',
            v_prot.customer_id,
            'سداد مصاريف تجديد لشركة الاتصالات للرقم: ' || COALESCE(v_phone, ''),
            auth.uid()
        );
    END IF;

    -- Check Next Task Creation Rules
    SELECT * INTO v_task_settings FROM public.task_settings
    WHERE provider_id = v_task.provider_id AND is_active = true;

    IF FOUND AND v_task_settings.recurring_task_enabled AND v_prot.status = 'active' THEN
        -- Calculate next cycle due date
        v_next_due_date := v_task.due_date + make_interval(days => v_task_settings.interval_days);

        -- Invariant: Next task must fall within the protection period
        IF v_next_due_date < v_prot.expires_at THEN
            -- Invariant: Prevent duplicate next-task creation
            IF NOT EXISTS (
                SELECT 1 FROM public.payment_tasks
                WHERE protection_id = v_task.protection_id
                  AND cycle_number = v_task.cycle_number + 1
                  AND status <> 'cancelled'
            ) THEN
                INSERT INTO public.payment_tasks (
                    protection_id,
                    customer_number_id,
                    provider_id,
                    task_type,
                    due_date,
                    telecom_due_at,
                    status,
                    amount_snapshot,
                    amount_currency,
                    cycle_number
                ) VALUES (
                    v_task.protection_id,
                    v_task.customer_number_id,
                    v_task.provider_id,
                    'recurring',
                    v_next_due_date,
                    v_next_due_date,
                    'open',
                    v_task_settings.recurring_task_amount,
                    'YER',
                    v_task.cycle_number + 1
                ) RETURNING id INTO v_next_task_id;

                INSERT INTO public.state_transition_logs (
                    entity_type,
                    entity_id,
                    from_state,
                    to_state,
                    actor_id,
                    reason
                ) VALUES (
                    'payment_task',
                    v_next_task_id,
                    'none',
                    'open',
                    auth.uid(),
                    'إنشاء المهمة الدورية التالية (دورة ' || (v_task.cycle_number + 1) || ')'
                );
            END IF;
        END IF;
    END IF;

    -- Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        after_data,
        details
    ) VALUES (
        auth.uid(),
        'complete_payment_task',
        'payment_task',
        v_task.id,
        jsonb_build_object('telecom_reference', p_telecom_reference, 'next_task_id', v_next_task_id),
        'إكمال مهمة سداد الاتصالات للرقم: ' || COALESCE(v_phone, '')
    );

    RETURN v_next_task_id;
END;
$$;

-- RESCHEDULE PAYMENT TASK
CREATE OR REPLACE FUNCTION public.reschedule_payment_task(
    p_task_id UUID,
    p_new_due_date TIMESTAMPTZ,
    p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_task public.payment_tasks%ROWTYPE;
    v_settings public.task_settings%ROWTYPE;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'صلاحيات المدير مطلوبة لتنفيذ هذا الإجراء' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_task FROM public.payment_tasks
    WHERE id = p_task_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'المهمة غير موجودة' USING ERRCODE = 'P0002';
    END IF;

    IF v_task.status IN ('completed', 'cancelled') THEN
        RAISE EXCEPTION 'لا يمكن إعادة جدولة مهمة مكتملة أو ملغاة' USING ERRCODE = '22023';
    END IF;

    -- Check if provider settings allow manual reschedule
    SELECT * INTO v_settings FROM public.task_settings WHERE provider_id = v_task.provider_id;
    IF FOUND AND NOT v_settings.manual_reschedule_enabled THEN
        RAISE EXCEPTION 'إعادة الجدولة اليدوية غير مفعلة لشركة الاتصالات هذه' USING ERRCODE = '22023';
    END IF;

    IF p_new_due_date IS NULL OR p_new_due_date <= now() - interval '1 hour' THEN
        RAISE EXCEPTION 'تاريخ الجدولة الجديد غير صالح' USING ERRCODE = '22023';
    END IF;

    UPDATE public.payment_tasks
    SET rescheduled_from_date = v_task.due_date,
        due_date = p_new_due_date,
        telecom_due_at = p_new_due_date,
        rescheduled_reason = p_reason,
        updated_at = now()
    WHERE id = v_task.id;

    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason,
        metadata
    ) VALUES (
        'payment_task',
        v_task.id,
        v_task.status::text,
        v_task.status::text,
        auth.uid(),
        'إعادة جدولة موعد المهمة: ' || COALESCE(p_reason, ''),
        jsonb_build_object('old_date', v_task.due_date, 'new_date', p_new_due_date)
    );

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        after_data,
        details
    ) VALUES (
        auth.uid(),
        'reschedule_payment_task',
        'payment_task',
        v_task.id,
        jsonb_build_object('old_date', v_task.due_date, 'new_date', p_new_due_date, 'reason', p_reason),
        'إعادة جدولة المهمة التشغيلية'
    );

    RETURN true;
END;
$$;

-- CANCEL PAYMENT TASK: CANCELLED is final.
CREATE OR REPLACE FUNCTION public.cancel_payment_task(
    p_task_id UUID,
    p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_task public.payment_tasks%ROWTYPE;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'صلاحيات المدير مطلوبة لتنفيذ هذا الإجراء' USING ERRCODE = '42501';
    END IF;

    SELECT * INTO v_task FROM public.payment_tasks
    WHERE id = p_task_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'المهمة غير موجودة' USING ERRCODE = 'P0002';
    END IF;

    IF v_task.status = 'completed' THEN
        RAISE EXCEPTION 'لا يمكن إلغاء مهمة تم إكمالها وسدادها' USING ERRCODE = '22023';
    END IF;

    IF v_task.status = 'cancelled' THEN
        RETURN true;
    END IF;

    UPDATE public.payment_tasks
    SET status = 'cancelled',
        cancelled_at = now(),
        cancelled_by = auth.uid(),
        rescheduled_reason = p_reason,
        updated_at = now()
    WHERE id = v_task.id;

    INSERT INTO public.state_transition_logs (
        entity_type,
        entity_id,
        from_state,
        to_state,
        actor_id,
        reason
    ) VALUES (
        'payment_task',
        v_task.id,
        v_task.status::text,
        'cancelled',
        auth.uid(),
        COALESCE(p_reason, 'إلغاء المهمة')
    );

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        after_data,
        details
    ) VALUES (
        auth.uid(),
        'cancel_payment_task',
        'payment_task',
        v_task.id,
        jsonb_build_object('reason', p_reason),
        'إلغاء المهمة التشغيلية'
    );

    RETURN true;
END;
$$;

-- ----------------------------------------------------------------------------
-- 9. REPORTING & VIEW DEFINITIONS
-- ----------------------------------------------------------------------------

-- Customer Overview View (Calculates 'needs_renewal' dynamically)
CREATE OR REPLACE VIEW public.customer_overview AS
SELECT 
    cn.id AS customer_number_id,
    cn.customer_id,
    cn.phone_number,
    tp.id AS provider_id,
    tp.name_ar AS provider_name,
    tp.code AS provider_code,
    p.id AS active_protection_id,
    p.starts_at,
    p.expires_at,
    p.status AS stored_protection_status,
    CASE 
        WHEN p.id IS NULL THEN 'unprotected'
        WHEN p.status = 'active' AND p.expires_at <= now() THEN 'expired'
        WHEN p.status = 'active' AND p.expires_at - now() <= interval '30 days' THEN 'needs_renewal'
        WHEN p.status = 'active' THEN 'active'
        ELSE 'expired'
    END AS display_status,
    COALESCE(
        CASE 
            WHEN p.id IS NOT NULL AND p.status = 'active' AND p.expires_at > now() 
            THEN GREATEST(0, (p.expires_at::date - CURRENT_DATE))
            ELSE 0 
        END, 
        0
    ) AS remaining_days,
    EXISTS (
        SELECT 1 FROM public.protection_requests pr 
        WHERE pr.customer_number_id = cn.id AND pr.status = 'under_review'
    ) AS has_pending_request
FROM public.customer_numbers cn
JOIN public.telecom_providers tp ON tp.id = cn.provider_id
LEFT JOIN public.protections p ON p.customer_number_id = cn.id AND p.status = 'active' AND p.expires_at > now();

-- Operational Tasks View with Exact Urgency Formula
CREATE OR REPLACE VIEW public.admin_payment_tasks AS
SELECT 
    pt.id,
    pt.protection_id,
    pt.customer_number_id,
    pt.provider_id,
    u.full_name AS customer_name,
    u.email AS customer_email,
    cn.phone_number,
    tp.name_ar AS provider_name,
    tp.code AS provider_code,
    pt.task_type,
    pt.due_date,
    pt.status AS stored_status,
    public.calculate_task_urgency(pt.due_date, pt.status) AS urgency,
    (pt.due_date::date - CURRENT_DATE) AS difference_days,
    pt.amount_snapshot,
    pt.amount_currency,
    pt.cycle_number,
    pt.telecom_reference,
    pt.rescheduled_from_date,
    pt.rescheduled_reason,
    pt.completed_at,
    pt.completed_by,
    pt.cancelled_at,
    pt.cancelled_by,
    pt.created_at,
    pt.updated_at
FROM public.payment_tasks pt
JOIN public.customer_numbers cn ON cn.id = pt.customer_number_id
JOIN public.users u ON u.id = cn.customer_id
JOIN public.telecom_providers tp ON tp.id = COALESCE(pt.provider_id, cn.provider_id);

-- Admin Dashboard Statistics
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
    (SELECT count(*) FROM public.protection_requests WHERE status = 'under_review') AS pending_requests_count,
    (SELECT count(*) FROM public.protections WHERE status = 'active' AND expires_at > now()) AS active_protections_count,
    (SELECT count(*) FROM public.payment_tasks WHERE status = 'open' AND (due_date::date - CURRENT_DATE) = 0) AS tasks_due_today_count,
    (SELECT count(*) FROM public.payment_tasks WHERE status = 'open' AND (due_date::date - CURRENT_DATE) < 0) AS tasks_overdue_count,
    (SELECT count(*) FROM public.users WHERE user_type = 'customer') AS total_customers_count,
    (SELECT count(*) FROM public.customer_numbers) AS total_numbers_count;

-- ----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telecom_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telecom_prefixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_transition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- USERS: Users view own record, admins view all
CREATE POLICY "Users view own or admin views all" ON public.users
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.is_admin());

-- USERS: Update self (guarded against privilege escalation by trigger)
CREATE POLICY "Users update own profile or admin updates" ON public.users
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_admin());

-- TELECOM PROVIDERS: Active providers public, admins manage
CREATE POLICY "Public views active providers" ON public.telecom_providers
    FOR SELECT TO authenticated, anon
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages providers" ON public.telecom_providers
    FOR ALL TO authenticated
    USING (public.is_admin());

-- TELECOM PREFIXES: Public views active, admins manage
CREATE POLICY "Public views active prefixes" ON public.telecom_prefixes
    FOR SELECT TO authenticated, anon
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages prefixes" ON public.telecom_prefixes
    FOR ALL TO authenticated
    USING (public.is_admin());

-- CUSTOMER NUMBERS: Customer views own, admin views all
CREATE POLICY "Customer views own numbers, admin views all" ON public.customer_numbers
    FOR SELECT TO authenticated
    USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Customer inserts own numbers" ON public.customer_numbers
    FOR INSERT TO authenticated
    WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customer updates own numbers, admin updates" ON public.customer_numbers
    FOR UPDATE TO authenticated
    USING (customer_id = auth.uid() OR public.is_admin());

-- PROTECTION PLANS: Active plans public, admins manage
CREATE POLICY "Public views active plans" ON public.protection_plans
    FOR SELECT TO authenticated, anon
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages plans" ON public.protection_plans
    FOR ALL TO authenticated
    USING (public.is_admin());

-- PAYMENT METHODS: Active methods public, admins manage
CREATE POLICY "Public views active payment methods" ON public.payment_methods
    FOR SELECT TO authenticated, anon
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin manages payment methods" ON public.payment_methods
    FOR ALL TO authenticated
    USING (public.is_admin());

-- PROTECTION REQUESTS: Customer views own, admin views all
CREATE POLICY "Customer views own requests, admin views all" ON public.protection_requests
    FOR SELECT TO authenticated
    USING (customer_id = auth.uid() OR public.is_admin());

-- Invariant: Customers can only submit requests in 'under_review' status
CREATE POLICY "Customer submits requests in review state" ON public.protection_requests
    FOR INSERT TO authenticated
    WITH CHECK (customer_id = auth.uid() AND status = 'under_review');

CREATE POLICY "Admin manages protection requests" ON public.protection_requests
    FOR ALL TO authenticated
    USING (public.is_admin());

-- PROTECTIONS: Customer views own, admin manages all
CREATE POLICY "Customer views own protections, admin views all" ON public.protections
    FOR SELECT TO authenticated
    USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin manages protections" ON public.protections
    FOR ALL TO authenticated
    USING (public.is_admin());

-- PAYMENT TASKS: Strictly Internal Admin Only! Zero customer access!
CREATE POLICY "Admin only payment tasks" ON public.payment_tasks
    FOR ALL TO authenticated
    USING (public.is_admin());

-- TASK SETTINGS: Admin Only!
CREATE POLICY "Admin only task settings" ON public.task_settings
    FOR ALL TO authenticated
    USING (public.is_admin());

-- FINANCIAL TRANSACTIONS: Admin only (customers view payment receipt via protections)
CREATE POLICY "Admin only financial transactions" ON public.financial_transactions
    FOR ALL TO authenticated
    USING (public.is_admin());

-- NOTIFICATIONS: Users view own, admins view admin notifications
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT TO authenticated
    USING (
        (recipient_id = auth.uid() AND recipient_type = 'customer') OR
        (recipient_type = 'admin' AND public.is_admin())
    );

CREATE POLICY "Users update own notification read state" ON public.notifications
    FOR UPDATE TO authenticated
    USING (
        (recipient_id = auth.uid() AND recipient_type = 'customer') OR
        (recipient_type = 'admin' AND public.is_admin())
    );

-- AUDIT LOGS: Admin Only!
CREATE POLICY "Admin only audit logs" ON public.audit_logs
    FOR ALL TO authenticated
    USING (public.is_admin());

-- STATE TRANSITION LOGS: Admin Only!
CREATE POLICY "Admin only state transition logs" ON public.state_transition_logs
    FOR ALL TO authenticated
    USING (public.is_admin());

-- SYSTEM SETTINGS: Public reads, Admin modifies
CREATE POLICY "Everyone reads system settings" ON public.system_settings
    FOR SELECT TO authenticated, anon
    USING (true);

CREATE POLICY "Admin modifies system settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 11. SEED DATA (TELECOM PROVIDERS, PREFIXES, PLANS, SETTINGS)
-- ----------------------------------------------------------------------------

-- Telecom Providers
INSERT INTO public.telecom_providers (id, code, name_ar, name_en, number_length, is_active, is_visible_to_customer, sort_order) VALUES
    ('11111111-1111-1111-1111-111111111111', 'yemen_mobile', 'يمن موبايل', 'Yemen Mobile', 9, true, true, 1),
    ('22222222-2222-2222-2222-222222222222', 'sabafon', 'سبأفون', 'SabaFon', 9, true, true, 2),
    ('33333333-3333-3333-3333-333333333333', 'you', 'يو (YOU)', 'YOU Telecom', 9, true, true, 3),
    ('44444444-4444-4444-4444-444444444444', 'y_telecom', 'واي (Y)', 'Y Telecom', 9, true, true, 4)
ON CONFLICT (id) DO UPDATE 
SET name_ar = EXCLUDED.name_ar, name_en = EXCLUDED.name_en, is_active = EXCLUDED.is_active;

-- Prefixes
INSERT INTO public.telecom_prefixes (provider_id, prefix, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', '77', true),
    ('11111111-1111-1111-1111-111111111111', '78', true),
    ('22222222-2222-2222-2222-222222222222', '71', true),
    ('33333333-3333-3333-3333-333333333333', '73', true),
    ('44444444-4444-4444-4444-444444444444', '70', true)
ON CONFLICT (prefix) DO UPDATE
SET provider_id = EXCLUDED.provider_id, is_active = EXCLUDED.is_active;

-- Protection Plans (1 Year Default Duration: 365 Days, Default Price: 1000 YER)
INSERT INTO public.protection_plans (id, provider_id, name_ar, duration_days, price, currency, is_active, is_visible_to_customer, sort_order, description) VALUES
    ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'باقة الحماية السنوية - يمن موبايل', 365, 1000.00, 'YER', true, true, 1, 'حماية الرقم من السحب وإعادة البيع لمدة 365 يوماً'),
    ('aaaaaaaa-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'باقة الحماية السنوية - سبأفون', 365, 1000.00, 'YER', true, true, 1, 'حماية الرقم من السحب وإعادة البيع لمدة 365 يوماً'),
    ('aaaaaaaa-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'باقة الحماية السنوية - يو (YOU)', 365, 1000.00, 'YER', true, true, 1, 'حماية الرقم من السحب وإعادة البيع لمدة 365 يوماً'),
    ('aaaaaaaa-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'باقة الحماية السنوية - واي (Y)', 365, 1000.00, 'YER', true, true, 1, 'حماية الرقم من السحب وإعادة البيع لمدة 365 يوماً')
ON CONFLICT (id) DO UPDATE
SET price = EXCLUDED.price, duration_days = EXCLUDED.duration_days;

-- Task Settings (Every 90 Days Recurring Cycle, 7 Days Visibility, Configurable Amounts)
INSERT INTO public.task_settings (provider_id, first_task_enabled, first_task_amount, recurring_task_enabled, recurring_task_amount, interval_days, visibility_days_before, manual_reschedule_enabled, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', true, 0.00, true, 0.00, 90, 7, true, true),
    ('22222222-2222-2222-2222-222222222222', true, 0.00, true, 0.00, 90, 7, true, true),
    ('33333333-3333-3333-3333-333333333333', true, 0.00, true, 0.00, 90, 7, true, true),
    ('44444444-4444-4444-4444-444444444444', true, 0.00, true, 0.00, 90, 7, true, true)
ON CONFLICT (provider_id) DO UPDATE
SET interval_days = EXCLUDED.interval_days, visibility_days_before = EXCLUDED.visibility_days_before;

-- Payment Methods (Database-driven, manager-configurable account details)
INSERT INTO public.payment_methods (id, type, name_ar, account_number, account_name, instructions, is_active, sort_order) VALUES
    ('bbbbbbbb-1111-1111-1111-111111111111', 'wallet', 'محفظة موبايل موني', 'يحددها المدير من لوحة الإدارة', 'أمان لحماية الأرقام', 'قم بالتحويل عبر تطبيق موبايل موني إلى الحساب المعتمد وأرفق رقم العملية.', true, 1),
    ('bbbbbbbb-2222-2222-2222-222222222222', 'wallet', 'محفظة جوالي (Jawali)', 'يحددها المدير من لوحة الإدارة', 'أمان لحماية الأرقام', 'قم بالتحويل عبر تطبيق جوالي إلى الحساب المعتمد وأرفق رقم الإشعار.', true, 2),
    ('bbbbbbbb-3333-3333-3333-333333333333', 'wallet', 'محفظة فلوسك (Flousk)', 'يحددها المدير من لوحة الإدارة', 'أمان لحماية الأرقام', 'قم بالتحويل عبر تطبيق فلوسك وأرفق رقم الحوالة أو الإشعار.', true, 3),
    ('bbbbbbbb-4444-4444-4444-444444444444', 'wallet', 'محفظة ون كاش (OneCash)', 'يحددها المدير من لوحة الإدارة', 'أمان لحماية الأرقام', 'قم بالتحويل عبر تطبيق ون كاش وأرفق رقم العملية.', true, 4),
    ('bbbbbbbb-5555-5555-5555-555555555555', 'bank', 'بنك الكريمي (حساب مميز)', 'يحددها المدير من لوحة الإدارة', 'أمان لحماية الأرقام', 'قم بالإيداع أو التحويل لحساب الكريمي المعتمد وأرفق رقم القيد أو الإشعار.', true, 5)
ON CONFLICT (id) DO UPDATE
SET name_ar = EXCLUDED.name_ar, instructions = EXCLUDED.instructions;

-- System Settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('app_name', 'أمان | AMAN', 'الاسم الرسمي للمنظومة'),
    ('tagline', 'أرقامك.. أمان بين يديك', 'الشعار اللفظي المعتمد للمنظومة'),
    ('protection_default_duration', '365', 'مدة الحماية الافتراضية بالأيام'),
    ('protection_default_price', '1000', 'سعر الحماية الافتراضي بالريال اليمني'),
    ('renewal_warning_days', '30', 'عدد الأيام قبل الانتهاء للبدء في تنبيه التجديد'),
    ('support_phone', '777000000', 'رقم الهاتف المباشر لخدمة العملاء'),
    ('support_whatsapp', '+967777000000', 'رقم الواتساب للدعم الفني'),
    ('terms_conditions', 'منظومة أمان تقوم بمتابعة وتسديد رسوم الحفاظ على الأرقام لدى شركات الاتصالات لمنع إعادة تدويرها أو بيعها وفق اللوائح المعتمدة.', 'الشروط والأحكام العامة'),
    ('privacy_policy', 'تلتزم منظومة أمان بالحفاظ على سرية بيانات المشتركين وأرقامهم وعدم مشاركتها مع أي أطراف ثالثة.', 'سياسة الخصوصية وحماية البيانات')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, description = EXCLUDED.description;
