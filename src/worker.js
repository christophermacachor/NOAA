
export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // ── NOAA API Proxy ──────────────────────────────────────────
    if (pathname.startsWith('/api/noaa/')) {
      const noaaPath = pathname.replace('/api/noaa/', '');
      const noaaUrl = `https://services.swpc.noaa.gov/${noaaPath}${url.search}`;

      const noaaRequest = new Request(noaaUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'noaa-proxy/1.0 (macachor.org)'
        }
      });

      const response = await fetch(noaaRequest);

      const corsHeaders = new Headers(response.headers);
      corsHeaders.set('Access-Control-Allow-Origin', '*');
      corsHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      corsHeaders.set('Access-Control-Max-Age', '86400');

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders
      });
    }

    // ── Static Assets ───────────────────────────────────────────
    return env.ASSETS.fetch(request);
  }
};
