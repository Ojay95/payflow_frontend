
export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  APPROVER = 'Approver'
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  ONBOARDING = 'Onboarding',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated'
}

export interface AdjustmentItem {
  item_name: string;
  amount: number; // in cents
  description: string;
  component_type: 'earnings' | 'deduction';
}

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  cadre_id: number;
  base_salary_cents: number;
  status: EmployeeStatus;
  avatar?: string;
  bank_name?: string;
  bank_account_number?: string;
  adjustments: AdjustmentItem[];
}

export interface Cadre {
  id: number;
  name: string;
  earning_components: {
    name: string;
    amount: number;
  }[];
  deduction_rule_ids: number[];
}

export interface PayrollRun {
  id: string;
  period: string;
  payment_date: string;
  total_amount_cents: number;
  status: 'Draft' | 'Processed' | 'Processing' | 'Failed';
  reference: string;
  employees_count: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  business_name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isMock?: boolean;
}
