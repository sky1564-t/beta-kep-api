import type { Core } from '@strapi/strapi';
import { configureAdminViews } from './admin-views';

/**
 * Runs once on the first start (and again only when SETUP_VERSION goes up):
 *  - adds the Khmer + English locales and sets the default one
 *  - lets the public website read published content and send the contact form
 *  - turns off public visitor sign-up (the site has no member accounts)
 *  - turns on image auto-rotate / optimisation / responsive sizes
 *  - gives the admin forms Khmer · English labels and useful list columns
 *
 * After that, admins can change everything in Settings without it being overwritten.
 */
const SETUP_VERSION = 1;

const PUBLIC_ACTIONS = [
  'api::global.global.find',
  'api::page.page.find',
  'api::page.page.findOne',
  'api::page.page.findBySlug',
  'api::post.post.find',
  'api::post.post.findOne',
  'api::post.post.findBySlug',
  'api::course.course.find',
  'api::course.course.findOne',
  'api::course.course.findBySlug',
  'api::album.album.find',
  'api::album.album.findOne',
  'api::album.album.findBySlug',
  'api::teacher.teacher.find',
  'api::teacher.teacher.findOne',
  'api::contact-message.contact-message.submit',
];

const LOCALE_NAMES: Record<string, string> = {
  km: 'ខ្មែរ (km)',
  en: 'English (en)',
};

export async function runFirstTimeSetup(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'kep-cms', key: 'setup' });
  const state = ((await store.get()) as { version?: number } | null) ?? {};

  if ((state.version ?? 0) >= SETUP_VERSION) return;

  await ensureLocales(strapi);
  await grantPublicPermissions(strapi);
  await disablePublicSignUp(strapi);
  await tuneUploadSettings(strapi);
  await configureAdminViews(strapi);

  await store.set({ value: { version: SETUP_VERSION, at: new Date().toISOString() } });
  strapi.log.info('[kep-cms] First-time setup done (locales, public API permissions, upload settings).');
}

async function ensureLocales(strapi: Core.Strapi) {
  const locales = strapi.plugin('i18n').service('locales');
  const codes = (process.env.CMS_LOCALES || 'km,en')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);

  for (const code of codes) {
    if (!(await locales.findByCode(code))) {
      await locales.create({ code, name: LOCALE_NAMES[code] ?? code });
    }
  }

  const defaultCode = process.env.CMS_DEFAULT_LOCALE || codes[0];
  if (defaultCode && (await locales.findByCode(defaultCode))) {
    await locales.setDefaultLocale({ code: defaultCode });
  }
}

async function grantPublicPermissions(strapi: Core.Strapi) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!role) return;

  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: { id: role.id } } });

  const granted = new Set(existing.map((permission: { action: string }) => permission.action));

  for (const action of PUBLIC_ACTIONS) {
    if (!granted.has(action)) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: role.id } });
    }
  }
}

async function disablePublicSignUp(strapi: Core.Strapi) {
  // The website has no visitor accounts. Turn it back on in
  // Settings › Users & Permissions › Advanced settings if you ever need it.
  const store = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' });
  const advanced = ((await store.get()) as Record<string, unknown> | null) ?? {};
  await store.set({ value: { ...advanced, allow_register: false } });
}

async function tuneUploadSettings(strapi: Core.Strapi) {
  const upload = strapi.plugin('upload').service('upload');
  const settings = (await upload.getSettings()) ?? {};

  await upload.setSettings({
    ...settings,
    sizeOptimization: true,
    responsiveDimensions: true,
    autoOrientation: true,
  });
}
