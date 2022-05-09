import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ThemeProvider from "./Theme";
import { AuthProvider } from "./providers/AuthProvider";
import { ContractProvider } from "./providers/ContractProvider";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider>
      <AuthProvider>
        <ContractProvider>
          <App />
        </ContractProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
