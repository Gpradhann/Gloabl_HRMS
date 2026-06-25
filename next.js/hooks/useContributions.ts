'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface ValueContribution {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  title: string;
  description: string;
  type: string;
  category: string;
  suggestedPoints: number;
  finalPoints: number | null;
  impactLevel: string;
  tags: string[];
  status: string;
  approvalFlow: any[];
  createdDate: string;
}

export interface ContributionLeaderboard {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  department: string;
  totalPoints: number;
  rank: number;
  badges: string[];
  averageRating: number;
  color: string;
}

export interface ContributionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  suggestedPoints: number;
  isAvailable: boolean;
  claimedBy?: string | null;
  impactLevel: string;
}

export const useContributions = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['contributions', employeeId],
    queryFn: () => {
      const url = `/api/contributions${employeeId ? `?employeeId=${employeeId}` : ''}`;
      return apiClient.get<{ success: boolean; data: any[] }>(url).then(res => {
        const rawData = res.data || [];
        return rawData.map(item => ({
          ...item,
          tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []),
          approvalFlow: typeof item.approvalFlow === 'string' ? JSON.parse(item.approvalFlow) : (item.approvalFlow || []),
        })) as ValueContribution[];
      });
    },
  });

  const leaderboardQuery = useQuery({
    queryKey: ['contributionsLeaderboard'],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(`/api/contributions/leaderboard`).then(res => {
      const rawData = res.data || [];
      return rawData.map(item => ({
        ...item,
        badges: typeof item.badges === 'string' ? JSON.parse(item.badges) : (item.badges || []),
      })) as ContributionLeaderboard[];
    }),
  });

  const itemsQuery = useQuery({
    queryKey: ['contributionItems'],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(`/api/contributions/items`).then(res => {
      const rawData = res.data || [];
      return rawData as ContributionItem[];
    }),
  });

  const submitMutation = useMutation({
    mutationFn: (body: {
      employeeId: string;
      employeeName: string;
      employeeInitials?: string;
      title: string;
      description: string;
      type?: string;
      category?: string;
      suggestedPoints: number;
      impactLevel?: string;
      tags?: string[];
    }) => apiClient.post<{ success: boolean; data: ValueContribution }>(`/api/contributions`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (args: { id: string; action: 'approve' | 'reject'; finalPoints?: number; comment?: string }) =>
      apiClient.patch<{ success: boolean; data: ValueContribution }>(`/api/contributions/${args.id}`, {
        action: args.action,
        finalPoints: args.finalPoints,
        comment: args.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contributionsLeaderboard'] });
    },
  });

  const claimItemMutation = useMutation({
    mutationFn: (itemId: string) =>
      apiClient.post<{ success: boolean }>(`/api/contributions/items/${itemId}/claim?employeeId=emp-001`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributionItems'] });
      queryClient.invalidateQueries({ queryKey: ['contributionsLeaderboard'] });
    },
  });

  return {
    contributions: listQuery.data || [],
    isLoadingContributions: listQuery.isLoading,
    leaderboard: leaderboardQuery.data || [],
    isLoadingLeaderboard: leaderboardQuery.isLoading,
    rewardItems: itemsQuery.data || [],
    isLoadingItems: itemsQuery.isLoading,
    submitContribution: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    approveContribution: approveMutation.mutateAsync,
    isProcessing: approveMutation.isPending,
    claimItem: claimItemMutation.mutateAsync,
  };
};
