import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { AddTodoForm } from '../components/AddTodoForm';
import { TodoList } from '../components/TodoList';
import { EditTodoDialog } from '../components/EditTodoDialog';
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../types/todo';

type SortField = 'createdAt' | 'title';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'active' | 'completed';

export function TodoPage() {
  const { todos, createTodo, updateTodo, deleteTodo } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const handleSort = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === 'createdAt_desc' || value === 'createdAt_asc') {
      setSortField('createdAt');
      setSortOrder(value.split('_')[1] as SortOrder);
    } else if (value === 'title_desc' || value === 'title_asc') {
      setSortField('title');
      setSortOrder(value.split('_')[1] as SortOrder);
    }
  };

  const filteredAndSortedTodos = (todos.data || [])
    .filter((todo) => {
      // 상태 필터링
      if (filterStatus === 'active') return !todo.completed;
      if (filterStatus === 'completed') return todo.completed;
      return true;
    })
    .filter((todo) => {
      // 검색어 필터링
      const search = searchQuery.toLowerCase();
      return (
        todo.title.toLowerCase().includes(search) ||
        (todo.description?.toLowerCase() || '').includes(search)
      );
    })
    .sort((a, b) => {
      // 정렬
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

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
        
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="검색"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <FormControl fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={filterStatus}
              label="상태"
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="active">진행 중</MenuItem>
              <MenuItem value="completed">완료</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>정렬</InputLabel>
            <Select
              value={`${sortField}_${sortOrder}`}
              label="정렬"
              onChange={handleSort}
            >
              <MenuItem value="createdAt_desc">최신순</MenuItem>
              <MenuItem value="createdAt_asc">오래된순</MenuItem>
              <MenuItem value="title_asc">제목 오름차순</MenuItem>
              <MenuItem value="title_desc">제목 내림차순</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TodoList
          todos={filteredAndSortedTodos}
          onToggle={(id, completed) => updateTodo.mutate({ id, completed })}
          onEdit={(todo) => setEditingTodo(todo)}
          onDelete={(id) => deleteTodo.mutate(id)}
        />

        <EditTodoDialog
          todo={editingTodo}
          open={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={(input) => updateTodo.mutate(input)}
        />
      </Box>
    </Container>
  );
}
