// import { StrictMode } from "react";
// import { renderToPipeableStream, renderToString } from "react-dom/server";
// import { Router } from "./router";
// import { StaticRouter } from "react-router";

// TODO: renderToString
// export function render(path: string) {
//   const html = renderToString(
//     <StrictMode>
//       <StaticRouter location={path}>
//         <Router />
//       </StaticRouter>
//     </StrictMode>,
//   );
//   return { html };
// }

// TODO: draft 1
// export function render(path: string, res: any) { // Replace `any` with proper type (e.g., Express Response if using Express)
//   const stream = renderToPipeableStream(
//     <StrictMode>
//       <StaticRouter location={path}>
//         <Router />
//       </StaticRouter>
//     </StrictMode>,
//     {
//       onShellReady() {
//         // Set the response headers and pipe the stream
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/html");
//         stream.pipe(res);
//       },
//       onShellError(err) {
//         // Handle errors during shell rendering
//         console.error("SSR Shell Error:", err);
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "text/html");
//         res.end("<h1>Internal Server Error</h1>");
//       },
//       onError(err) {
//         // Log non-fatal errors
//         console.error("SSR Error:", err);
//       },
//     }
//   );
// }

// TODO: updated code
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Router } from "./router";
import { PassThrough } from "stream";
import { Response } from "express";

export function render(url: string, res: Response) {
  const stream = new PassThrough();

  const { pipe, abort } = renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <Router />
      </StaticRouter>
    </StrictMode>,
    {
      onShellReady() {
        // Headers and streaming start
        res.statusCode = 200;
        // TODO: refactor here
        res.setHeader("Content-Type", "text/html");
        pipe(stream);
        stream.pipe(res);
      },
      onError(err) {
        if (err instanceof Error) {
          throw Error(err.message);
        }
      },
    }
  );

  // Timeout to abort render in case something goes wrong
  setTimeout(abort, 10000);
}

// TODO: draft 2
// import { StrictMode } from "react";
// import {
//   renderToPipeableStream,
//   type RenderToPipeableStreamOptions,
// } from "react-dom/server";
// import { StaticRouter } from "react-router";
// import { Router } from "./router";

// export function render(url: string, options?: RenderToPipeableStreamOptions) {
//   return renderToPipeableStream(
//     <StrictMode>
//       <StaticRouter location={url}>
//         <Router />
//       </StaticRouter>
//     </StrictMode>,
//     options
//   );
// }
