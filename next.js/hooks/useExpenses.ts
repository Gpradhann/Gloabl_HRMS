'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  isMileage: boolean;
  mileageKm: number | null;
  mileageFrom: string | null;
  mileageTo: string | null;
  ratePerKm: number | null;
  isTaxable: boolean;
  status: string;
  policyValid: boolean;
  policyMessage?: string | null;
  approvalFlow: string;
  approverComment: string | null;
  paidDate: string | null;
}

export const useExpenses = (employeeId?: string, status?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['expenses', employeeId, status],
    queryFn: () => {
      let url = '/api/expenses';
      const params: string[] = [];
      if (employeeId) params.push(`employeeId=${employeeId}`);
      if (status) params.push(`status=${status}`);
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      return apiClient.get<{ success: boolean; data: Reimbursement[] }>(url).then(res => res.data);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (body: {
      employeeId: string;
      employeeName: string;
      employeeInitials?: string;
      category: string;
      amount: number;
      currency?: string;
      description: string;
      date?: string;
      isMileage: boolean;
      mileageKm?: number;
      mileageFrom?: string;
      mileageTo?: string;
      ratePerKm?: number;
    }) => apiClient.post<{ success: boolean; data: Reimbursement }>(`/api/expenses`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const approveRejectMutation = useMutation({
    mutationFn: (args: { id: string; action: 'approve' | 'reject'; comment?: string }) =>
      apiClient.patch<{ success: boolean; data: Reimbursement }>(`/api/expenses/${args.id}`, {
        action: args.action,
        comment: args.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  return {
    expenses: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    submitExpense: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    approveRejectExpense: approveRejectMutation.mutateAsync,
    isProcessing: approveRejectMutation.isPending,
  };
};
