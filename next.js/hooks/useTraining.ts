'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface TrainingContent {
  id: string;
  title: string;
  type: string;
  duration: number;
  completed: boolean;
}

export interface TrainingModule {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  dueDate: string;
  isMandatory: boolean;
  status: string;
  progress: number;
  contents: TrainingContent[];
  certificateId: string | null;
  isCertificateEligible: boolean;
}

export const useTraining = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['trainingModules', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(
      `/api/training${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => {
      const rawData = res.data || [];
      return rawData.map(item => ({
        ...item,
        contents: typeof item.contents === 'string' ? JSON.parse(item.contents) : (item.contents || []),
      })) as TrainingModule[];
    }),
  });

  const progressMutation = useMutation({
    mutationFn: (args: { id: string; contentId: string; completed: boolean }) =>
      apiClient.patch<{ success: boolean; data: any }>(`/api/training/${args.id}/progress`, {
        contentId: args.contentId,
        completed: args.completed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingModules'] });
    },
  });

  return {
    modules: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    updateProgress: progressMutation.mutateAsync,
    isUpdatingProgress: progressMutation.isPending,
  };
};
