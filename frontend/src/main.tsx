import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import authConfig from "./auth/authConfig"; // ✅ authConfig 불러오기

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...authConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);