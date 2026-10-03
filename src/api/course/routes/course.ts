import { factories } from '@strapi/strapi';
import { withDefaults } from '../../../utils/populate';
import { todayInSiteTimezone } from '../../../utils/dates';

const defaults = withDefaults('api::course.course', {
  sort: ['startDate:asc'],
  flags: {
    // /api/courses?upcoming=true -> courses that have not finished yet
    upcoming: () => {
      const today = todayInSiteTimezone();
      return {
        $or: [
          { endDate: { $gte: today } },
          { $and: [{ endDate: { $null: true } }, { startDate: { $gte: today } }] },
        ],
      };
    },
  },
});

export default factories.createCoreRouter('api::course.course', {
  only: ['find', 'findOne'],
  config: {
    find: { middlewares: [defaults] },
    findOne: { middlewares: [defaults] },
  },
});
