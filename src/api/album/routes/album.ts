import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';

const defaults = withDefaults('api::album.album', {
  sort: ['date:desc', 'publishedAt:desc'],
});

export default factories.createCoreRouter('api::album.album', {
  only: ['find', 'findOne'],
  config: {
    find: { middlewares: [defaults] },
    findOne: { middlewares: [defaults] },
  },
});
