import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, IconButton, Box, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { TodoPage } from './pages/TodoPage';
import { lightTheme, darkTheme } from './theme';
import { useAuth } from 'react-oidc-context';  // ✅ Cognito 인증

const queryClient = new QueryClient();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // ✅ Cognito 로그인 인증 상태 관리
  const auth = useAuth();
  const clientId = "2p3uaolcfihmj52hg8ufvu6bg1";  // ✅ Cognito 클라이언트 ID
  const logoutUri = "https://eeeeeni.github.io/aiengineering-demo/"; // ✅ 배포된 프론트엔드 URL
  const cognitoDomain = "https://ap-northeast-2_BdFNslJgj.auth.ap-northeast-2.amazoncognito.com"; // ✅ 사용자 풀 도메인

  const signOutRedirect = () => {
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
          <IconButton onClick={() => setIsDarkMode(!isDarkMode)} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* ✅ 로그인 UI 추가 */}
        <Box sx={{ position: 'fixed', top: 16, left: 16 }}>
          {auth.isAuthenticated ? (
            <Box>
              <p>환영합니다, {auth.user?.profile.email}!</p>
              <Button variant="contained" color="secondary" onClick={() => signOutRedirect()}>
                로그아웃
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={() => auth.signinRedirect()}>
              로그인
            </Button>
          )}
        </Box>

        <TodoPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;