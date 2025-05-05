import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Initialize Vite in development
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });

  // Attach Vite dev middlewares
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;

  // Enable gzip compression
  app.use(compression());

  // Serve static assets
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Block DevTools-related special requests
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/.well-known/")) {
    res.status(404).send("Not found");
    return;
  }
  next();
});

// Handle all other requests (SSR entry point) and Serve HTML
app.use("/", async (req, res) => {
  try {
    const cleanedUrl = req.originalUrl.replace(base, "");
    const url = cleanedUrl.startsWith("/") ? cleanedUrl : "/" + cleanedUrl;
    console.log("original url: ", req.originalUrl);

    let template;
    let render;

    if (!isProduction) {
      // Load fresh template and SSR module each time in dev
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      // Use cached template and pre-built server entry in production
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    let didError = false;

    // Start rendering stream
    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500).set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200).set({ "Content-Type": "text/html" });
        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

        res.write(htmlStart);

        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });

        pipe(transformStream);

        // Timeout to abort rendering if it takes too long
        setTimeout(() => {
          abort();
        }, 10000);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error("Server error:", e.stack);
    res.status(500).end(isProduction ? "Internal Server Error" : e.stack);
  }
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start http server
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
