'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  submittedDate: string;
  approverId: string | null;
  approverComment: string | null;
  approvalFlow: any[];
}

export interface LeaveBalance {
  id: string;
  leaveType: string;
  allocated: number;
  used: number;
  available: number;
}

export const useLeave = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const balancesQuery = useQuery({
    queryKey: ['leaveBalances', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(
      `/api/leave/balances${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => {
      const rawData = res.data || [];
      // Balance items have 'leaveType' and 'available' and don't have 'startDate'
      const balances = rawData.filter(item => 'leaveType' in item && 'available' in item && !('startDate' in item));
      return balances.map(b => ({
        type: b.leaveType,
        label: b.label || (b.leaveType.charAt(0).toUpperCase() + b.leaveType.slice(1) + " Leave"),
        total: b.total,
        used: b.used,
        pending: b.pending,
        available: b.available,
        color: b.color || '#0d9488',
        carriedForward: b.carriedForward
      }));
    }),
  });

  const requestsQuery = useQuery({
    queryKey: ['leaveRequests', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(
      `/api/leave/requests${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => {
      const rawData = res.data || [];
      // Request items have 'status' and 'startDate'
      const requests = rawData.filter(item => 'status' in item && 'startDate' in item);
      return requests.map(item => ({
        ...item,
        approvalFlow: typeof item.approvalFlow === 'string' ? JSON.parse(item.approvalFlow) : (item.approvalFlow || []),
      })) as LeaveRequest[];
    }),
  });

  const submitMutation = useMutation({
    mutationFn: (body: {
      employeeId: string;
      employeeName: string;
      employeeInitials?: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      totalDays: number;
      reason: string;
    }) => apiClient.post<{ success: boolean; data: LeaveRequest }>(`/api/leave/requests`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
    },
  });

  const approveRejectMutation = useMutation({
    mutationFn: (args: { id: string; action: 'approve' | 'reject'; comment?: string }) =>
      apiClient.patch<{ success: boolean; data: LeaveRequest }>(`/api/leave/requests/${args.id}`, {
        action: args.action,
        comment: args.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
    },
  });

  return {
    balances: balancesQuery.data || [],
    isLoadingBalances: balancesQuery.isLoading,
    requests: requestsQuery.data || [],
    isLoadingRequests: requestsQuery.isLoading,
    submitLeave: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    approveRejectLeave: approveRejectMutation.mutateAsync,
    isProcessing: approveRejectMutation.isPending,
  };
};
