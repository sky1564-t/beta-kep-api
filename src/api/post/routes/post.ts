import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';

const defaults = withDefaults('api::post.post', {
  sort: ['publishedAt:desc'],
});

export default factories.createCoreRouter('api::post.post', {
  only: ['find', 'findOne'],
  config: {
    find: { middlewares: [defaults] },
    findOne: { middlewares: [defaults] },
  },
});
