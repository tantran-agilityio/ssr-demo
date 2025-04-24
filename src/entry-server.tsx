import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Router } from "./router";
import { StaticRouter } from "react-router";

export function render(path: string) {
  const html = renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={path}>
        <Router />
      </StaticRouter>
    </StrictMode>
  );
  return { html };
}
