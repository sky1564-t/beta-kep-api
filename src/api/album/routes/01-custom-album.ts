export default {
  routes: [
    {
      method: 'GET',
      path: '/albums/slug/:slug',
      handler: 'album.findBySlug',
    },
  ],
};
