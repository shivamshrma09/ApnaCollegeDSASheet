import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://plusdsa.vercel.app';

const routes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/dsa-sheet', priority: '0.9', changefreq: 'weekly' },
  { url: '/sheet/apnaCollege', priority: '0.9', changefreq: 'weekly' },
  { url: '/sheet/striverSDE', priority: '0.8', changefreq: 'weekly' },
  { url: '/sheet/blind75', priority: '0.8', changefreq: 'weekly' },
  { url: '/sheet/neetcode150', priority: '0.8', changefreq: 'weekly' },
  { url: '/sheet/loveBabbar', priority: '0.8', changefreq: 'weekly' },
  { url: '/competitive', priority: '0.7', changefreq: 'weekly' },
  { url: '/mentorship', priority: '0.7', changefreq: 'weekly' },
  { url: '/interview', priority: '0.7', changefreq: 'weekly' },
  { url: '/roadmap', priority: '0.6', changefreq: 'monthly' },
  { url: '/code-editor', priority: '0.6', changefreq: 'monthly' },
  
  // Topic pages
  { url: '/topic/arrays', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/strings', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/trees', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/linkedlists', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/dp', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/stacks-queues', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/graphs', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/binary-search', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/sorting', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/greedy', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/backtracking', priority: '0.6', changefreq: 'weekly' },
  { url: '/topic/bit-manipulation', priority: '0.6', changefreq: 'weekly' },
];

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  routes.forEach(route => {
    sitemap += `
  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap generated successfully at:', sitemapPath);
}

generateSitemap();