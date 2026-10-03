import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';

export default factories.createCoreRouter('api::global.global', {
  only: ['find'],
  config: {
    find: { middlewares: [withDefaults('api::global.global')] },
  },
});
