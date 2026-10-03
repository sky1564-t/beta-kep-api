export default {
  routes: [
    {
      method: 'GET',
      path: '/posts/slug/:slug',
      handler: 'post.findBySlug',
    },
  ],
};
