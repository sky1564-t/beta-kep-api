import type { Core } from '@strapi/strapi';

const hostOf = (url?: string) => {
  try {
    return url ? new URL(url).host : null;
  } catch {
    return null;
  }
};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  // lets the admin panel show images stored on R2/S3
  const mediaHost = hostOf(env('S3_PUBLIC_URL'));
  const mediaSources = [
    "'self'", 
    'data:', 
    'blob:', 
    'market-assets.strapi.io', 
    '*.cloudflarestorage.com', 
    '*.r2.dev', 
    ...(mediaHost ? [mediaHost] : [])
  ];

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': mediaSources,
            'media-src': mediaSources,
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        // websites allowed to call the API from the browser (comma separated in .env)
        origin: env.array('CORS_ORIGINS', [
          'http://localhost:8080',
          'http://localhost:5173',
          'http://localhost:3000',
          'https://kepvipassana.org',
          'https://www.kepvipassana.org',
        ]),
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    {
      name: 'strapi::body',
      config: {
        formidable: {
          maxFileSize: env.int('UPLOAD_MAX_MB', 25) * 1024 * 1024,
        },
      },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
