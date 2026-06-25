'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  managerId: string | null;
  joiningDate: string;
  avatarColor: string;
  designation: string;
}

export const useEmployees = (department?: string, managerId?: string) => {
  const listQuery = useQuery({
    queryKey: ['employees', department, managerId],
    queryFn: () => {
      let url = '/api/employees';
      const params: string[] = [];
      if (department) params.push(`department=${department}`);
      if (managerId) params.push(`managerId=${managerId}`);
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      return apiClient.get<{ success: boolean; data: Employee[] }>(url).then(res => res.data);
    },
  });

  return {
    employees: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
  };
};

export const useEmployee = (id: string) => {
  const detailQuery = useQuery({
    queryKey: ['employee', id],
    queryFn: () => apiClient.get<{ success: boolean; data: Employee }>(`/api/employees/${id}`).then(res => res.data),
    enabled: !!id,
  });

  return {
    employee: detailQuery.data,
    isLoading: detailQuery.isLoading,
    refetch: detailQuery.refetch,
  };
};
