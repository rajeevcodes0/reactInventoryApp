import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AppManagerProvider } from "./store/app-manager";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <AppManagerProvider>
      <App />
    </AppManagerProvider>
  </Router>,
  document.getElementById("root")
);
