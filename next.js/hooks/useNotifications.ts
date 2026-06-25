'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface HrmsNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  read: boolean;
  forRoles: string; // JSON array of roles
}

export const useNotifications = (userRole?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['notifications', userRole],
    queryFn: () => {
      const url = `/api/notifications${userRole ? `?userRole=${userRole}` : ''}`;
      return apiClient.get<{ success: boolean; data: HrmsNotification[] }>(url).then(res => res.data);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      apiClient.patch<{ success: boolean; message: string }>(
        `/api/notifications/read-all${userRole ? `?userRole=${userRole}` : ''}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<{ success: boolean }>(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = listQuery.data || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    markAllRead: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending,
    markRead: markReadMutation.mutateAsync,
  };
};
