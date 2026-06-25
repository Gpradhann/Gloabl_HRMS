'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  visibilityScope: string;
  targetDepartments: string | null;
  requiresAcknowledgment: boolean;
  publishedDate: string;
  publishedBy: string;
  views: number;
  likes: number;
  acknowledgments: number;
  comments: number;
  acknowledgedBy: string; // JSON array
  likedBy: string; // JSON array
}

export const useAnnouncements = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(`/api/announcements`).then(res => {
      const rawData = res.data || [];
      return rawData.map(item => ({
        ...item,
        acknowledgedBy: typeof item.acknowledgedBy === 'string' ? JSON.parse(item.acknowledgedBy) : (item.acknowledgedBy || []),
        likedBy: typeof item.likedBy === 'string' ? JSON.parse(item.likedBy) : (item.likedBy || []),
      })) as Announcement[];
    }),
  });

  const createMutation = useMutation({
    mutationFn: (body: {
      title: string;
      content: string;
      category: string;
      priority: string;
      visibilityScope?: string;
      targetDepartments?: string[];
      requiresAcknowledgment: boolean;
      publishedBy?: string;
      expiryDate?: string;
    }) => apiClient.post<{ success: boolean; data: Announcement }>(`/api/announcements`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (args: { id: string; employeeId: string }) =>
      apiClient.post<{ success: boolean; liked: boolean; likesCount: number }>(`/api/announcements/${args.id}/like`, {
        employeeId: args.employeeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (args: { id: string; employeeId: string }) =>
      apiClient.post<{ success: boolean; acknowledged: boolean }>(`/api/announcements/${args.id}/acknowledge`, {
        employeeId: args.employeeId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  return {
    announcements: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    createAnnouncement: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    likeAnnouncement: likeMutation.mutateAsync,
    acknowledgeAnnouncement: acknowledgeMutation.mutateAsync,
  };
};
