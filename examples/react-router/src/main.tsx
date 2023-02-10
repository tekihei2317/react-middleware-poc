import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./authentication";
import { AppRoutes } from "./router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  </React.StrictMode>
);
