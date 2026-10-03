import type { Core } from '@strapi/strapi';
import { runFirstTimeSetup } from './bootstrap/setup';
import { seedDemoContent } from './bootstrap/seed';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await runFirstTimeSetup(strapi);

    if (process.env.SEED_DEMO === 'true') {
      await seedDemoContent(strapi);
    }
  },
};
