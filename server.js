// import fs from 'node:fs/promises'
// import express from 'express'

// // Constants
// const isProduction = process.env.NODE_ENV === 'production'
// const port = process.env.PORT || 5173
// const base = process.env.BASE || '/'

// // Cached production assets
// const templateHtml = isProduction
//   ? await fs.readFile('./dist/client/index.html', 'utf-8')
//   : ''

// // Create http server
// const app = express()

// // Add Vite or respective production middlewares
// /** @type {import('vite').ViteDevServer | undefined} */
// let vite
// if (!isProduction) {
//   const { createServer } = await import('vite')
//   vite = await createServer({
//     server: { middlewareMode: true },
//     appType: 'custom',
//     base,
//   })
//   app.use(vite.middlewares)
// } else {
//   const compression = (await import('compression')).default
//   const sirv = (await import('sirv')).default
//   app.use(compression())
//   app.use(base, sirv('./dist/client', { extensions: [] }))
// }

// // Serve HTML
// app.use('*all', async (req, res) => {
//   try {
//     const url = req.originalUrl.replace(base, '')

//     /** @type {string} */
//     let template
//     /** @type {import('./src/entry-server.ts').render} */
//     let render
//     if (!isProduction) {
//       // Always read fresh template in development
//       template = await fs.readFile('./index.html', 'utf-8')
//       template = await vite.transformIndexHtml(url, template)
//       render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
//     } else {
//       template = templateHtml
//       render = (await import('./dist/server/entry-server.js')).render
//     }

//     const rendered = await render(url, res)

//     const html = template
//       .replace(`<!--app-head-->`, rendered.head ?? '')
//       .replace(`<!--app-html-->`, rendered.html ?? '')

//     res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
//   } catch (e) {
//     vite?.ssrFixStacktrace(e)
//     console.log(e.stack)
//     res.status(500).end(e.stack)
//   }
// })

// // Start http server
// app.listen(port, () => {
//   console.log(`Server started at http://localhost:${port}`)
// })

// TODO solution 2
// import fs from 'node:fs/promises';
// import express from "express";

// // Constants
// const isProduction = process.env.NODE_ENV === "production";
// const port = process.env.PORT || 5173;
// // const base = process.env.BASE || '//';

// // Cached production assets
// const templateHtml = isProduction
//   ? await fs.readFile('./dist/client/index.html', 'utf-8')
//   : '';

// // Create http server
// const app = express();

// // Add Vite or respective production middlewares
// /** @type {import('vite').ViteDevServer | undefined} */
// let vite;
// if (!isProduction) {
//   const { createServer } = await import("vite");
//   vite = await createServer({
//     server: { middlewareMode: true },
//     appType: "custom",
//   });
//   app.use(vite.middlewares);
//   // app.use(express.static("dist/client"));
// } else {
//   const compression = (await import("compression")).default;
//   const sirv = (await import("sirv")).default;
//   app.use(compression());
//   app.use(sirv("./dist/client", { extensions: [] }));
// }

// // Serve HTML
// app.use("*all", async (req, res) => {
//   try {
//     // const url = req.originalUrl.replace(base, "");
//     const url = req.originalUrl;
//     /** @type {(path: string, res: import('express').Response) => void} */
//     if (url.includes("api/webhooks")) {
//       res.status(200);
//       res.set({
//         "Content-Type": "application/json",
//       });
//       res.send({
//         message: "Webhook received",
//       });
//       return;
//     }

//     let template;
//     let render;
//     if (!isProduction) {
//       template = await fs.readFile("./index.html", "utf-8");
//       template = await vite.transformIndexHtml(url, template);

//       // In development, load the render function dynamically
//       render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
//     } else {
//       template = templateHtml;
//       // In production, use the pre-built server entry
//       render = (await import("./dist/server/entry-server.js")).render;
//     }

//     let didError = false;

//     const { pipe, abort } = render(url, {
//       onShellError() {
//         res.status(500);
//         res.set({ "Content-Type": "text/html" });
//         res.send("<h1>Something went wrong</h1>");
//       },
//       onShellReady() {
//         res.status(didError ? 500 : 200);
//         res.set({ "Content-Type": "text/html" });

//         const transformStream = new Transform({
//           transform(chunk, encoding, callback) {
//             res.write(chunk, encoding);
//             callback();
//           },
//         });

//         const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

//         res.write(htmlStart);

//         transformStream.on("finish", () => {
//           res.end(htmlEnd);
//         });

//         pipe(transformStream);
//       },
//       onError(error) {
//         didError = true;
//         console.error(error);
//       },
//     });

//     setTimeout(() => {
//       abort();
//     }, 10000);

//     // Call the render function, which streams the response directly
//     // render(url, res);
//   } catch (e) {
//     vite?.ssrFixStacktrace(e);
//     console.error(e.stack);
//     res.status(500).end(isProduction ? "Internal Server Error" : e.stack);
//     res.status(404).send("Page not found");
//   }
// });

// // Start http server
// app.listen(port, () => {
//   console.log(`Server started at http://localhost:${port}`);
// });

// TODO: clone solution 2
// import fs from 'node:fs/promises';
import express from "express";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "//";

// Cached production assets
// const templateHtml = isProduction
//   ? await fs.readFile('./dist/client/index.html', 'utf-8')
//   : '';

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
  // app.use(express.static("dist/client"));
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("/", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    // const url = req.originalUrl;
    // console.log(!!url);

    /** @type {(path: string, res: import('express').Response) => void} */
    let render;
    if (!isProduction) {
      // In development, load the render function dynamically
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      // In production, use the pre-built server entry
      render = (await import("./dist/server/entry-server.js")).render;
    }

    // Call the render function, which streams the response directly
    render(url, res);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(isProduction ? "Internal Server Error" : e.stack);
    res.status(404).send("Page not found");
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
