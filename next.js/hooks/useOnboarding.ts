'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  phase: string;
  priority?: string;
  assignee?: string;
  dueDate: string;
  completedDate: string | null;
  requiredAction?: string;
}

export interface OnboardingEmployee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  manager: string;
  buddy: string;
  joiningDate: string;
  progressPercent: number;
  isComplete: boolean;
  tasks: OnboardingTask[];
  welcomeMessages: any[];
  teamIntroductions: any[];
  milestones: any[];
  relocationSupport?: any;
}

export const useOnboarding = (employeeId: string) => {
  const queryClient = useQueryClient();

  const dataQuery = useQuery({
    queryKey: ['onboarding', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any }>(`/api/onboarding/${employeeId}`).then(res => {
      const item = res.data;
      if (!item) return null;
      return {
        ...item,
        tasks: typeof item.tasks === 'string' ? JSON.parse(item.tasks) : (item.tasks || []),
        welcomeMessages: typeof item.welcomeMessages === 'string' ? JSON.parse(item.welcomeMessages) : (item.welcomeMessages || []),
        teamIntroductions: typeof item.teamIntroductions === 'string' ? JSON.parse(item.teamIntroductions) : (item.teamIntroductions || []),
        milestones: typeof item.milestones === 'string' ? JSON.parse(item.milestones) : (item.milestones || []),
      } as OnboardingEmployee;
    }),
    enabled: !!employeeId,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (args: { taskId: string; status?: string }) =>
      apiClient.patch<{ success: boolean; data: any }>(`/api/onboarding/tasks/${args.taskId}`, {
        status: args.status || 'completed',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: () =>
      apiClient.post<{ success: boolean }>(`/api/onboarding/${employeeId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });

  return {
    onboardingData: dataQuery.data,
    isLoading: dataQuery.isLoading,
    refetch: dataQuery.refetch,
    completeTask: completeTaskMutation.mutateAsync,
    isCompletingTask: completeTaskMutation.isPending,
    completeOnboarding: completeOnboardingMutation.mutateAsync,
    isCompletingOnboarding: completeOnboardingMutation.isPending,
  };
};
