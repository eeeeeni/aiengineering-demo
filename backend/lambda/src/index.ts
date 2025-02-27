import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { todoService } from './todoService';

function getUserIdFromToken(event: APIGatewayProxyEvent): string | null {
  return event.headers.Authorization || null;
}

// ✅ `headers`를 `try` 블록 바깥에서 선언
const headers: { [header: string]: string | number | boolean } = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,Authorization',
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, pathParameters, body } = event;

    if (httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    const userId = getUserIdFromToken(event);
    if (!userId) {
      return { statusCode: 401, headers, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    switch (`${httpMethod} ${event.path}`) {
      case 'GET /todos':
        const todos = await todoService.getTodos(userId);
        return { statusCode: 200, headers, body: JSON.stringify(todos) };

      case 'POST /todos':
        const newTodo = await todoService.createTodo(userId, JSON.parse(body!));
        return { statusCode: 201, headers, body: JSON.stringify(newTodo) };

      case 'PUT /todos/{id}':
        if (!pathParameters?.id) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing ID' }) };
        }
        const updatedTodo = await todoService.updateTodo(userId, pathParameters.id, JSON.parse(body!));
        if (!updatedTodo) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'Todo not found or not authorized' }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(updatedTodo) };

      case 'DELETE /todos/{id}':
        if (!pathParameters?.id) {
          return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing ID' }) };
        }
        const deleted = await todoService.deleteTodo(userId, pathParameters.id);
        if (!deleted) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'Todo not found or not authorized' }) };
        }
        return { statusCode: 204, headers, body: '' };

      default:
        return { statusCode: 404, headers, body: JSON.stringify({ message: 'Not found' }) };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,  // ✅ `headers`가 여기서도 사용 가능
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};