import { factories } from '@strapi/strapi';
import { findPublishedBySlug } from '../../../utils/find-by-slug';

export default factories.createCoreController('api::page.page', () => ({
  async findBySlug(ctx) {
    return findPublishedBySlug(this, ctx, 'api::page.page');
  },
}));
