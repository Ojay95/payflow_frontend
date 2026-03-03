/**
 * Refactored User Roles
 * Matches backend auth logic where 'Admin' has full organization control.
 */
export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  APPROVER = 'Approver'
}

/**
 * Refactored Employee Status
 * Aligned with backend internal state management for workforce filtering.
 */
export enum EmployeeStatus {
  ACTIVE = 'Active',
  ONBOARDING = 'Onboarding',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated'
}

/**
 * Adjustment Item
 * Monetary values must strictly be 'number' (representing int64 cents).
 */
export interface AdjustmentItem {
  item_name: string;
  amount: number; // Strictly in cents
  description: string;
  component_type: 'earnings' | 'deduction';
}

/**
 * Refactored Employee Interface
 * Added bank_code for real-time account verification via Korapay/VFD.
 */
export interface Employee {
  id: string;
  business_id: string; // Added to match backend ownership model
  full_name: string;
  email: string;
  role: string;
  department?: string;
  cadre_id: string; // Changed to string to match backend UUID/ID strategy
  base_salary_cents: number;
  status: EmployeeStatus;
  avatar?: string;
  bank_name?: string;
  bank_code?: string; // Critical for production transfers
  bank_account_number?: string;
  adjustments: AdjustmentItem[];
}

/**
 * Refactored Cadre
 * Added earning_components with cent-precision amounts.
 */
export interface Cadre {
  id: string; // Refactored to string
  name: string;
  earning_components: {
    name: string;
    amount: number; // In cents
  }[];
  deduction_rule_ids: string[]; // Refactored to string array
}

/**
 * Refactored PayrollRun Status
 * Expanded to include real-time states used by the backend scheduler.
 */
export type PayrollStatus = 'Pending' | 'Approved' | 'Processing' | 'Disbursed' | 'Rejected' | 'Failed';

export interface PayrollRun {
  id: string;
  business_id: string; // Added for data isolation
  period: string;
  payment_date: string;
  total_amount_cents: number;
  status: PayrollStatus;
  reference: string;
  employees_count: number;
}

/**
 * New: Wallet Domain
 * Essential for the production dashboard to track organization funds.
 */
export interface Wallet {
  id: string;
  business_id: string;
  balance_cents: number;
  currency: string;
  account_number?: string; // VFD Virtual Account number if provisioned
}

/**
 * Auth Types
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  business_name: string;
  business_id: string; // Critical for scoped API requests
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  requires_2fa?: boolean; // Added to support multi-stage login
}

/**
 * Production API Wrapper
 * Matches the backend response structure for success/error handling.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string; // Added for backend feedback/toasts
  error?: string;
}