const express = require('express');
const router = express.Router();

// Dynamic sitemap generation
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://verifymykyc.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/products', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/reviews', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/custom-pricing', priority: '0.8', changefreq: 'weekly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
    { url: '/login', priority: '0.5', changefreq: 'monthly' },
    { url: '/register', priority: '0.5', changefreq: 'monthly' }
  ];

  const productPages = [
    'aadhaar', 'pan', 'drivinglicense', 'passport', 'gstin', 
    'voterid', 'vehicle', 'ccrv', 'company'
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add product pages
  productPages.forEach(product => {
    sitemap += `
  <url>
    <loc>${baseUrl}/products/${product}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Add solutions pages
  sitemap += `
  <url>
    <loc>${baseUrl}/solutions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  sitemap += `
</urlset>`;

  res.set('Content-Type', 'text/xml');
  res.send(sitemap);
});

// Robots.txt endpoint
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /checkout/
Disallow: /payment-success/

# Allow important pages
Allow: /products/
Allow: /solutions/
Allow: /blog/
Allow: /about
Allow: /contact
Allow: /reviews
Allow: /custom-pricing

# Sitemap location
Sitemap: https://verifymykyc.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;
