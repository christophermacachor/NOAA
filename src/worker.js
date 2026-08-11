// src/worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve index.html for root path
    if (url.pathname === '/' || url.pathname === '') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NOAA Weather</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #0066cc; }
    </style>
</head>
<body>
    <h1>🌊 NOAA Weather Service</h1>
    <p>Welcome to the NOAA Weather Worker!</p>
    <p>API endpoint: <code>/api/weather</code></p>
</body>
</html>`;
      
      return new Response(html, {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // API endpoint example
    if (url.pathname === '/api/weather') {
      return new Response(JSON.stringify({
        status: 'success',
        message: 'NOAA Weather API',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
