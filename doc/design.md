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
