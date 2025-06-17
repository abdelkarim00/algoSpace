import express from 'express';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

// Centralized route mapping
import pageMap from './pageMap.js'; // Move large object to separate file for cleanliness

// Dynamic sitemap generation
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');

  const hostname = 'https://antinloop.com';
  const links = Object.keys(pageMap).map(url => ({
    url,
    changefreq: 'monthly',
    priority: url === '/' ? 1.0 : 0.7
  }));

  const stream = new SitemapStream({ hostname });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
  res.send(xml);
});

// Helper: determines template based on URL
function templatePath(path) {
  if (path === '/') return 'views/template.html';
  if (path.startsWith('/algo/en')) return 'views/algo/en/template.html';
  if (path.startsWith('/algo/ar')) return 'views/algo/ar/template.html';
  if (path.startsWith('/calc/')) return 'views/calc/template.html';
  if (path.startsWith('/news/en')) return 'views/news/en/template.html';
  if (path.startsWith('/news/ar')) return 'views/news/ar/template.html';
  return 'views/algo/template.html'; // fallback
}

// Main renderer
async function renderPage(req, res) {
  console.log(`Rendering: ${req.path}`);

  try {
    let routePath = req.path;
    let pageFile = pageMap[routePath];

    // Fallback to `/algo/en` if missing
    if (!pageFile && routePath.startsWith('/algo')) {
      routePath = `/algo/en${req.path}`;
      pageFile = pageMap[routePath];
    }

    const baseHTML = await readFile(path.join(__dirname, templatePath(routePath)), 'utf8');
    const content = pageFile
      ? await readFile(path.join(__dirname, 'views', pageFile), 'utf8')
      : '<h1>404</h1><p>Page not found.</p>';

    const finalHTML = baseHTML.replace('<!-- SSR_CONTENT -->', content);
    res.status(pageFile ? 200 : 404).send(finalHTML);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Fallback for all GET routes
app.get('*', (req, res) => {
  if (pageMap[req.path] || req.path.startsWith('/algo')) {
    renderPage(req, res);
  } else {
    res.status(404).send('404 - Page Not Found');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
