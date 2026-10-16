import type { Core } from '@strapi/strapi';

/**
 * Friendly Khmer · English labels and help text for the admin forms,
 * plus useful columns / sorting for the list pages.
 * Applied once on first start - you can still change them in
 * Content Manager › "Configure the view".
 */

type Label = string | [label: string, description: string];

const FIELD_LABELS: Record<string, Label> = {
  // common
  title: 'ចំណងជើង · Title',
  heading: 'ចំណងជើង · Heading',
  subtitle: 'ចំណងជើងរង · Subtitle',
  slug: ['Slug (URL)', 'អក្សរតូច a-z, 0-9 និង - ឧ. home, about, ten-day-course'],
  text: 'អត្ថបទ · Text',
  body: 'អត្ថបទ · Text',
  intro: 'សេចក្តីផ្ដើម · Intro',
  description: 'ពិពណ៌នា · Description',
  summary: ['សេចក្តីសង្ខេប · Summary', 'បង្ហាញក្នុងបញ្ជីវគ្គ (ខ្លីៗ)'],
  excerpt: ['សេចក្តីសង្ខេប · Excerpt', 'បង្ហាញក្នុងបញ្ជីព័ត៌មាន (ខ្លីៗ)'],
  content: 'អត្ថបទ · Content',
  image: 'រូបភាព · Image',
  images: ['រូបភាព · Images', 'អាចជ្រើសរូបច្រើនក្នុងពេលតែមួយ'],
  photos: ['រូបភាព · Photos', 'អាចជ្រើសរូបច្រើនក្នុងពេលតែមួយ'],
  cover: 'រូបភាពគម្រប · Cover image',
  photo: 'រូបថត · Photo',
  backgroundImage: 'រូបផ្ទៃខាងក្រោយ · Background image',
  buttonLabel: 'អក្សរលើប៊ូតុង · Button text',
  buttonUrl: ['តំណប៊ូតុង · Button link', 'ឧ. /courses ឬ https://...'],
  anchor: ['Anchor (id)', 'ឈ្មោះខ្លីឲ្យ frontend រក section នេះ ឧ. about, schedule'],
  location: 'ទីកន្លែង · Location',
  seo: 'SEO (Google / Facebook)',
  date: 'កាលបរិច្ឆេទ · Date',

  // site settings
  siteName: 'ឈ្មោះគេហទំព័រ · Site name',
  tagline: 'ពាក្យស្លោក · Tagline',
  logo: 'ឡូហ្គោ · Logo',
  favicon: ['Favicon', 'រូបតូចលើ tab browser (ការ៉េ)'],
  headerMenu: 'ម៉ឺនុយខាងលើ · Header menu',
  footerMenu: 'ម៉ឺនុយខាងក្រោម · Footer menu',
  contact: 'ទំនាក់ទំនង · Contact',
  socialLinks: ['បណ្ដាញសង្គម · Social links', 'ដូចគ្នាគ្រប់ភាសា'],
  donation: 'ការបរិច្ចាគ · Donation',
  footerText: 'អត្ថបទខាងក្រោម · Footer text',
  defaultSeo: 'SEO លំនាំដើម · Default SEO',

  // page
  sections: ['ផ្នែកនៃទំព័រ · Sections', 'ចុច + ដើម្បីបន្ថែម section ហើយអូសដើម្បីប្ដូរលំដាប់'],

  // post
  category: 'ប្រភេទ · Category',
  eventDate: ['ថ្ងៃព្រឹត្តិការណ៍ · Event date', 'សម្រាប់ប្រភេទ event'],
  videoUrl: ['តំណវីដេអូ · Video URL', 'YouTube ឬ Facebook'],

  // course
  startDate: 'ថ្ងៃចាប់ផ្ដើម · Start date',
  endDate: 'ថ្ងៃបញ្ចប់ · End date',
  registrationStatus: ['ស្ថានភាពចុះឈ្មោះ · Registration', 'open = បើក, waitlist = រង់ចាំ, full = ពេញ, closed = បិទ'],
  teachingLanguage: 'ភាសាបង្រៀន · Language',
  capacity: 'ចំនួនកន្លែង · Capacity',
  registrationUrl: ['តំណចុះឈ្មោះ · Registration link', 'ឧ. Google Form'],

  // teacher
  name: 'ឈ្មោះ · Name',
  role: 'តួនាទី · Role',
  bio: 'ជីវប្រវត្តិ · Biography',
  sortOrder: ['លំដាប់ · Order', 'លេខតូចបង្ហាញមុន'],

  // contact message
  email: 'អ៊ីមែល · Email',
  phone: 'ទូរស័ព្ទ · Phone',
  subject: 'ប្រធានបទ · Subject',
  message: 'សារ · Message',
  state: ['ស្ថានភាព · Status', 'new = ថ្មី, read = បានអាន, replied = បានឆ្លើយ'],
  note: ['កំណត់ចំណាំ · Internal note', 'សម្រាប់ admin ប៉ុណ្ណោះ'],

  // components
  label: 'អក្សរ · Label',
  url: ['តំណ · Link', 'ឧ. /about ឬ https://...'],
  openInNewTab: 'បើក tab ថ្មី · New tab',
  children: 'ម៉ឺនុយរង · Sub-menu',
  platform: 'បណ្ដាញ · Platform',
  address: 'អាសយដ្ឋាន · Address',
  openingHours: 'ម៉ោងបើក · Opening hours',
  googleMapsUrl: 'តំណ Google Maps',
  mapEmbedUrl: ['Map embed URL', 'Google Maps › Share › Embed a map › យកតែតំណក្នុង src="..."'],
  bankName: 'ធនាគារ · Bank',
  accountName: 'ឈ្មោះគណនី · Account name',
  accountNumber: 'លេខគណនី · Account number',
  khqr: 'រូប KHQR',
  metaTitle: 'ចំណងជើង SEO · Meta title',
  metaDescription: 'ពិពណ៌នា SEO · Meta description',
  shareImage: 'រូបពេល share · Share image',
  linkLabel: 'អក្សរតំណ · Link text',
  linkUrl: 'តំណ · Link',
  question: 'សំណួរ · Question',
  answer: 'ចម្លើយ · Answer',
  time: 'ម៉ោង · Time',
  activity: 'សកម្មភាព · Activity',
  items: 'ធាតុ · Items',
  cards: 'កាត · Cards',
  caption: 'ចំណងជើងរូប · Caption',
  imagePosition: 'ទីតាំងរូប · Image side',
  collection: ['បង្ហាញពី · Show', 'posts = ព័ត៌មាន, courses = វគ្គ, albums = អាល់ប៊ុម, teachers = គ្រូ'],
  limit: 'ចំនួន · How many',
};

