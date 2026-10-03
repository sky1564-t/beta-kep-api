export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/slug/:slug',
      handler: 'course.findBySlug',
    },
  ],
};
