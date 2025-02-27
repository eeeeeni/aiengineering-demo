import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todoTable = new dynamodb.Table(this, 'TodoTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'ttl',
      pointInTimeRecovery: true,
    });
    
    // ✅ userId를 보조 인덱스(GSI)로 추가!
    todoTable.addGlobalSecondaryIndex({
      indexName: "userId-index",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    });

    // Lambda 함수를 위한 공통 환경 변수
    const lambdaEnvironment = {
      TODO_TABLE_NAME: todoTable.tableName,
      POWERTOOLS_SERVICE_NAME: 'todo-api',
      LOG_LEVEL: 'INFO',
    };

    // Lambda 함수 생성
    const todoHandler = new lambda.Function(this, 'TodoHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/dist')),
      environment: lambdaEnvironment,
    });

    // DynamoDB 테이블에 대한 권한 부여
    todoTable.grantReadWriteData(todoHandler);

    // API Gateway 생성
    const api = new apigateway.RestApi(this, 'TodoApi', {
      restApiName: 'Todo Service',
      description: 'This is the Todo API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API 리소스 및 메서드 설정
    const todos = api.root.addResource('todos');
    const todo = todos.addResource('{id}');

    // POST /todos - 새로운 TODO 생성
    todos.addMethod('POST', new apigateway.LambdaIntegration(todoHandler));

    // GET /todos - 모든 TODO 조회
    todos.addMethod('GET', new apigateway.LambdaIntegration(todoHandler));

    // GET /todos/{id} - 특정 TODO 조회
    todo.addMethod('GET', new apigateway.LambdaIntegration(todoHandler));

    // PUT /todos/{id} - TODO 업데이트
    todo.addMethod('PUT', new apigateway.LambdaIntegration(todoHandler));

    // DELETE /todos/{id} - TODO 삭제
    todo.addMethod('DELETE', new apigateway.LambdaIntegration(todoHandler));

    // API Gateway URL을 출력값으로 설정
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
