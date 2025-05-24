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

// Route-to-file mapping
const pageMap = {
  '/algo': '/algo/home.html',

  // Sorting Algorithms
  '/algo/en/bubble-sort': '/algo/en/bubble-sort.html',
  '/algo/en/selection-sort': '/algo/en/selection-sort.html',
  '/algo/en/insertion-sort': '/algo/en/insertion-sort.html',
  '/algo/en/merge-sort': '/algo/en/merge-sort.html',
  '/algo/en/quick-sort': '/algo/en/quick-sort.html',
  '/algo/en/heap-sort': '/algo/en/heap-sort.html',
  '/algo/en/counting-sort': '/algo/en/counting-sort.html',
  '/algo/en/radix-sort': '/algo/en/radix-sort.html',
  '/algo/en/bucket-sort': '/algo/en/bucket-sort.html',

  // Searching Algorithms
  '/algo/en/linear-search': '/algo/en/linear-search.html',
  '/algo/en/binary-search': '/algo/en/binary-search.html',
  '/algo/en/ternary-search': '/algo/en/ternary-search.html',

  // Mathematical Algorithms
  '/algo/en/gcd-lcm': '/algo/en/gcd-lcm.html',
  '/algo/en/sieve': '/algo/en/sieve.html',
  '/algo/ar/sieve': '/algo/ar/sieve.html',
  '/algo/en/modular-arithmetic': '/algo/en/modular-arithmetic.html',
  '/algo/en/fermat': '/algo/en/fermat.html',
  '/algo/en/euler': '/algo/en/euler.html',
  '/algo/en/fast-exponentiation': '/algo/en/fast-exponentiation.html',

  // Graph Algorithms
  '/algo/en/bfs': '/algo/en/bfs.html',
  '/algo/en/dfs': '/algo/en/dfs.html',
  '/algo/en/dijkstra': '/algo/en/dijkstra.html',
  '/algo/en/bellman-ford': '/algo/en/bellman-ford.html',
  '/algo/en/floyd-warshall': '/algo/en/floyd-warshall.html',
  '/algo/en/topological-sort': '/algo/en/topological-sort.html',
  '/algo/en/union-find': '/algo/en/union-find.html',
  '/algo/en/kruskal': '/algo/en/kruskal.html',
  '/algo/en/prim': '/algo/en/prim.html',
  '/algo/en/tarjan': '/algo/en/tarjan.html',
  '/algo/en/kosaraju': '/algo/en/kosaraju.html',
  '/algo/en/a-star': '/algo/en/a-star.html', // This one was duplicated, keeping the first
  // '/algo/en/a-star': '/algo/en/a-star.html', // Removed duplicate

  // Dynamic Programming
  '/algo/en/knapsack': '/algo/en/knapsack.html',
  '/algo/en/lcs': '/algo/en/lcs.html',
  '/algo/en/lis': '/algo/en/lis.html',
  '/algo/en/matrix-chain': '/algo/en/matrix-chain.html',
  '/algo/en/dp-trees': '/algo/en/dp-trees.html',
  '/algo/en/bitmask-dp': '/algo/en/bitmask-dp.html',
  '/algo/en/knuth': '/algo/en/knuth.html',
  '/algo/en/convex-hull-dp': '/algo/en/convex-hull-dp.html',
  '/algo/en/digit-dp': '/algo/en/digit-dp.html',

  // String Algorithms
  '/algo/en/kmp': '/algo/en/kmp.html',
  '/algo/en/z-algorithm': '/algo/en/z-algorithm.html',
  '/algo/en/rabin-karp': '/algo/en/rabin-karp.html',
  '/algo/en/suffix-array': '/algo/en/suffix-array.html',
  '/algo/en/aho-corasick': '/algo/en/aho-corasick.html',
  '/algo/en/rolling-hash': '/algo/en/rolling-hash.html',
  '/algo/en/manacher': '/algo/en/manacher.html',
  '/algo/en/edit-distance': '/algo/en/edit-distance.html',

  // Data Structures
  '/algo/en/treap': '/algo/en/treap.html',

  // Backtracking
  '/algo/en/n-queens': '/algo/en/n-queens.html',
  '/algo/en/sudoku': '/algo/en/sudoku.html',
  '/algo/en/hamiltonian': '/algo/en/hamiltonian.html',
  '/algo/en/subsets': '/algo/en/subsets.html',

  // Greedy Algorithms
  '/algo/en/activity-selection': '/algo/en/activity-selection.html',
  '/algo/en/huffman': '/algo/en/huffman.html',
  '/algo/en/fractional-knapsack': '/algo/en/fractional-knapsack.html',
  '/algo/en/interval': '/algo/en/interval.html',
  '/algo/en/job-sequencing': '/algo/en/job-sequencing.html',

  // Bit Manipulation
  '/algo/en/bitwise-ops': '/algo/en/bitwise-ops.html',
  '/algo/en/xor': '/algo/en/xor.html',
  '/algo/en/bit-count': '/algo/en/bit-count.html',
  '/algo/en/bitmasking': '/algo/en/bitmasking.html',

  // Geometry
  '/algo/en/convex-hull': '/algo/en/convex-hull.html',
  '/algo/en/line-intersection': '/algo/en/line-intersection.html',
  '/algo/en/sweep-line': '/algo/en/sweep-line.html',
  '/algo/en/point-in-polygon': '/algo/en/point-in-polygon.html',
  '/algo/en/rotating-calipers': '/algo/en/rotating-calipers.html',

  // Advanced Techniques
  '/algo/en/mo': '/algo/en/mo.html',
  '/algo/en/hld': '/algo/en/hld.html',
  '/algo/en/centroid': '/algo/en/centroid.html',
  '/algo/en/persistent': '/algo/en/persistent.html',
  '/algo/en/sqrt-decomposition': '/algo/en/sqrt-decomposition.html',
  '/algo/en/monotonic': '/algo/en/monotonic.html',
  '/algo/en/sliding-window': '/algo/en/sliding-window.html',
  '/algo/en/two-pointers': '/algo/en/two-pointers.html',
  '/algo/en/two-heaps': '/algo/en/two-heaps.html',
  '/algo/en/meet-in-middle': '/algo/en/meet-in-middle.html',

  // Recurrence / Divide and Conquer
  '/algo/en/divide-conquer': '/algo/en/divide-conquer.html',
  '/algo/en/karatsuba': '/algo/en/karatsuba.html',
  '/algo/en/binary-search-answer': '/algo/en/binary-search-answer.html',
  '/algo/en/master-theorem': '/algo/en/master-theorem.html',
  '/algo/en/strassen': '/algo/en/strassen.html',

  // Cryptography
  '/algo/en/rsa': '/algo/en/rsa.html',
  '/algo/en/diffie-hellman': '/algo/en/diffie-hellman.html',
  '/algo/en/hash-functions': '/algo/en/hash-functions.html',

  // Core Skills
  '/algo/en/problem-decomposition': '/algo/en/problem-decomposition.html',
  '/algo/en/complexity-analysis': '/algo/en/complexity-analysis.html',
  '/algo/en/mathematical-proof': '/algo/en/mathematical-proof.html',
  '/algo/en/state-representation': '/algo/en/state-representation.html',
  '/algo/en/dp-vs-greedy': '/algo/en/dp-vs-greedy.html',
  '/algo/en/modeling': '/algo/en/modeling.html',

  // calculator
  '/': '/home.html',
  '/calc/unit-converter': '/calc/unit-converter.html',
  '/calc/countdown-timer':'/calc/countdown-timer.html',
  '/calc/date-difference': '/calc/date-difference.html',
  '/calc/sorting': '/calc/sorting.html',
  '/calc/bfs': '/calc/bfs.html',
  '/calc/graph-traversal': '/calc/graph-traversal.html',
};

