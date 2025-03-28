import fetchDynamicRoutes from './lib/sitemap.mjs';

export default {
  siteUrl: process.env.NEXT_PUBLIC_URL_BLOG || 'https://blog.builderseunegocioonline.com.br',
  generateRobotsTxt: true,
  autoLastmod: true,
  generateIndexSitemap: false,
  exclude: [
    '/dashboard/**',
    '/user/**',
    '/contacts_form/**',
    '/newsletter',
    '/categories/**',
    '/tags/**',
    '/posts/**',
    '/marketing_publication/**',
    '/configurations/**',
    '/server-sitemap.xml',
    '/central_notifications',
    '/login',
    '/register',
    '/recover_password/**',
    '/recover_password_user_blog/**',
    '/not-found',
    '/unauthorized',
    '/_error',
    '/_next/**',
    '/api/**'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/**',
          '/user/**',
          '/contacts_form/**',
          '/categories/**',
          '/tags/**',
          '/posts/**',
          '/marketing_publication/**',
          '/configurations/**',
          '/recover_password/**',
          '/recover_password_user_blog/**',
          '/_next/',
          '/api/'
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_URL_BLOG}/sitemap.xml`
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/posts_blog': 0.9
    };

    if (path.startsWith('/article/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      };
    }

    return {
      loc: path,
      changefreq: 'daily',
      priority: priorities[path] || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    try {
      const dynamicRoutes = await fetchDynamicRoutes();
      return dynamicRoutes.map((route) => ({
        loc: route.loc,
        lastmod: route.lastmod || new Date().toISOString(),
        changefreq: 'weekly',
        priority: route.priority || 0.7,
      }));
    } catch (error) {
      console.error('Error generating dynamic routes:', error);
      return [];
    }
  }
};