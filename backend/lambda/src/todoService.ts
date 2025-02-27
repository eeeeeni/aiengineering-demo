import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { CreateTodoInput, Todo, UpdateTodoInput } from './types';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TableName = process.env.TODO_TABLE_NAME!;

export const todoService = {
  async getTodos(userId: string): Promise<Todo[]> {
    const result = await ddbDocClient.send(
      new QueryCommand({
        TableName,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );
    return (result.Items || []) as Todo[];
  },

  async getTodo(id: string): Promise<Todo | null> {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName,
        Key: { id },
      })
    );
    return (result.Item as Todo) || null;
  },

  async createTodo(userId: string, input: CreateTodoInput): Promise<Todo> {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: Date.now().toString(),  // ✅ 쉼표 추가 (문법 오류 해결)
      userId,  
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName,
        Item: todo,
      })
    );

    return todo;
  },

  async updateTodo(userId: string, id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const todo = await this.getTodo(id);
    if (!todo || todo.userId !== userId) return null;  // ✅ 사용자가 본인 TODO만 수정 가능

    const updatedTodo: Todo = {
      ...todo,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName,
        Item: updatedTodo,
      })
    );

    return updatedTodo;
  },

  async deleteTodo(userId: string, id: string): Promise<boolean> {
    const todo = await this.getTodo(id);
    if (!todo || todo.userId !== userId) return false;  // ✅ 본인 TODO만 삭제 가능

    await ddbDocClient.send(
      new DeleteCommand({
        TableName,
        Key: { id },
      })
    );

    return true;
  }
};