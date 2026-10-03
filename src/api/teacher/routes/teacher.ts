import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';

const defaults = withDefaults('api::teacher.teacher', {
  sort: ['sortOrder:asc', 'name:asc'],
});

export default factories.createCoreRouter('api::teacher.teacher', {
  only: ['find', 'findOne'],
  config: {
    find: { middlewares: [defaults] },
    findOne: { middlewares: [defaults] },
  },
});
