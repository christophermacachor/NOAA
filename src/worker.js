// src/worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve the HTML file for the root path
    if (url.pathname === '/' || url.pathname === '') {
      try {
        // If you're using Cloudflare Pages, this will be handled automatically
        // For Workers, we need to serve the HTML directly
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NOAA</title>
</head>
<body>
    <h1>NOAA Weather Service</h1>
    <!-- Your HTML content from public/index.html -->
</body>
</html>`;
        
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        return new Response('Error loading page', { status: 500 });
      }
    }
    
    // Handle API requests or other routes
    if (url.pathname === '/api/weather') {
      // Your NOAA API logic here
      return new Response(JSON.stringify({ message: 'Weather data' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
