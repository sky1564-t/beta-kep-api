import type { StrapiApp } from '@strapi/strapi/admin';
import { Calendar, Mail } from '@strapi/icons';

export default {
  config: {
    locales: [],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Vipassana Dhura — Admin',
        'Auth.form.welcome.subtitle': 'Log in to manage the website',
        'HomePage.header.subtitle': 'Manage pages, courses, news, photos and messages',
      },
    },
  },

  register(app: StrapiApp) {
    // Dashboard cards shown first on the admin home page
    // (runs after the built-in plugins registered their own widgets)
    app.widgets.register((widgets) => [
      {
        id: 'upcoming-courses',
        icon: Calendar,
        title: { id: 'kep.widget.upcoming-courses', defaultMessage: 'Upcoming courses · វគ្គខាងមុខ' },
        component: async () => (await import('./widgets/UpcomingCourses')).UpcomingCoursesWidget,
        link: {
          label: { id: 'kep.widget.all-courses', defaultMessage: 'All courses' },
          href: '/content-manager/collection-types/api::course.course',
        },
        permissions: [{ action: 'plugin::content-manager.explorer.read', subject: 'api::course.course' }],
      },
      {
        id: 'new-messages',
        icon: Mail,
        title: { id: 'kep.widget.new-messages', defaultMessage: 'New messages · សារថ្មី' },
        component: async () => (await import('./widgets/NewMessages')).NewMessagesWidget,
        link: {
          label: { id: 'kep.widget.all-messages', defaultMessage: 'All messages' },
          href: '/content-manager/collection-types/api::contact-message.contact-message',
        },
        permissions: [
          { action: 'plugin::content-manager.explorer.read', subject: 'api::contact-message.contact-message' },
        ],
      },
      ...widgets,
    ]);
  },
};
