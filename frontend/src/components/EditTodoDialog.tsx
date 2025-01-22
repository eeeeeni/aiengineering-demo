import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Todo, UpdateTodoInput } from '../types/todo';

interface EditTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onClose: () => void;
  onSave: (input: UpdateTodoInput) => void;
}

export function EditTodoDialog({ todo, open, onClose, onSave }: EditTodoDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
    }
  }, [todo]);

  const handleSave = () => {
    if (!todo || !title.trim()) return;

    onSave({
      id: todo.id,
      title: title.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>할 일 수정</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="제목"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="설명"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
