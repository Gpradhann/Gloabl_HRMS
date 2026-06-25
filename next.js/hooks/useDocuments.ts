'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface HrmsDocument {
  id: string;
  employeeId: string;
  name: string;
  category: string;
  status: string;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  uploadDate: string | null;
  verifiedDate: string | null;
  rejectionReason: string | null;
  isRequired: boolean;
}

export const useDocuments = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['documents', employeeId],
    queryFn: () => apiClient.get<{ success: boolean; data: HrmsDocument[] }>(
      `/api/documents${employeeId ? `?employeeId=${employeeId}` : ''}`
    ).then(res => res.data),
  });

  const uploadMutation = useMutation({
    mutationFn: (body: {
      employeeId: string;
      name: string;
      category?: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      isRequired?: boolean;
    }) => apiClient.post<{ success: boolean; data: HrmsDocument }>(`/api/documents`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const verifyRejectMutation = useMutation({
    mutationFn: (args: { id: string; action: 'verify' | 'reject'; reason?: string }) =>
      apiClient.patch<{ success: boolean; data: HrmsDocument }>(`/api/documents/${args.id}`, {
        action: args.action,
        reason: args.reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents: listQuery.data || [],
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    verifyRejectDocument: verifyRejectMutation.mutateAsync,
    isProcessing: verifyRejectMutation.isPending,
  };
};
