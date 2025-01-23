# TODO 애플리케이션 설계 문서

## 1. 개요
이 문서는 서버리스 아키텍처를 기반으로 한 TODO 웹 애플리케이션의 설계 내용을 담고 있습니다.

## 2. 시스템 아키텍처

### 2.1 프론트엔드
- **기술 스택**
  - React.js
  - TypeScript
  - Material-UI (디자인 시스템)
  - GitHub Pages (호스팅)
  - Vite (빌드 도구)
  - TanStack Query (상태 관리)

### 2.2 프론트엔드 구현 상세

#### 기술 스택
- React + TypeScript
- Vite (빌드 도구)
- Material-UI (UI 컴포넌트)
- TanStack Query (상태 관리)

#### 디렉토리 구조
```
frontend/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── services/      # API 서비스 (목업 포함)
│   ├── hooks/         # 커스텀 훅
│   └── types/         # TypeScript 타입 정의
```

#### 컴포넌트 구조
- `TodoPage`: 메인 페이지 컴포넌트
  - `AddTodoForm`: TODO 항목 추가 폼
  - `TodoList`: TODO 목록 컨테이너
    - `TodoItem`: 개별 TODO 항목

#### 데이터 흐름
1. `useTodos` 훅에서 React Query를 사용하여 TODO 데이터 관리
2. 목업 서비스 (`mockTodoService`)에서 API 호출 시뮬레이션
3. 컴포넌트에서 훅을 통해 데이터 접근 및 수정

#### API 인터페이스
```typescript
interface TodoService {
  getTodos(): Promise<Todo[]>;
  getTodo(id: string): Promise<Todo>;
  createTodo(input: CreateTodoInput): Promise<Todo>;
  updateTodo(input: UpdateTodoInput): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}
```

### 2.2 백엔드
- **기술 스택**
  - AWS CDK (TypeScript)
  - AWS Lambda
  - Amazon DynamoDB
  - Amazon API Gateway
  - Amazon Cognito (인증)

## 3. 주요 기능
- 회원가입
- 로그인/로그아웃
- 비밀번호 재설정
- TODO 항목 생성
- TODO 항목 조회 (전체 목록)
- TODO 항목 수정
- TODO 항목 삭제
- TODO 항목 완료 상태 토글

## 4. 데이터 모델

### 4.1 DynamoDB 테이블 구조
```
Table: TodoItems
- id: string (파티션 키)
- userId: string (정렬 키)
- title: string
- description: string (선택사항)
- completed: boolean
- createdAt: number (Unix timestamp)
- updatedAt: number (Unix timestamp)
```

### 4.2 Cognito 사용자 속성
```
- email (필수)
- name
- phone_number (선택)
```

## 5. API 설계

### 5.1 인증 관련 API
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃
- `POST /auth/forgot-password` - 비밀번호 재설정 요청
- `POST /auth/reset-password` - 비밀번호 재설정

### 5.2 REST API 엔드포인트
- `GET /todos` - 모든 TODO 항목 조회
- `POST /todos` - 새로운 TODO 항목 생성
- `PUT /todos/{id}` - 특정 TODO 항목 수정
- `DELETE /todos/{id}` - 특정 TODO 항목 삭제

## 6. 보안

### 6.1 인증/인가
- Cognito User Pool을 통한 사용자 인증
  - 이메일 기반 회원가입
  - 이메일 인증 필수
  - 비밀번호 정책 적용 (최소 8자, 특수문자, 대소문자, 숫자 포함)
- JWT 토큰 기반 인증
  - Access Token, Refresh Token 활용
  - API Gateway에서 Cognito Authorizer 통합
- CORS 설정
- API 요청 제한 (Rate Limiting)

### 6.2 프론트엔드 보안
- 토큰 관리
  - Access Token은 메모리에 저장
  - Refresh Token은 HttpOnly 쿠키로 관리
- XSS 방지
- CSRF 방지

## 7. 인프라스트럭처

### 7.1 AWS 리소스 (CDK로 구성)
- Lambda 함수들
  - createTodo
  - getTodos
  - updateTodo
  - deleteTodo
- DynamoDB 테이블
- API Gateway (REST API)
- Cognito User Pool

### 7.2 CI/CD
- GitHub Actions를 통한 자동 배포
  - 프론트엔드: GitHub Pages 배포
  - 백엔드: AWS CDK 배포

## 8. 모니터링 및 로깅
- CloudWatch Logs를 통한 Lambda 함수 로깅
- CloudWatch Metrics를 통한 API 모니터링

## 9. 확장 고려사항
- TODO 항목 카테고리화
- 마감일 설정
- 우선순위 지정
- 공유 기능

## 10. CI/CD 파이프라인

### 프론트엔드 배포
- GitHub Actions를 사용한 자동 배포
- GitHub Pages를 통한 정적 웹 호스팅
- 프론트엔드 코드 변경 시 자동 빌드 및 배포
- 환경 변수를 통한 API 엔드포인트 관리

### 배포 프로세스
1. frontend 디렉토리 변경 감지
2. Node.js 환경 설정
3. 의존성 설치
4. 프로덕션 빌드
5. GitHub Pages 배포
