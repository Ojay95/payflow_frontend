import { Employee, Cadre, PayrollRun, AuthResponse, UserRole, EmployeeStatus } from '../types';

export const MOCK_DATA = {
  auth: {
    token: 'mock-jwt-token-12345',
    user: {
      id: 'u1',
      email: 'admin@innovate.com',
      name: 'Maria Rodriguez',
      role: UserRole.ADMIN,
      business_name: 'Innovate Tech Ltd'
    }
  } as AuthResponse,
  
  cadres: [
    { 
      id: 1, 
      name: 'Senior Engineer', 
      earning_components: [{ name: 'Basic', amount: 800000 }, { name: 'Housing', amount: 150000 }],
      deduction_rule_ids: [1, 2]
    },
    { 
      id: 2, 
      name: 'Junior Dev', 
      earning_components: [{ name: 'Basic', amount: 450000 }],
      deduction_rule_ids: [1]
    }
  ] as Cadre[],
  
  employees: [
    { 
      id: 'e1', 
      full_name: 'Adewale John', 
      email: 'wale@example.com', 
      cadre_id: 1, 
      role: 'Staff Engineer',
      base_salary_cents: 800000,
      status: EmployeeStatus.ACTIVE,
      adjustments: []
    },
    { 
      id: 'e2', 
      full_name: 'Chidi Okafor', 
      email: 'chidi@example.com', 
      cadre_id: 2,
      role: 'Frontend Dev',
      base_salary_cents: 450000,
      status: EmployeeStatus.ACTIVE,
      adjustments: []
    }
  ] as Employee[],
  
  payroll: [
    {
      id: 'pr1',
      period: 'Oct 01 - Oct 15, 2023',
      payment_date: '2023-10-13',
      total_amount_cents: 4120000,
      status: 'Processed',
      reference: 'PY-2023-10A',
      employees_count: 48
    }
  ] as PayrollRun[]
};

export const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));