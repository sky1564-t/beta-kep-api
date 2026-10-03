/**
 * Small client for the Vipassana Dhura CMS API (Strapi 5). No dependencies.
 * Works in Vue 2 / Vue 3 / Nuxt / plain JS.
 *
 *   import { createCms } from './frontend-kit/cms';
 *
 *   export const cms = createCms({
 *     baseUrl: process.env.VUE_APP_CMS_URL,      // Vue CLI  (.env: VUE_APP_CMS_URL=https://cms.kepvipassana.org)
 *     // baseUrl: import.meta.env.VITE_CMS_URL,  // Vite
 *     locale: 'km',
 *   });
 *
 *   const site = await cms.global();                          // logo, menu, contact...
 *   const home = await cms.page('home');                      // { title, sections: [...], seo }
 *   const { items } = await cms.courses({ upcoming: true, limit: 3 });
 *   const url = cms.media(home.sections[0].backgroundImage, 'large');
 */

function toQuery(params) {
  const parts = [];
  const add = (key, value) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => add(`${key}[${index}]`, item));
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((child) => add(key ? `${key}[${child}]` : child, value[child]));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  };
  add('', params);
  return parts.join('&');
}

export function createCms({ baseUrl = 'http://localhost:1337', locale = 'km', fetch: fetchFn } = {}) {
  const base = String(baseUrl || '').replace(/\/+$/, '');
  const doFetch = fetchFn || ((...args) => fetch(...args));
  let currentLocale = locale;

  async function request(path, params = {}, options = {}) {
    const query = toQuery(params);
    const response = await doFetch(`${base}/api${path}${query ? `?${query}` : ''}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error((json && json.error && json.error.message) || `CMS request failed (${response.status})`);
      error.status = response.status;
      error.details = json && json.error && json.error.details;
      throw error;
    }
    return json;
  }

  async function list(collection, { locale: lang, page = 1, pageSize = 12, limit, sort, filters, ...extra } = {}) {
    const json = await request(`/${collection}`, {
      locale: lang || currentLocale,
      pagination: limit ? { limit } : { page, pageSize },
      sort,
      filters,
      ...extra,
    });
    return { items: json.data || [], pagination: json.meta && json.meta.pagination };
  }

  async function one(path, lang) {
    try {
      const json = await request(path, { locale: lang || currentLocale });
      return json.data;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  /** Full URL of an uploaded file. size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' */
  function media(file, size) {
    if (!file) return '';
    const chosen = (size && file.formats && file.formats[size]) || file;
    const url = chosen.url || '';
    return /^https?:\/\//.test(url) ? url : `${base}${url}`;
  }

  /** srcset string for responsive <img> */
  function srcset(file) {
    if (!file || !file.formats) return '';
    return Object.values(file.formats)
      .filter((format) => format && format.url && format.width)
      .sort((a, b) => a.width - b.width)
      .map((format) => `${media(format)} ${format.width}w`)
      .concat(file.width ? [`${media(file)} ${file.width}w`] : [])
      .join(', ');
  }

  return {
    get locale() {
      return currentLocale;
    },
    setLocale(code) {
      currentLocale = code;
    },

    media,
    srcset,

    global: (lang) => one('/global', lang),

    page: (slug, lang) => one(`/pages/slug/${encodeURIComponent(slug)}`, lang),

    /** category: 'news' | 'event' | 'dhamma' | 'announcement' */
    posts: ({ category, ...options } = {}) =>
      list('posts', { ...options, filters: category ? { category: { $eq: category } } : options.filters }),
    post: (slug, lang) => one(`/posts/slug/${encodeURIComponent(slug)}`, lang),

    /** upcoming: true -> only courses that have not finished yet */
    courses: ({ upcoming = false, ...options } = {}) =>
      list('courses', { ...options, ...(upcoming ? { upcoming: 'true' } : {}) }),
    course: (slug, lang) => one(`/courses/slug/${encodeURIComponent(slug)}`, lang),

    albums: (options = {}) => list('albums', options),
    album: (slug, lang) => one(`/albums/slug/${encodeURIComponent(slug)}`, lang),

    teachers: (options = {}) => list('teachers', { pageSize: 100, ...options }),

    /** { name, email?, phone?, subject?, message, website? (hidden honeypot, keep empty) } */
    sendContact: (form) => request('/contact', {}, { method: 'POST', body: JSON.stringify(form) }),
  };
}