// Generate dynamic sitemap
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');

  const hostname = 'https://antinloop.com'; // Replace with your actual domain
  const links = Object.keys(pageMap).map(url => ({
    url,
    changefreq: 'monthly',
    priority: url === '/' ? 1.0 : 0.7
  }));

  const stream = new SitemapStream({ hostname });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
  res.send(xml);
});

// Render pages
async function renderAlgo(req, res) {
  console.log(`Rendering page: ${req.path}`);
  try {
    const baseHTML = await readFile(path.join(__dirname, templatePath(req.path)), 'utf8');
    const pageFile = pageMap[req.path];

    let content = '<h1>404</h1><p>Page not found.</p>';
    if (pageFile) {
      content = await readFile(path.join(__dirname, 'views', pageFile), 'utf8');
    }

    const finalHTML = baseHTML.replace('<!-- SSR_CONTENT -->', content);
    res.send(finalHTML);
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

function templatePath(path) {
  if (path === '/') {
    return 'views/template.html';
  }
  if (path.startsWith('/algo/')) {
    return 'views/algo/template.html';
  }
  if (path.startsWith('/calc')) {
    return 'views/calc/template.html';
  }
  return 'views/algo/template.html';
}

app.get('*', renderAlgo);

app.listen(port, () => {
  console.log(`✅ SSR app running at http://localhost:${port}`);
});

