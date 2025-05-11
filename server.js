import express from 'express';
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

// Define route-to-file mapping
const pageMap = {
  '/': 'bubble-sort.html',
  '/google18e624c3863568d5.html': 'google18e624c3863568d5.html',

  // Sorting Algorithms
  '/bubble-sort': 'bubble-sort.html',
  '/selection-sort': 'selection-sort.html',
  '/insertion-sort': 'insertion-sort.html',
  '/merge-sort': 'merge-sort.html',
  '/quick-sort': 'quick-sort.html',
  '/heap-sort': 'heap-sort.html',
  '/counting-sort': 'counting-sort.html',
  '/radix-sort': 'radix-sort.html',
  '/bucket-sort': 'bucket-sort.html',

  // Searching Algorithms
  '/linear-search': 'linear-search.html',
  '/binary-search': 'binary-search.html',
  '/ternary-search': 'ternary-search.html',

  // Mathematical Algorithms
  '/gcd-lcm': 'gcd-lcm.html',
  '/sieve': 'sieve.html',
  '/modular-arithmetic': 'modular-arithmetic.html',
  '/fermat': 'fermat.html',
  '/euler': 'euler.html',
  '/fast-exponentiation': 'fast-exponentiation.html',

  // Graph Algorithms
  '/bfs': 'bfs.html',
  '/dfs': 'dfs.html',
  '/dijkstra': 'dijkstra.html',
  '/bellman-ford': 'bellman-ford.html',
  '/floyd-warshall': 'floyd-warshall.html',
  '/topological-sort': 'topological-sort.html',
  '/union-find': 'union-find.html',
  '/kruskal': 'kruskal.html',
  '/prim': 'prim.html',
  '/tarjan': 'tarjan.html',
  '/kosaraju': 'kosaraju.html',
  '/a-star': 'a-star.html',

  // Dynamic Programming
  '/knapsack': 'knapsack.html',
  '/lcs': 'lcs.html',
  '/lis': 'lis.html',
  '/matrix-chain': 'matrix-chain.html',
  '/dp-trees': 'dp-trees.html',
  '/bitmask-dp': 'bitmask-dp.html',
  '/knuth': 'knuth.html',
  '/convex-hull-dp': 'convex-hull-dp.html',
  '/digit-dp': 'digit-dp.html',

  // String Algorithms
  '/kmp': 'kmp.html',
  '/z-algorithm': 'z-algorithm.html',
  '/rabin-karp': 'rabin-karp.html',
  '/suffix-array': 'suffix-array.html',
  '/aho-corasick': 'aho-corasick.html',
  '/rolling-hash': 'rolling-hash.html',
  '/manacher': 'manacher.html',
  '/edit-distance': 'edit-distance.html',

  // Data Structures
  '/treap': 'treap.html',

  // Backtracking
  '/n-queens': 'n-queens.html',
  '/sudoku': 'sudoku.html',
  '/hamiltonian': 'hamiltonian.html',
  '/subsets': 'subsets.html',

  // Greedy Algorithms
  '/activity-selection': 'activity-selection.html',
  '/huffman': 'huffman.html',
  '/fractional-knapsack': 'fractional-knapsack.html',
  '/interval': 'interval.html',
  '/job-sequencing': 'job-sequencing.html',

  // Bit Manipulation
  '/bitwise-ops': 'bitwise-ops.html',
  '/xor': 'xor.html',
  '/bit-count': 'bit-count.html',
  '/bitmasking': 'bitmasking.html',

  // Geometry
  '/convex-hull': 'convex-hull.html',
  '/line-intersection': 'line-intersection.html',
  '/sweep-line': 'sweep-line.html',
  '/point-in-polygon': 'point-in-polygon.html',
  '/rotating-calipers': 'rotating-calipers.html',

  // Advanced Techniques
  '/mo': 'mo.html',
  '/hld': 'hld.html',
  '/centroid': 'centroid.html',
  '/persistent': 'persistent.html',
  '/sqrt-decomposition': 'sqrt-decomposition.html',
  '/monotonic': 'monotonic.html',
  '/sliding-window': 'sliding-window.html',
  '/two-pointers': 'two-pointers.html',
  '/meet-in-middle': 'meet-in-middle.html',

  // Recurrence / Divide and Conquer
  '/divide-conquer': 'divide-conquer.html',
  '/karatsuba': 'karatsuba.html',
  '/binary-search-answer': 'binary-search-answer.html',
  '/master-theorem': 'master-theorem.html',
  '/strassen': 'strassen.html',

  // Cryptography
  '/rsa': 'rsa.html',
  '/diffie-hellman': 'diffie-hellman.html',
  '/hash-functions': 'hash-functions.html',

  // Core Skills
  '/problem-decomposition': 'problem-decomposition.html',
  '/complexity-analysis': 'complexity-analysis.html',
  '/mathematical-proof': 'mathematical-proof.html',
  '/state-representation': 'state-representation.html',
  '/dp-vs-greedy': 'dp-vs-greedy.html',
  '/modeling': 'modeling.html'
};


async function renderPage(req, res) {
  try {
    const baseHTML = await readFile(path.join(__dirname, 'views/template.html'), 'utf8');
    const pageFile = pageMap[req.path];

    let content = '<h1>404</h1><p>Page not found.</p>';
    if (pageFile) {
      content = await readFile(path.join(__dirname, 'views/pages', pageFile), 'utf8');
    }

    const finalHTML = baseHTML.replace('<!-- SSR_CONTENT -->', content);
    res.send(finalHTML);
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

app.get('*', renderPage);

app.listen(port, () => {
  console.log(`✅ SSR app running at http://localhost:${port}`);
});
