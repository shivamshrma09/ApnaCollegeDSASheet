import fs from 'fs';
import path from 'path';

const generateSitemap = () => {
  const baseUrl = 'https://plusdsa.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/problems', priority: '0.9', changefreq: 'daily' },
    { loc: '/practice', priority: '0.9', changefreq: 'daily' },
    { loc: '/dashboard', priority: '0.8', changefreq: 'weekly' },
    { loc: '/login', priority: '0.6', changefreq: 'monthly' },
    { loc: '/signup', priority: '0.6', changefreq: 'monthly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' }
  ];

  // Add problem pages (assuming 373 problems)
  for (let i = 1; i <= 373; i++) {
    urls.push({
      loc: `/problems/${i}`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully!');
};

generateSitemap();