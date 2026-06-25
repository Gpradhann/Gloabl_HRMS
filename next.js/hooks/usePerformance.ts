'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  weight: number;
  dueDate: string;
  status: string;
  progress: number;
  keyResults: string; // JSON array of key result objects
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewType: string;
  period: string;
  overallRating: number;
  maxRating: number;
  categoryRatings: any;
  strengths: any;
  areasOfImprovement: any;
  goalsAchieved: number;
  totalGoals: number;
  recommendations: string;
  employeeComments?: string | null;
  reviewDate: string;
  reviewerName: string;
}

export const usePerformance = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const goalsQuery = useQuery({
    queryKey: ['goals', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(
      `/api/performance/goals${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => {
      const rawData = res.data || [];
      // Filter out only items that represent goals (they have progress / keyResults)
      const goals = rawData.filter(item => 'progress' in item);
      return goals as Goal[];
    }),
  });

  const reviewsQuery = useQuery({
    queryKey: ['performanceReviews', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(
      `/api/performance/reviews${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => {
      const rawData = res.data || [];
      // Filter out items that represent reviews (they have overallRating)
      const reviews = rawData.filter(item => 'overallRating' in item);
      return reviews.map(item => ({
        ...item,
        categoryRatings: typeof item.categoryRatings === 'string' ? JSON.parse(item.categoryRatings) : (item.categoryRatings || []),
        strengths: typeof item.strengths === 'string' ? JSON.parse(item.strengths) : (item.strengths || []),
        areasOfImprovement: typeof item.areasOfImprovement === 'string' ? JSON.parse(item.areasOfImprovement) : (item.areasOfImprovement || []),
      })) as PerformanceReview[];
    }),
  });

  const createGoalMutation = useMutation({
    mutationFn: (body: {
      employeeId: string;
      title: string;
      description?: string;
      category?: string;
      type?: string;
      weight: number;
      dueDate: string;
      keyResults?: any[];
    }) => apiClient.post<{ success: boolean; data: Goal }>(`/api/performance/goals`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: (args: { id: string; progress?: number; status?: string; keyResults?: any[] }) =>
      apiClient.patch<{ success: boolean; data: Goal }>(`/api/performance/goals/${args.id}`, {
        progress: args.progress,
        status: args.status,
        keyResults: args.keyResults,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    goals: goalsQuery.data || [],
    isLoadingGoals: goalsQuery.isLoading,
    reviews: reviewsQuery.data || [],
    isLoadingReviews: reviewsQuery.isLoading,
    createGoal: createGoalMutation.mutateAsync,
    isCreatingGoal: createGoalMutation.isPending,
    updateGoal: updateGoalMutation.mutateAsync,
    isUpdatingGoal: updateGoalMutation.isPending,
  };
};
