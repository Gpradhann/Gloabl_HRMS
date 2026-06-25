'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  userId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  clockMethod: string;
  status: string;
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
  totalHours: number;
  locationVerified: boolean;
  ipValidated: boolean;
  shiftName: string;
  exceptionFlag?: string | null;
}

export const useAttendance = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const attendanceQuery = useQuery({
    queryKey: ['attendance', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: AttendanceRecord[] }>(
      `/api/attendance${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => res.data),
    enabled: true,
  });

  const clockInMutation = useMutation({
    mutationFn: (body: { employeeId: string; method?: string }) =>
      apiClient.post<{ success: boolean; data: AttendanceRecord }>(`/api/attendance/clockin`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: (body: { employeeId: string }) =>
      apiClient.post<{ success: boolean; data: AttendanceRecord }>(`/api/attendance/clockout`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  return {
    records: attendanceQuery.data || [],
    isLoading: attendanceQuery.isLoading,
    refetch: attendanceQuery.refetch,
    clockIn: clockInMutation.mutateAsync,
    isClockingIn: clockInMutation.isPending,
    clockOut: clockOutMutation.mutateAsync,
    isClockingOut: clockOutMutation.isPending,
  };
};
