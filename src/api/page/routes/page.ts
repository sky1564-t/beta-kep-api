import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';

const defaults = withDefaults('api::page.page');

export default factories.createCoreRouter('api::page.page', {
  only: ['find', 'findOne'],
  config: {
    find: { middlewares: [defaults] },
    findOne: { middlewares: [defaults] },
  },
});