const LIST_VIEWS: Record<string, { columns: string[]; sortBy?: string; order?: 'ASC' | 'DESC' }> = {
  'api::page.page': { columns: ['id', 'title', 'slug', 'updatedAt'] },
  'api::post.post': { columns: ['id', 'cover', 'title', 'category', 'eventDate'], sortBy: 'createdAt', order: 'DESC' },
  'api::course.course': {
    columns: ['id', 'title', 'startDate', 'endDate', 'registrationStatus'],
    sortBy: 'startDate',
    order: 'ASC',
  },
  'api::album.album': { columns: ['id', 'title', 'cover', 'photos', 'date'], sortBy: 'date', order: 'DESC' },
  'api::teacher.teacher': { columns: ['id', 'photo', 'name', 'role', 'sortOrder'], sortBy: 'sortOrder', order: 'ASC' },
  'api::contact-message.contact-message': {
    columns: ['id', 'name', 'email', 'phone', 'subject', 'state', 'createdAt'],
    sortBy: 'createdAt',
    order: 'DESC',
  },
};

function applyLabels(configuration: any) {
  for (const [field, meta] of Object.entries<any>(configuration.metadatas ?? {})) {
    const entry = FIELD_LABELS[field];
    if (!entry) continue;
    const [label, description] = Array.isArray(entry) ? entry : [entry, ''];
    if (meta.edit) {
      meta.edit.label = label;
      if (description) meta.edit.description = description;
    }
    if (meta.list) meta.list.label = label.split(' · ')[0];
  }
}

export async function configureAdminViews(strapi: Core.Strapi) {
  const contentManager = strapi.plugin('content-manager');
  const contentTypes = contentManager.service('content-types');
  const components = contentManager.service('components');

  for (const uid of Object.keys(strapi.contentTypes).filter((key) => key.startsWith('api::'))) {
    const configuration = await contentTypes.findConfiguration({ uid });
    applyLabels(configuration);

    const view = LIST_VIEWS[uid];
    if (view) {
      configuration.layouts.list = view.columns.filter((column) => column in (configuration.metadatas ?? {}));
      if (view.sortBy) {
        configuration.settings.defaultSortBy = view.sortBy;
        configuration.settings.defaultSortOrder = view.order ?? 'ASC';
      }
    }

    await contentTypes.updateConfiguration(
      { uid },
      { settings: configuration.settings, metadatas: configuration.metadatas, layouts: configuration.layouts }
    );
  }

  for (const uid of Object.keys(strapi.components).filter((key) => /^(shared|blocks)\./.test(key))) {
    const configuration = await components.findConfiguration({ uid, category: uid.split('.')[0] });
    applyLabels(configuration);
    await components.updateConfiguration(
      { uid },
      { settings: configuration.settings, metadatas: configuration.metadatas, layouts: configuration.layouts }
    );
  }
}
