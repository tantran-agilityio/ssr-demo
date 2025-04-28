// import { StrictMode } from "react";
// import { renderToPipeableStream } from "react-dom/server";
// import { Router } from "./router";
// import { StaticRouter } from "react-router";

// export function render(path: string) {
//   const html = renderToPipeableStream(
//     <StrictMode>
//       <StaticRouter location={path}>
//         <Router />
//       </StaticRouter>
//     </StrictMode>,
//   );
//   return { html };
// }

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

import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Router } from "./router";
import { PassThrough } from "stream";
import { Response } from "express";

export function render(url: string, res: Response) {
  const stream = new PassThrough();

  const { pipe, abort } = renderToPipeableStream(
    <StaticRouter location={url}>
      <Router />
    </StaticRouter>,
    {
      onShellReady() {
        // Headers and streaming start
        res.statusCode = 200;
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

// import { renderToPipeableStream } from "react-dom/server";
// import { StaticRouter } from "react-router";
// import { Router } from "./router";
// import { PassThrough } from "stream";
// import { Request, Response } from "express";

// export function render(url: string, res: Response) {
//   const stream = new PassThrough();

//   const { pipe, abort } = renderToPipeableStream(
//     <StaticRouter location={url}>
//       <Router />
//     </StaticRouter>,
//     {
//       onShellReady() {
//         // Headers and streaming start
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "text/html");
//         pipe(stream);
//         stream.pipe(res);
//       },
//       onError(err) {
//         console.error(err);
//       },
//     }
//   );

//   // Timeout to abort render in case something goes wrong
//   setTimeout(abort, 10000);
// }
