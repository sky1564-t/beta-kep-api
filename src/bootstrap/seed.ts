import type { Core } from '@strapi/strapi';
import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { dateFromToday } from '../utils/dates';

/**
 * Demo content so you can see how everything works.
 * Runs only when SEED_DEMO=true and there are no pages yet.
 * Every text marked (គំរូ)/(sample) is placeholder - replace it in the dashboard.
 */

type Data = Record<string, any>;

const paragraphs = (...lines: string[]) =>
  lines.map((text) => ({ type: 'paragraph', children: [{ type: 'text', text }] }));

const GRADIENTS: Array<[string, string]> = [
  ['#7c2d12', '#f59e0b'],
  ['#422006', '#eab308'],
  ['#1c1917', '#d97706'],
  ['#14532d', '#a3a33a'],
  ['#431407', '#fb923c'],
  ['#292524', '#fbbf24'],
];

async function demoImage(strapi: Core.Strapi, index: number, label: string): Promise<number> {
  const [from, to] = GRADIENTS[index % GRADIENTS.length];
  const fileName = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`;
  const width = 1600;
  const height = 1000;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${width * 0.72}" cy="${height * 0.36}" r="170" fill="#fff7ed" opacity="0.2"/>
    <path d="M0 ${height * 0.78} Q ${width * 0.3} ${height * 0.62} ${width * 0.55} ${height * 0.76} T ${width} ${height * 0.7} V ${height} H 0 Z" fill="#000" opacity="0.2"/>
    <text x="80" y="${height - 90}" font-family="DejaVu Sans, Arial, sans-serif" font-size="56" fill="#ffffff" opacity="0.92">${label}</text>
  </svg>`;

  const filepath = path.join(os.tmpdir(), `kep-demo-${index}-${Date.now()}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(filepath);
  const { size } = await fs.stat(filepath);

  try {
    const [file] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: { fileInfo: { name: fileName, alternativeText: label, caption: label } },
        files: { filepath, originalFilename: fileName, mimetype: 'image/jpeg', size },
      });
    return file.id;
  } finally {
    await fs.rm(filepath, { force: true });
  }
}

async function createKmEn(strapi: Core.Strapi, uid: string, km: Data, en: Data, shared: Data = {}) {
  const documents = strapi.documents(uid as any) as any;
  const model = strapi.getModel(uid as any) as any;
  const publish = model?.options?.draftAndPublish ? { status: 'published' } : {};

  const created = await documents.create({ locale: 'km', data: { ...shared, ...km }, ...publish });
  await documents.update({
    documentId: created.documentId,
    locale: 'en',
    data: { ...shared, ...en },
    ...publish,
  });
  return created.documentId as string;
}

export async function seedDemoContent(strapi: Core.Strapi) {
  const pages = await strapi.db.query('api::page.page').count();
  if (pages > 0) return;

  const locales = strapi.plugin('i18n').service('locales');
  if (!(await locales.findByCode('km')) || !(await locales.findByCode('en'))) {
    strapi.log.warn('[kep-cms] Demo seed skipped: needs the "km" and "en" locales.');
    return;
  }

  strapi.log.info('[kep-cms] Adding demo content...');

  const img = {
    hero: await demoImage(strapi, 0, 'Hero banner (demo)'),
    about: await demoImage(strapi, 1, 'About (demo)'),
    course: await demoImage(strapi, 2, 'Course (demo)'),
    news: await demoImage(strapi, 3, 'News (demo)'),
    teacher: await demoImage(strapi, 4, 'Teacher (demo)'),
    photo1: await demoImage(strapi, 5, 'Photo 1 (demo)'),
    photo2: await demoImage(strapi, 1, 'Photo 2 (demo)'),
    photo3: await demoImage(strapi, 3, 'Photo 3 (demo)'),
  };

  // ---------- Site settings ----------
  const siteKm = 'មជ្ឈមណ្ឌលពុទ្ធសាសនា វិបស្សនាធុរៈ';
  const siteEn = 'Vipassana Dhura Buddhist Center';

  await createKmEn(
    strapi,
    'api::global.global',
    {
      siteName: siteKm,
      tagline: 'ទីកន្លែងសិក្សា និងអនុវត្តសមាធិវិបស្សនា',
      headerMenu: [
        { label: 'ទំព័រដើម', url: '/' },
        { label: 'អំពីយើង', url: '/about' },
        { label: 'វគ្គសមាធិ', url: '/courses' },
        { label: 'ព័ត៌មាន', url: '/news' },
        { label: 'រូបភាព', url: '/gallery' },
        { label: 'ទំនាក់ទំនង', url: '/contact' },
      ],
      footerMenu: [
        { label: 'បរិច្ចាគ', url: '/donate' },
        { label: 'សំណួរញឹកញាប់', url: '/about#faq' },
      ],
      contact: {
        phone: '(បញ្ចូលលេខទូរស័ព្ទ)',
        email: 'info@example.com',
        address: '(បញ្ចូលអាសយដ្ឋានពិត)',
        openingHours: '(ម៉ោងបើក)',
      },
      donation: {
        heading: 'ការបរិច្ចាគ',
        description: '(អត្ថបទគំរូ) រាល់ការបរិច្ចាគជួយទ្រទ្រង់ការរៀបចំវគ្គសមាធិ។',
        bankName: '(ឈ្មោះធនាគារ)',
        accountName: '(ឈ្មោះគណនី)',
        accountNumber: '(លេខគណនី)',
      },
      footerText: `© ${siteKm}`,
      defaultSeo: { metaTitle: siteKm, metaDescription: 'ទីកន្លែងសិក្សា និងអនុវត្តសមាធិវិបស្សនា' },
    },
    {
      siteName: siteEn,
      tagline: 'A place to study and practise Vipassana meditation',
      headerMenu: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Courses', url: '/courses' },
        { label: 'News', url: '/news' },
        { label: 'Gallery', url: '/gallery' },
        { label: 'Contact', url: '/contact' },
      ],
      footerMenu: [
        { label: 'Donate', url: '/donate' },
        { label: 'FAQ', url: '/about#faq' },
      ],
      contact: {
        phone: '(add phone number)',
        email: 'info@example.com',
        address: '(add the real address)',
        openingHours: '(opening hours)',
      },
      donation: {
        heading: 'Donate',
        description: '(sample text) Every donation helps us run meditation courses.',
        bankName: '(bank name)',
        accountName: '(account name)',
        accountNumber: '(account number)',
      },
      footerText: `© ${siteEn}`,
      defaultSeo: { metaTitle: siteEn, metaDescription: 'A place to study and practise Vipassana meditation' },
    },
    {
      socialLinks: [{ platform: 'facebook', url: 'https://www.facebook.com/' }],
    }
  );

  // ---------- Pages ----------
  await createKmEn(
    strapi,
    'api::page.page',
    {
      title: 'ទំព័រដើម',
      sections: [
        {
          __component: 'blocks.hero',
          anchor: 'hero',
          title: siteKm,
          subtitle: 'ស្វាគមន៍មកកាន់មជ្ឈមណ្ឌល — អត្ថបទនេះអាចកែបាននៅក្នុង dashboard។',
          backgroundImage: img.hero,
          buttonLabel: 'មើលវគ្គសមាធិ',
          buttonUrl: '/courses',
        },
        {
          __component: 'blocks.rich-text',
          anchor: 'about',
          heading: 'អំពីយើង',
          body: paragraphs('(អត្ថបទគំរូ) សូមដាក់ប្រវត្តិ និងគោលបំណងរបស់មជ្ឈមណ្ឌលនៅទីនេះ។'),
        },
        {
          __component: 'blocks.timetable',
          anchor: 'schedule',
          heading: 'កាលវិភាគប្រចាំថ្ងៃ',
          intro: '(គំរូ) សូមកែឲ្យត្រូវនឹងកាលវិភាគពិត។',
          items: [
            { time: '04:30', activity: 'សមាធិពេលព្រឹក' },
            { time: '06:30', activity: 'អាហារពេលព្រឹក' },
            { time: '08:00', activity: 'សមាធិជាក្រុម' },
            { time: '19:00', activity: 'ធម្មទេសនា' },
          ],
        },
        {
          __component: 'blocks.collection-list',
          anchor: 'courses',
          heading: 'វគ្គសមាធិខាងមុខ',
          collection: 'courses',
          limit: 3,
        },
        {
          __component: 'blocks.gallery',
          anchor: 'gallery',
          heading: 'រូបភាព',
          images: [img.photo1, img.photo2, img.photo3],
        },
        {
          __component: 'blocks.cta',
          anchor: 'donate',
          heading: 'ចូលរួមគាំទ្រមជ្ឈមណ្ឌល',
          text: '(អត្ថបទគំរូ) ការបរិច្ចាគរបស់អ្នកជួយឲ្យវគ្គសមាធិបន្តដំណើរការ។',
          buttonLabel: 'របៀបបរិច្ចាគ',
          buttonUrl: '/donate',
        },
      ],
      seo: { metaTitle: siteKm, metaDescription: 'ទីកន្លែងសិក្សា និងអនុវត្តសមាធិវិបស្សនា' },
    },
    {
      title: 'Home',
      sections: [
        {
          __component: 'blocks.hero',
          anchor: 'hero',
          title: siteEn,
          subtitle: 'Welcome to the center - you can edit this text in the dashboard.',
          backgroundImage: img.hero,
          buttonLabel: 'See courses',
          buttonUrl: '/courses',
        },
        {
          __component: 'blocks.rich-text',
          anchor: 'about',
          heading: 'About us',
          body: paragraphs('(sample text) Put the history and purpose of the center here.'),
        },
        {
          __component: 'blocks.timetable',
          anchor: 'schedule',
          heading: 'Daily schedule',
          intro: '(sample) Edit to match the real schedule.',
          items: [
            { time: '04:30', activity: 'Morning meditation' },
            { time: '06:30', activity: 'Breakfast' },
            { time: '08:00', activity: 'Group meditation' },
            { time: '19:00', activity: 'Dhamma talk' },
          ],
        },
        {
          __component: 'blocks.collection-list',
          anchor: 'courses',
          heading: 'Upcoming courses',
          collection: 'courses',
          limit: 3,
        },
        {
          __component: 'blocks.gallery',
          anchor: 'gallery',
          heading: 'Gallery',
          images: [img.photo1, img.photo2, img.photo3],
        },
        {
          __component: 'blocks.cta',
          anchor: 'donate',
          heading: 'Support the center',
          text: '(sample text) Your donation keeps the meditation courses running.',
          buttonLabel: 'How to donate',
          buttonUrl: '/donate',
        },
      ],
      seo: { metaTitle: siteEn, metaDescription: 'A place to study and practise Vipassana meditation' },
    },
    { slug: 'home' }
  );

  await createKmEn(
    strapi,
    'api::page.page',
    {
      title: 'អំពីយើង',
      sections: [
        { __component: 'blocks.hero', anchor: 'hero', title: 'អំពីយើង', subtitle: '(អត្ថបទគំរូ)', backgroundImage: img.about },
        {
          __component: 'blocks.image-text',
          anchor: 'history',
          heading: 'ប្រវត្តិមជ្ឈមណ្ឌល',
          body: paragraphs('(អត្ថបទគំរូ) សូមសរសេរប្រវត្តិមជ្ឈមណ្ឌលនៅទីនេះ។'),
          image: img.about,
          imagePosition: 'right',
        },
        {
          __component: 'blocks.faq',
          anchor: 'faq',
          heading: 'សំណួរញឹកញាប់',
          items: [
            { question: 'តើចុះឈ្មោះចូលវគ្គដោយរបៀបណា?', answer: '(ចម្លើយគំរូ) សូមមើលទំព័រវគ្គសមាធិ ហើយចុចប៊ូតុងចុះឈ្មោះ។' },
            { question: 'តើត្រូវយកអ្វីមកជាមួយ?', answer: '(ចម្លើយគំរូ) សូមដាក់បញ្ជីរបស់របរដែលត្រូវយកមក។' },
          ],
        },
      ],
    },
    {
      title: 'About us',
      sections: [
        { __component: 'blocks.hero', anchor: 'hero', title: 'About us', subtitle: '(sample text)', backgroundImage: img.about },
        {
          __component: 'blocks.image-text',
          anchor: 'history',
          heading: 'Our history',
          body: paragraphs('(sample text) Write the history of the center here.'),
          image: img.about,
          imagePosition: 'right',
        },
        {
          __component: 'blocks.faq',
          anchor: 'faq',
          heading: 'FAQ',
          items: [
            { question: 'How do I register for a course?', answer: '(sample answer) Open the Courses page and press the register button.' },
            { question: 'What should I bring?', answer: '(sample answer) List what people need to bring.' },
          ],
        },
      ],
    },
    { slug: 'about' }
  );

  // ---------- Courses ----------
  await createKmEn(
    strapi,
    'api::course.course',
    {
      title: 'វគ្គសមាធិ ១០ ថ្ងៃ (គំរូ)',
      summary: '(អត្ថបទគំរូ) វគ្គសមាធិវិបស្សនារយៈពេល ១០ ថ្ងៃ។',
      description: paragraphs('(អត្ថបទគំរូ) ពិពណ៌នាអំពីវគ្គ ច្បាប់ និងអ្វីដែលត្រូវរៀបចំ។'),
      teachingLanguage: 'ខ្មែរ / English',
      location: '(ទីតាំងមជ្ឈមណ្ឌល)',
    },
    {
      title: '10-day meditation course (sample)',
      summary: '(sample text) A 10-day Vipassana meditation course.',
      description: paragraphs('(sample text) Describe the course, the rules and what to prepare.'),
      teachingLanguage: 'Khmer / English',
      location: '(center location)',
    },
    {
      slug: 'ten-day-course-sample',
      startDate: dateFromToday(30),
      endDate: dateFromToday(40),
      registrationStatus: 'open',
      capacity: 40,
      cover: img.course,
    }
  );

  await createKmEn(
    strapi,
    'api::course.course',
    {
      title: 'វគ្គសមាធិ ៣ ថ្ងៃ (គំរូ)',
      summary: '(អត្ថបទគំរូ) វគ្គខ្លីសម្រាប់អ្នកទើបចាប់ផ្ដើម។',
      description: paragraphs('(អត្ថបទគំរូ) ពិពណ៌នាអំពីវគ្គ។'),
      teachingLanguage: 'ខ្មែរ',
      location: '(ទីតាំងមជ្ឈមណ្ឌល)',
    },
    {
      title: '3-day meditation course (sample)',
      summary: '(sample text) A short course for beginners.',
      description: paragraphs('(sample text) Describe the course.'),
      teachingLanguage: 'Khmer',
      location: '(center location)',
    },
    {
      slug: 'three-day-course-sample',
      startDate: dateFromToday(60),
      endDate: dateFromToday(62),
      registrationStatus: 'waitlist',
      capacity: 25,
      cover: img.course,
    }
  );

  // ---------- Posts ----------
  await createKmEn(
    strapi,
    'api::post.post',
    {
      title: 'សេចក្តីជូនដំណឹង៖ បើកចុះឈ្មោះវគ្គសមាធិថ្មី (គំរូ)',
      excerpt: '(អត្ថបទគំរូ) មជ្ឈមណ្ឌលបើកទទួលចុះឈ្មោះសម្រាប់វគ្គខាងមុខ។',
      content: paragraphs('(អត្ថបទគំរូ) ព័ត៌មានលម្អិតអំពីការចុះឈ្មោះ។'),
    },
    {
      title: 'Announcement: registration is open (sample)',
      excerpt: '(sample text) Registration is open for the next course.',
      content: paragraphs('(sample text) Registration details.'),
    },
    { slug: 'registration-open-sample', category: 'announcement', cover: img.news }
  );

  await createKmEn(
    strapi,
    'api::post.post',
    {
      title: 'ពិធីបុណ្យ (ព្រឹត្តិការណ៍គំរូ)',
      excerpt: '(អត្ថបទគំរូ) អញ្ជើញចូលរួមកម្មវិធីបុណ្យ។',
      content: paragraphs('(អត្ថបទគំរូ) កម្មវិធី និងពេលវេលា។'),
      location: '(ទីតាំង)',
    },
    {
      title: 'Community ceremony (sample event)',
      excerpt: '(sample text) Join our ceremony.',
      content: paragraphs('(sample text) Programme and times.'),
      location: '(location)',
    },
    {
      slug: 'community-ceremony-sample',
      category: 'event',
      eventDate: `${dateFromToday(14)}T01:00:00.000Z`,
      cover: img.photo2,
    }
  );

  // ---------- Album ----------
  await createKmEn(
    strapi,
    'api::album.album',
    { title: 'រូបភាពសកម្មភាព (គំរូ)', description: '(អត្ថបទគំរូ) រូបភាពពីសកម្មភាពនានា។' },
    { title: 'Activities (sample)', description: '(sample text) Photos from our activities.' },
    {
      slug: 'activities-sample',
      date: dateFromToday(0),
      cover: img.photo1,
      photos: [img.photo1, img.photo2, img.photo3],
    }
  );

  // ---------- Teacher ----------
  await createKmEn(
    strapi,
    'api::teacher.teacher',
    { name: 'ព្រះគ្រូ (ឈ្មោះគំរូ)', role: 'គ្រូបង្រៀនសមាធិ', bio: paragraphs('(អត្ថបទគំរូ) ជីវប្រវត្តិសង្ខេប។') },
    { name: 'Teacher (sample name)', role: 'Meditation teacher', bio: paragraphs('(sample text) Short biography.') },
    { photo: img.teacher, sortOrder: 1 }
  );

  // ---------- One inbox message ----------
  await strapi.documents('api::contact-message.contact-message').create({
    data: {
      name: 'ភ្ញៀវគំរូ (demo)',
      email: 'visitor@example.com',
      subject: 'សួរអំពីវគ្គសមាធិ',
      message: 'សួស្ដី! ខ្ញុំចង់សួរអំពីវគ្គសមាធិខាងមុខ។ (សារគំរូ)',
      state: 'new',
    } as any,
  });

  strapi.log.info('[kep-cms] Demo content added.');
}
