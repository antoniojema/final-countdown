import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <App />
);