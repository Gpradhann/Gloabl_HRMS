'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface UserBaseItem {
  userId: string;
  userName: string;
}

export interface Todo {
  todoId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  userId: string;
  userContext: UserBaseItem | null;
}

const fallbackTodos: Todo[] = [
  {
    todoId: 'todo-001',
    title: 'Approve Leave Requests',
    description: 'Review and approve pending leave requests for the team.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    userId: 'emp-002',
    userContext: { userId: 'emp-002', userName: 'Michael Chen' }
  },
  {
    todoId: 'todo-002',
    title: 'Submit Weekly Report',
    description: 'Compile and submit progress report for the current sprint.',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    userId: 'emp-001',
    userContext: { userId: 'emp-001', userName: 'Sarah Johnson' }
  },
  {
    todoId: 'todo-003',
    title: 'Complete Security Training',
    description: 'Mandatory quarterly compliance training course.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: true,
    userId: 'emp-001',
    userContext: { userId: 'emp-001', userName: 'Sarah Johnson' }
  }
];

export const useTodos = (userId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['todos', userId],
    queryFn: () => apiClient.get<{ success: boolean; data: { todos: Todo[] } }>(
      `/api/todos${userId ? `?userId=${userId}` : ''}`
    ).then(res => res.data?.todos || []),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (body: { title: string; description?: string | null; dueDate?: string | null; isCompleted?: boolean; userId: string }) =>
      apiClient.post<{ success: boolean; data: { todoId: string } }>(`/api/todos`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: { todoId: string; title: string; description?: string | null; dueDate?: string | null; isCompleted?: boolean; userId: string }) =>
      apiClient.patch<{ success: boolean; data: { todoId: string } }>(`/api/todos/${args.todoId}`, args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (todoId: string) =>
      apiClient.delete<{ success: boolean; data: { todoId: string } }>(`/api/todos/${todoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const getFilteredFallback = () => {
    if (!userId) return fallbackTodos;
    return fallbackTodos.filter(t => t.userId === userId);
  };

  return {
    todos: listQuery.data && listQuery.data.length > 0 ? listQuery.data : getFilteredFallback(),
    isLoading: listQuery.isLoading && !listQuery.error,
    refetch: listQuery.refetch,
    createTodo: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTodo: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTodo: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
