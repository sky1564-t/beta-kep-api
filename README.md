# Vipassana Dhura CMS — Backend + Dashboard

Backend សម្រាប់ [kepvipassana.org](https://www.kepvipassana.org/) ៖ កែ content, បញ្ចូលរូបភាព, និង dashboard គ្រប់គ្រង។
Frontend (Vue) ទាញទិន្នន័យតាម REST API។

**Stack:** Strapi 5 (Node.js, TypeScript) · PostgreSQL · រូបភាពរក្សាក្នុង server ឬ Cloudflare R2 / AWS S3

---

## 1. មានអ្វីខ្លះក្នុង Dashboard

| ផ្នែក | ប្រើសម្រាប់ |
|---|---|
| **Site settings** (ការកំណត់) | ឈ្មោះ, logo, ម៉ឺនុយខាងលើ/ក្រោម, ទំនាក់ទំនង, map, បណ្ដាញសង្គម, ការបរិច្ចាគ (KHQR), footer, SEO |
| **Page** (ទំព័រ) | ទំព័រនីមួយៗ (home, about...) បង្កើតពី section អាចបន្ថែម/អូសប្ដូរលំដាប់បាន |
| **Post** (ព័ត៌មាន) | news · event · dhamma · announcement |
| **Course** (វគ្គសមាធិ) | ថ្ងៃចាប់ផ្ដើម/បញ្ចប់, ស្ថានភាព (open/waitlist/full/closed), តំណចុះឈ្មោះ |
| **Photo album** | អាល់ប៊ុមរូបភាព/វីដេអូ |
| **Teacher** | ព្រះគ្រូ / គ្រូបង្រៀន |
| **Contact message** | សារពី form ទំនាក់ទំនងលើគេហទំព័រ (new → read → replied) |
| **Media Library** | Upload រូប (អូសទម្លាក់), crop, បង្វិលស្វ័យប្រវត្តិ, បង្កើតទំហំ thumbnail/small/medium/large/xlarge ស្វ័យប្រវត្តិ |
| **Home (dashboard)** | វគ្គខាងមុខ, សារថ្មី, អ្វីដែលទើបកែ/publish, ស្ថិតិ |

**Section សម្រាប់ Page (10 ប្រភេទ):** Hero · Rich text · Image + text · Gallery · Card grid · Video · Call to action · FAQ · Timetable (កាលវិភាគ) · Collection list (បង្ហាញព័ត៌មាន/វគ្គ/អាល់ប៊ុម/គ្រូ ថ្មីៗ)

**ផ្សេងៗ:** ខ្មែរ (default) + English · Draft → Publish · តួនាទី Super Admin / Editor / Author · label ក្នុង form ជាខ្មែរ · អង់គ្លេស

---

## 2. ដំណើរការលើកុំព្យូទ័រ

ត្រូវការ: **Node.js 20–24** (22 ល្អបំផុត) និង **PostgreSQL**

```bash
createdb kep_cms                 # បង្កើត database
cp .env.example .env             # កែ DATABASE_* និង secrets
npm install
npm run develop                  # បើក http://localhost:1337/admin
```

- លើកដំបូង៖ បង្កើតគណនី admin ក្នុង browser។
- ចង់មានទិន្នន័យគំរូ (ទំព័រ, វគ្គ, រូបភាព...)? ដាក់ `SEED_DEMO=true` ក្នុង `.env` មុនបើកលើកដំបូង។
- បង្កើត secrets ថ្មី: `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"`

---

## 3. របៀបប្រើ Dashboard (ខ្លីៗ)

1. **Content Manager** → ជ្រើសប្រភេទ → **Create new entry**
2. ជ្រើសភាសានៅខាងស្ដាំលើ (ខ្មែរ / English)។ ចុច ⋯ → *Fill in from another locale* ដើម្បីចម្លងពីភាសាមួយទៀត
3. រូបភាព៖ ចុចលើប្រអប់រូប → upload ឬជ្រើសពី Media Library
4. **Save** = រក្សាទុក (draft), **Publish** = បង្ហាញលើគេហទំព័រ
5. សារពីគេហទំព័រ៖ **Contact message** → ប្ដូរ Status ទៅ read / replied
6. បន្ថែមបុគ្គលិក៖ **Settings → Administration Panel → Users → Invite new user** (តួនាទី Editor = កែ content ទាំងអស់, Author = កែតែរបស់ខ្លួន)

---

## 4. API សម្រាប់ Frontend

គ្រប់ `GET` ជា public ហើយបង្ហាញតែ content ដែល **Published**។ បន្ថែម `?locale=km` ឬ `?locale=en` (default: km)។
រូបភាព, component និង section ត្រូវបាន populate រួចជាស្រេច។

| Endpoint | ទិន្នន័យ |
|---|---|
| `GET /api/global` | Site settings |
| `GET /api/pages/slug/:slug` | ទំព័រមួយ + sections (ឧ. `/api/pages/slug/home`) |
| `GET /api/posts` | ព័ត៌មាន (ថ្មីមុន) · ច្រោះ៖ `filters[category][$eq]=event` |
| `GET /api/posts/slug/:slug` | ព័ត៌មានមួយ |
| `GET /api/courses?upcoming=true` | វគ្គដែលមិនទាន់ចប់ (តាមថ្ងៃចាប់ផ្ដើម) |
| `GET /api/courses/slug/:slug` | វគ្គមួយ |
| `GET /api/albums` · `/api/albums/slug/:slug` | អាល់ប៊ុម |
| `GET /api/teachers` | គ្រូ (តាមលំដាប់) |
| `POST /api/contact` | ផ្ញើ form: `{ name, email?, phone?, subject?, message }` |

- ទំព័រ៖ `pagination[page]=1&pagination[pageSize]=12` ឬ `pagination[limit]=3`
- រូបភាព៖ `url` ជា `/uploads/...` → ដាក់ CMS URL ពីមុខ (R2/S3 ផ្ដល់ URL ពេញ)។ `formats.small/medium/large` សម្រាប់ទំហំតូចៗ។
- Section នីមួយៗមាន `__component` (ឧ. `blocks.hero`) និង `anchor` (ឧ. `about`) ដើម្បីរកបានងាយ។
- Contact form មាន honeypot (`website`) និងកំណត់ 5 សារ / 15 នាទី / IP។

---

## 5. ភ្ជាប់ជាមួយ Frontend Vue

ចម្លង folder `frontend-kit/` ទៅក្នុង `src/` របស់ Vue (Vue 2.7 និង Vue 3 ប្រើបាន)៖

| File | ប្រើសម្រាប់ |
|---|---|
| `cms.js` | client ហៅ API (`cms.global()`, `cms.page('home')`, `cms.courses({ upcoming: true })`, `cms.media(img, 'large')`...) |
| `blocks-to-html.js` | បម្លែង rich text ទៅ HTML (សុវត្ថិភាព) |
| `CmsSections.vue` | បង្ហាញ sections ទាំងអស់ដោយស្វ័យប្រវត្តិ |
| `ContactForm.vue` | form ទំនាក់ទំនង (ខ្មែរ/English) |

```js
// src/cms.js
import { createCms } from './frontend-kit/cms';

export const cms = createCms({
  baseUrl: process.env.VUE_APP_CMS_URL, // Vite: import.meta.env.VITE_CMS_URL
  locale: 'km',
});
```

ប្ដូរអក្សរដែលសរសេរជាប់ក្នុង component ទៅជាទិន្នន័យពី CMS៖

```vue
<template>
  <section v-if="hero" class="hero" :style="{ backgroundImage: `url(${media(hero.backgroundImage, 'large')})` }">
    <h1>{{ hero.title }}</h1>
    <p>{{ hero.subtitle }}</p>
  </section>
</template>

<script>
import { cms } from '@/cms';

export default {
  data: () => ({ page: null }),
  computed: {
    hero() {
      return this.page && this.page.sections.find((s) => s.anchor === 'hero');
    },
  },
  async created() {
    this.page = await cms.page('home');
  },
  methods: { media: cms.media },
};
</script>
```

ឬប្រើ component ស្រេច៖ `<CmsSections :sections="page.sections" :cms="cms" />` និង `<ContactForm :cms="cms" locale="km" />`

---

## 6. ដាក់លើ Server (Production)

VPS Ubuntu / AWS Lightsail / EC2 + PostgreSQL (ឬ RDS)៖

```bash
npm ci
NODE_ENV=production npm run build
NODE_ENV=production npm run start      # ឬ pm2 start npm --name kep-cms -- run start
```

Nginx (HTTPS ដោយ Let's Encrypt) ហើយដាក់ `IS_PROXIED=true`, `PUBLIC_URL=https://cms.kepvipassana.org` ក្នុង `.env`៖

```nginx
server {
  server_name cms.kepvipassana.org;
  client_max_body_size 25M;
  location / {
    proxy_pass http://127.0.0.1:1337;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

- **រូបភាពនៅ Cloudflare R2:** `UPLOAD_PROVIDER=s3` ហើយបំពេញ `S3_*` (មានឧទាហរណ៍ក្នុង `.env.example`)
- **CORS:** ដាក់ domain frontend ក្នុង `CORS_ORIGINS`
- **Backup:** `pg_dump` រាល់ថ្ងៃ + folder `public/uploads` (បើមិនប្រើ R2)
- នៅ production, Content-Type Builder ត្រូវបានបិទ — ប្ដូរ schema ដោយ `npm run develop` នៅលើកុំព្យូទ័រ រួច deploy

---

## 7. រចនាសម្ព័ន្ធ Code

```
config/                 server, database, upload (R2/S3), CORS
src/api/*               content types + routes (slug, ?upcoming, /contact)
src/components/blocks   10 section types
src/components/shared   menu, contact, donation, SEO, card...
src/bootstrap/          setup លើកដំបូង (ភាសា, permission, label ខ្មែរ) + ទិន្នន័យគំរូ
src/admin/              dashboard widgets (វគ្គខាងមុខ, សារថ្មី)
src/utils/              deep populate, find by slug, rate limit
frontend-kit/           ឯកសារសម្រាប់ចម្លងទៅ Vue frontend
```
