<template>
  <div class="cms-sections">
    <section
      v-for="section in sections"
      :id="section.anchor || null"
      :key="section.__component + '-' + section.id"
      :class="['cms-section', 'cms-' + type(section)]"
    >
      <!-- Hero -->
      <div v-if="type(section) === 'hero'" class="cms-hero" :style="background(section.backgroundImage)">
        <div class="cms-container">
          <h1>{{ section.title }}</h1>
          <p v-if="section.subtitle">{{ section.subtitle }}</p>
          <a v-if="section.buttonUrl" :href="section.buttonUrl" class="cms-button">{{ section.buttonLabel }}</a>
        </div>
      </div>

      <!-- Rich text -->
      <div v-else-if="type(section) === 'rich-text'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <div class="cms-prose" v-html="html(section.body)"></div>
      </div>

      <!-- Image + text -->
      <div
        v-else-if="type(section) === 'image-text'"
        :class="['cms-container', 'cms-image-text', 'is-' + (section.imagePosition || 'left')]"
      >
        <img
          v-if="section.image"
          :src="cms.media(section.image, 'large')"
          :srcset="cms.srcset(section.image)"
          sizes="(max-width: 768px) 100vw, 50vw"
          :alt="section.image.alternativeText || ''"
          loading="lazy"
        />
        <div>
          <h2 v-if="section.heading">{{ section.heading }}</h2>
          <div class="cms-prose" v-html="html(section.body)"></div>
          <a v-if="section.buttonUrl" :href="section.buttonUrl" class="cms-button">{{ section.buttonLabel }}</a>
        </div>
      </div>

      <!-- Gallery -->
      <div v-else-if="type(section) === 'gallery'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-if="section.description">{{ section.description }}</p>
        <div class="cms-grid">
          <figure v-for="file in section.images || []" :key="file.id" class="cms-grid__item">
            <video v-if="isVideo(file)" :src="cms.media(file)" controls preload="metadata"></video>
            <img v-else :src="cms.media(file, 'medium')" :alt="file.alternativeText || ''" loading="lazy" />
            <figcaption v-if="file.caption">{{ file.caption }}</figcaption>
          </figure>
        </div>
      </div>

      <!-- Card grid -->
      <div v-else-if="type(section) === 'card-grid'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-if="section.intro">{{ section.intro }}</p>
        <div class="cms-grid">
          <article v-for="card in section.cards || []" :key="card.id" class="cms-card">
            <img v-if="card.image" :src="cms.media(card.image, 'small')" :alt="card.image.alternativeText || ''" loading="lazy" />
            <h3>{{ card.title }}</h3>
            <p v-if="card.text">{{ card.text }}</p>
            <a v-if="card.linkUrl" :href="card.linkUrl">{{ card.linkLabel || card.linkUrl }}</a>
          </article>
        </div>
      </div>

      <!-- Video -->
      <div v-else-if="type(section) === 'video'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <div class="cms-video">
          <iframe
            :src="embed(section.videoUrl)"
            :title="section.heading || 'video'"
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <p v-if="section.caption">{{ section.caption }}</p>
      </div>

      <!-- Call to action -->
      <div v-else-if="type(section) === 'cta'" class="cms-cta" :style="background(section.backgroundImage)">
        <div class="cms-container">
          <h2>{{ section.heading }}</h2>
          <p v-if="section.text">{{ section.text }}</p>
          <a v-if="section.buttonUrl" :href="section.buttonUrl" class="cms-button">{{ section.buttonLabel }}</a>
        </div>
      </div>

      <!-- FAQ -->
      <div v-else-if="type(section) === 'faq'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <details v-for="item in section.items || []" :key="item.id" class="cms-faq">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>

      <!-- Timetable -->
      <div v-else-if="type(section) === 'timetable'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-if="section.intro">{{ section.intro }}</p>
        <table class="cms-table">
          <tbody>
            <tr v-for="row in section.items || []" :key="row.id">
              <th>{{ row.time }}</th>
              <td>
                {{ row.activity }}<small v-if="row.note"> — {{ row.note }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Latest posts / upcoming courses / albums / teachers -->
      <div v-else-if="type(section) === 'collection-list'" class="cms-container">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-if="section.intro">{{ section.intro }}</p>
        <div class="cms-grid">
          <article v-for="item in lists[section.id] || []" :key="item.documentId" class="cms-card">
            <img
              v-if="item.cover || item.photo"
              :src="cms.media(item.cover || item.photo, 'small')"
              :alt="item.title || item.name"
              loading="lazy"
            />
            <h3>{{ item.title || item.name }}</h3>
            <p v-if="section.collection === 'courses'">
              {{ item.startDate }}<span v-if="item.endDate"> – {{ item.endDate }}</span>
            </p>
            <p v-else-if="item.excerpt || item.summary || item.role">{{ item.excerpt || item.summary || item.role }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { blocksToHtml } from './blocks-to-html';

/**
 * Renders page sections from the CMS. Works with Vue 2.7 and Vue 3.
 *
 *   <CmsSections :sections="page.sections" :cms="cms" />
 *
 * Use it as a starting point - or keep your own components and read the
 * data directly, e.g. page.sections.find(s => s.anchor === 'about').
 */
export default {
  name: 'CmsSections',
  props: {
    sections: { type: Array, default: () => [] },
    cms: { type: Object, required: true },
  },
  data() {
    return { lists: {} };
  },
  watch: {
    sections: { immediate: true, handler: 'loadLists' },
  },
  methods: {
    type(section) {
      return String(section.__component || '').replace('blocks.', '');
    },
    html(blocks) {
      return blocksToHtml(blocks, (file) => this.cms.media(file));
    },
    background(file) {
      return file ? { backgroundImage: `url("${this.cms.media(file, 'xlarge')}")` } : {};
    },
    isVideo(file) {
      return String(file.mime || '').startsWith('video/');
    },
    embed(url = '') {
      const youtube = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
      if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
      if (/facebook\.com/.test(url)) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
      }
      return url;
    },
    async loadLists() {
      const loaders = {
        posts: (limit) => this.cms.posts({ limit }),
        courses: (limit) => this.cms.courses({ upcoming: true, limit }),
        albums: (limit) => this.cms.albums({ limit }),
        teachers: (limit) => this.cms.teachers({ limit }),
      };
      for (const section of this.sections || []) {
        if (section.__component !== 'blocks.collection-list' || !loaders[section.collection]) continue;
        try {
          const { items } = await loaders[section.collection](section.limit || 3);
          this.lists = { ...this.lists, [section.id]: items };
        } catch (error) {
          console.error('[cms] could not load', section.collection, error);
        }
      }
    },
  },
};
</script>

<style>
.cms-container { max-width: 1100px; margin: 0 auto; padding: 48px 16px; }
.cms-hero, .cms-cta { background: #7c2d12 center / cover no-repeat; color: #fff; }
.cms-hero .cms-container { min-height: 60vh; display: flex; flex-direction: column; justify-content: center; }
.cms-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 12px; }
.cms-button { display: inline-block; margin-top: 16px; padding: 10px 22px; border-radius: 999px; background: #d97706; color: #fff; text-decoration: none; }
.cms-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.cms-grid img, .cms-grid video, .cms-image-text img { width: 100%; height: auto; border-radius: 8px; display: block; }
.cms-grid__item { margin: 0; }
.cms-card { background: #fff7ed; border-radius: 12px; overflow: hidden; padding-bottom: 12px; }
.cms-card h3, .cms-card p, .cms-card a { margin-left: 12px; margin-right: 12px; }
.cms-image-text { display: grid; gap: 32px; grid-template-columns: 1fr 1fr; align-items: center; }
.cms-image-text.is-right img { order: 2; }
.cms-video { position: relative; padding-top: 56.25%; }
.cms-video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.cms-table { width: 100%; border-collapse: collapse; }
.cms-table th, .cms-table td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
.cms-faq { border-bottom: 1px solid #eee; padding: 12px 0; }
.cms-faq summary { cursor: pointer; font-weight: 600; }
@media (max-width: 768px) { .cms-image-text { grid-template-columns: 1fr; } .cms-image-text.is-right img { order: 0; } }
</style>
