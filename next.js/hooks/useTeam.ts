'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { Employee } from './useEmployees';

export const useTeam = (managerId?: string) => {
  const teamQuery = useQuery({
    queryKey: ['team', managerId],
    queryFn: () => apiClient.get<{ success: boolean; data: Employee[] }>(
      `/api/team${managerId ? `?managerId=${managerId}` : ''}`
    ).then(res => res.data),
  });

  return {
    team: teamQuery.data || [],
    isLoading: teamQuery.isLoading,
    refetch: teamQuery.refetch,
  };
};
