import { buildPopulate } from './populate';

const LOCALE_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

/**
 * Shared handler for `GET /api/<collection>/slug/:slug?locale=km`.
 * Returns the published entry with images and sections populated.
 */
export async function findPublishedBySlug(controller: any, ctx: any, uid: string) {
  const slug = String(ctx.params.slug ?? '').trim().toLowerCase();
  const locale = typeof ctx.query?.locale === 'string' ? ctx.query.locale : undefined;

  if (locale && !LOCALE_PATTERN.test(locale)) {
    return ctx.badRequest('Invalid locale');
  }

  const document = await strapi.documents(uid as any).findFirst({
    filters: { slug },
    ...(locale ? { locale } : {}),
    status: 'published',
    populate: buildPopulate(uid),
  } as any);

  if (!document) {
    return ctx.notFound(`Nothing published with slug "${slug}"`);
  }

  const sanitized = await controller.sanitizeOutput(document, ctx);
  return controller.transformResponse(sanitized);
}
