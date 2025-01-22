import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

// 목업 데이터
const mockTodos: Todo[] = [
  {
    id: '1',
    title: '리액트 학습하기',
    description: 'React와 TypeScript를 사용하여 TODO 앱 만들기',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'AWS 서비스 학습하기',
    description: 'Lambda, DynamoDB, API Gateway 학습',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 지연 시간을 시뮬레이션하는 헬퍼 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const todoService = {
  // 모든 TODO 항목 조회
  async getTodos(): Promise<Todo[]> {
    await delay(500); // API 호출 시뮬레이션
    return [...mockTodos];
  },

  // 단일 TODO 항목 조회
  async getTodo(id: string): Promise<Todo | undefined> {
    await delay(500);
    return mockTodos.find(todo => todo.id === id);
  },

  // TODO 항목 생성
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    await delay(500);
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...input,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTodos.push(newTodo);
    return newTodo;
  },

  // TODO 항목 업데이트
  async updateTodo(input: UpdateTodoInput): Promise<Todo> {
    await delay(500);
    const index = mockTodos.findIndex(todo => todo.id === input.id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    
    const updatedTodo = {
      ...mockTodos[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    mockTodos[index] = updatedTodo;
    return updatedTodo;
  },

  // TODO 항목 삭제
  async deleteTodo(id: string): Promise<void> {
    await delay(500);
    const index = mockTodos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      mockTodos.splice(index, 1);
    }
  },
};
