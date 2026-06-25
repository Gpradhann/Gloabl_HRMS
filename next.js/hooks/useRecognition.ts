'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Recognition {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  fromEmployeeInitials: string;
  toEmployeeId: string;
  toEmployeeName: string;
  toEmployeeInitials: string;
  category: string;
  message: string;
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  date: string;
  fromColor: string;
  toColor: string;
  likedBy: string[]; // Parsed from JSON array
}

export const useRecognition = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['recognitions'],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(`/api/recognition`).then(res => {
      const rawData = res.data || [];
      return rawData.map(item => ({
        ...item,
        likedBy: typeof item.likedBy === 'string' ? JSON.parse(item.likedBy) : (item.likedBy || []),
      })) as Recognition[];
    }),
  });

  const postMutation = useMutation({
    mutationFn: (body: {
      fromEmployeeId: string;
      fromEmployeeName: string;
      fromEmployeeInitials?: string;
      toEmployeeId: string;
      toEmployeeName: string;
      toEmployeeInitials?: string;
      category: string;
      message: string;
      isPublic?: boolean;
      fromColor?: string;
      toColor?: string;
    }) => apiClient.post<{ success: boolean; data: Recognition }>(`/api/recognition`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recognitions'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (args: { id: string; employeeId: string }) =>
      apiClient.post<{ success: boolean; liked: boolean; likesCount: number }>(`/api/recognition/${args.id}/like`, {
        employeeId: args.employeeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recognitions'] });
    },
  });

  return {
    recognitions: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    postRecognition: postMutation.mutateAsync,
    isPosting: postMutation.isPending,
    likeRecognition: likeMutation.mutateAsync,
  };
};
