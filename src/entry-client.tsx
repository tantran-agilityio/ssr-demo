import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
// import App from "./App";

import { BrowserRouter } from "react-router";
import { Router } from "./router";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      // TODO: error here
      <Router />
    </BrowserRouter>
  </StrictMode>
);
