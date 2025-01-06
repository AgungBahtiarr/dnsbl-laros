import { checkRoute, checkPrefixRoute } from "./src/routes";

const server = Bun.serve({
  port: 3000,
  websocket: {
    message() {},
    open() {},
    close() {},
  },
  idleTimeout: 60,
  async fetch(req) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers,
      });
    }

    const url = new URL(req.url);
    const path = url.pathname;

    // http://localhost:3000/check?ip=${ip}
    if (path === "/api/check") {
      return await checkRoute(url, headers);
    }

    // http://localhost:3000/check-prefix?ip=${ip}&prefix=${prefix}
    if (path === "/api/check-prefix") {
      return await checkPrefixRoute(url, headers);
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers,
    });
  },
});

console.log(`LAROS-DNSBL API running at http://localhost:${server.port}`);
