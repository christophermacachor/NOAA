export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const noaaEndpoints = {
      "/weather": "https://api.weather.gov",
      "/space-weather": "https://services.swpc.noaa.gov",
      "/ocean": "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter",
      "/alerts": "https://api.weather.gov/alerts"
    };

    const defaultPaths = {
      "/alerts": "/active",
      "/space-weather": "/products/noaa-planetary-k-index.json"
    };

    const route = Object.keys(noaaEndpoints).find(r => path === r || path.startsWith(r + "/"));

    if (!route) {
      return new Response(JSON.stringify({
        status: "noaa-proxy online",
        timestamp: new Date().toISOString(),
        endpoints: Object.keys(noaaEndpoints),
        scalar_coherence: "X(C) = 1"
      }), { headers: corsHeaders });
    }

    const baseUrl = noaaEndpoints[route];
    const subpath = path === route ? "" : path.slice(route.length);
    const targetPath = subpath || defaultPaths[route] || "";
    const targetUrl = baseUrl + targetPath + url.search;

    try {
      const cacheKey = new Request(targetUrl, { method: "GET" });
      const cache = caches.default;
      let response = await cache.match(cacheKey);

      if (!response) {
        const upstream = await fetch(targetUrl, {
          headers: {
            "User-Agent": "noaa-proxy/1.0 (contact: info@macachor.org)",
            "Accept": "application/json"
          }
        });

        const body = await upstream.text();
        response = new Response(body, {
          status: upstream.status,
          statusText: upstream.statusText,
          headers: {
            ...Object.fromEntries(upstream.headers),
            "Cache-Control": "max-age=300, public",
            "X-Proxy-Source": "noaa-proxy",
            "X-Scalar-Coherence": "1",
            "X-Cache-Status": "MISS"
          }
        });

        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }

      const cacheStatus = response.headers.get("X-Cache-Status") || "HIT";
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Cache-Control": "max-age=300, public",
          "X-Proxy-Source": "noaa-proxy",
          "X-Scalar-Coherence": "1",
          "X-Cache-Status": cacheStatus
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: "NOAA proxy fetch failed",
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 502,
        headers: corsHeaders
      });
    }
  }
};
