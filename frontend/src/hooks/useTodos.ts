import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { todoService } from '../services/mockTodoService';

export function useTodos() {
  const queryClient = useQueryClient();

  const todos = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoService.getTodos(),
  });

  const createTodo = useMutation({
    mutationFn: (input: CreateTodoInput) => todoService.createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: (input: UpdateTodoInput) => todoService.updateTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
