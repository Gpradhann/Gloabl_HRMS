'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriod: string;
  payDate: string;
  country: string;
  status: string;
  currency: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  overtimePay: number;
  reimbursements: number;
  grossPay: number;
  incomeTax: number;
  providentFund: number;
  healthInsurance: number;
  socialSecurity: number;
  medicare: number;
  federalTax: number;
  stateTax: number;
  professionalTax: number;
  totalDeductions: number;
  netPay: number;
}

export const usePayroll = (employeeId?: string) => {
  const listQuery = useQuery({
    queryKey: ['payrollRecords', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: PayrollRecord[] }>(
      `/api/payroll${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => res.data),
  });

  return {
    records: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
  };
};
