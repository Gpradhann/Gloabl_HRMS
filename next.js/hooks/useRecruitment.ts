'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  postedDate: string;
  applicantsCount: number;
  shortlistedCount: number;
  interviewingCount: number;
  experienceMin: number;
  experienceMax: number;
  requirements: string[];
}

export interface Candidate {
  id: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  appliedRole: string;
  skills: string[];
  experienceYears: number;
  expectedSalary: number;
  currency: string;
  noticePeriodDays: number;
  rating: number;
  notes: string;
  status: string;
  appliedDate: string;
  interviewDate: string | null;
  color: string;
}

export const useRecruitment = (jobId?: string, status?: string) => {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobPostings'],
    queryFn: () => apiClient.get<{ success: boolean; data: any[] }>(`/api/recruitment/jobs`).then(res => {
      const rawData = res.data || [];
      return rawData.map(item => ({
        ...item,
        requirements: typeof item.requirements === 'string' ? JSON.parse(item.requirements) : (item.requirements || []),
      })) as JobPosting[];
    }),
  });

  const candidatesQuery = useQuery({
    queryKey: ['candidates', jobId, status],
    queryFn: () => {
      let url = '/api/recruitment/candidates';
      const params: string[] = [];
      if (jobId) params.push(`jobId=${jobId}`);
      if (status) params.push(`status=${status}`);
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      return apiClient.get<{ success: boolean; data: any[] }>(url).then(res => {
        const rawData = res.data || [];
        return rawData.map(item => ({
          ...item,
          skills: typeof item.skills === 'string' ? JSON.parse(item.skills) : (item.skills || []),
        })) as Candidate[];
      });
    },
  });

  const addCandidateMutation = useMutation({
    mutationFn: (body: {
      jobPostingId: string;
      name: string;
      email: string;
      phone?: string;
      initials?: string;
      appliedRole: string;
      skills?: string[];
      experienceYears: number;
      expectedSalary: number;
      currency?: string;
      noticePeriodDays: number;
      rating?: number;
      notes?: string;
    }) => apiClient.post<{ success: boolean; data: Candidate }>(`/api/recruitment/candidates`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: (args: { id: string; status?: string; interviewDate?: string; notes?: string; rating?: number }) =>
      apiClient.patch<{ success: boolean; data: Candidate }>(`/api/recruitment/candidates/${args.id}`, {
        status: args.status,
        interviewDate: args.interviewDate,
        notes: args.notes,
        rating: args.rating,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  return {
    jobs: jobsQuery.data || [],
    isLoadingJobs: jobsQuery.isLoading,
    candidates: candidatesQuery.data || [],
    isLoadingCandidates: candidatesQuery.isLoading,
    addCandidate: addCandidateMutation.mutateAsync,
    isAddingCandidate: addCandidateMutation.isPending,
    updateCandidate: updateCandidateMutation.mutateAsync,
    isUpdatingCandidate: updateCandidateMutation.isPending,
  };
};
