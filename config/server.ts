import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // public address of this backend, e.g. https://cms.kepvipassana.org
  url: env('PUBLIC_URL', ''),
  // set IS_PROXIED=true behind Nginx / a load balancer (real visitor IP for the contact form limit)
  proxy: {
    koa: env.bool('IS_PROXIED', false),
  },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
