<template>
  <form class="cms-contact" novalidate @submit.prevent="submit">
    <!-- honeypot: hidden from people, bots fill it in -->
    <input
      v-model="form.website"
      class="cms-contact__hp"
      type="text"
      name="website"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />

    <label>{{ t.name }} *<input v-model.trim="form.name" maxlength="120" required /></label>
    <label>{{ t.email }}<input v-model.trim="form.email" type="email" maxlength="200" /></label>
    <label>{{ t.phone }}<input v-model.trim="form.phone" type="tel" maxlength="40" /></label>
    <label>{{ t.subject }}<input v-model.trim="form.subject" maxlength="200" /></label>
    <label>{{ t.message }} *<textarea v-model.trim="form.message" rows="5" maxlength="5000" required></textarea></label>

    <p v-if="error" class="cms-contact__error" role="alert">{{ error }}</p>
    <p v-if="sent" class="cms-contact__ok" role="status">{{ t.sent }}</p>

    <button type="submit" :disabled="sending">{{ sending ? t.sending : t.send }}</button>
  </form>
</template>

<script>
const TEXT = {
  km: {
    name: 'ឈ្មោះ',
    email: 'អ៊ីមែល',
    phone: 'លេខទូរស័ព្ទ',
    subject: 'ប្រធានបទ',
    message: 'សារ',
    send: 'ផ្ញើសារ',
    sending: 'កំពុងផ្ញើ...',
    sent: 'អរគុណ! យើងបានទទួលសាររបស់អ្នកហើយ។',
    needContact: 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ។',
    tooMany: 'អ្នកផ្ញើច្រើនដងពេក សូមរង់ចាំបន្តិចសិន។',
    failed: 'ផ្ញើមិនបានទេ សូមព្យាយាមម្តងទៀត។',
  },
  en: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending...',
    sent: 'Thank you! We received your message.',
    needContact: 'Please add your email or phone number.',
    tooMany: 'Too many messages - please wait a little.',
    failed: 'Could not send. Please try again.',
  },
};

const empty = () => ({ name: '', email: '', phone: '', subject: '', message: '', website: '' });

/** <ContactForm :cms="cms" locale="km" /> - messages appear in the dashboard. Vue 2.7 and Vue 3. */
export default {
  name: 'ContactForm',
  props: {
    cms: { type: Object, required: true },
    locale: { type: String, default: 'km' },
  },
  data() {
    return { form: empty(), sending: false, sent: false, error: '' };
  },
  computed: {
    t() {
      return TEXT[this.locale] || TEXT.en;
    },
  },
  methods: {
    async submit() {
      this.error = '';
      this.sent = false;
      if (!this.form.email && !this.form.phone) {
        this.error = this.t.needContact;
        return;
      }
      this.sending = true;
      try {
        await this.cms.sendContact(this.form);
        this.sent = true;
        this.form = empty();
      } catch (error) {
        const fieldErrors = error.details && error.details.errors;
        this.error =
          error.status === 429 ? this.t.tooMany : fieldErrors ? Object.values(fieldErrors).join(' · ') : this.t.failed;
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style>
.cms-contact { display: grid; gap: 12px; max-width: 560px; }
.cms-contact label { display: grid; gap: 4px; font-weight: 600; }
.cms-contact input, .cms-contact textarea { font: inherit; padding: 10px; border: 1px solid #d6d3d1; border-radius: 8px; }
.cms-contact button { padding: 12px; border: 0; border-radius: 8px; background: #b45309; color: #fff; font: inherit; cursor: pointer; }
.cms-contact button:disabled { opacity: 0.6; }
.cms-contact__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.cms-contact__error { color: #b91c1c; }
.cms-contact__ok { color: #15803d; }
</style>
