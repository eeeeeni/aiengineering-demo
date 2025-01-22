import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { AddTodoForm } from '../components/AddTodoForm';
import { TodoList } from '../components/TodoList';
import { useTodos } from '../hooks/useTodos';

export function TodoPage() {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodos();

  if (todos.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (todos.error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">에러가 발생했습니다.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          할 일 목록
        </Typography>
        
        <AddTodoForm onSubmit={(input) => createTodo.mutate(input)} />
        
        <TodoList
          todos={todos.data || []}
          onToggle={(id, completed) => updateTodo.mutate({ id, completed })}
          onEdit={(todo) => {
            // TODO: 수정 다이얼로그 구현
            console.log('Edit todo:', todo);
          }}
          onDelete={(id) => deleteTodo.mutate(id)}
        />
      </Box>
    </Container>
  );
}
