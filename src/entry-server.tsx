import { StrictMode } from "react";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
// import App from './App'

import { Router } from "./router";
import { StaticRouter } from "react-router";

export function render(url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <Router />
      </StaticRouter>
    </StrictMode>,
    options
  );
}
