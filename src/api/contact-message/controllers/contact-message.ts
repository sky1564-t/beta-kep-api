import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { isRateLimited } from '../../../utils/rate-limit';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\-\s.]{6,40}$/;

const text = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export default factories.createCoreController('api::contact-message.contact-message', ({ strapi }) => ({
  /**
   * POST /api/contact
   * Body: { name, email?, phone?, subject?, message, website? }
   * `website` is a hidden honeypot field - bots fill it, people don't.
   */
  async submit(ctx) {
    const body = (ctx.request.body?.data ?? ctx.request.body ?? {}) as Record<string, unknown>;

    if (text(body.website, 200)) {
      ctx.status = 201;
      ctx.body = { ok: true };
      return;
    }

    if (isRateLimited(`contact:${ctx.request.ip}`, 5, 15 * 60 * 1000)) {
      throw new errors.RateLimitError('Too many messages. Please try again later.');
    }

    const data = {
      name: text(body.name, 120),
      email: text(body.email, 200).toLowerCase(),
      phone: text(body.phone, 40),
      subject: text(body.subject, 200),
      message: text(body.message, 5000),
    };

    const problems: Record<string, string> = {};
    if (!data.name) problems.name = 'Name is required';
    if (!data.email && !data.phone) problems.email = 'Email or phone is required';
    if (data.email && !EMAIL.test(data.email)) problems.email = 'Email is not valid';
    if (data.phone && !PHONE.test(data.phone)) problems.phone = 'Phone is not valid';
    if (data.message.length < 5) problems.message = 'Message is too short';

    if (Object.keys(problems).length) {
      throw new errors.ValidationError('Please check the form', { errors: problems });
    }

    await strapi.documents('api::contact-message.contact-message').create({
      data: {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        subject: data.subject || undefined,
        message: data.message,
        state: 'new',
      },
    });

    ctx.status = 201;
    ctx.body = { ok: true };
  },
}));
