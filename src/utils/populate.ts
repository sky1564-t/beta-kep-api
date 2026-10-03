/**
 * Builds a Strapi `populate` object from a content-type / component schema,
 * so the public API returns images, components and page sections in one call
 * (no need to write long `populate[...]` query strings in the frontend).
 */
type PopulateMap = Record<string, unknown>;

const SKIPPED_RELATIONS = new Set(['createdBy', 'updatedBy', 'localizations']);
const SKIPPED_TARGETS = new Set(['admin::user', 'plugin::users-permissions.user']);

export function buildPopulate(uid: string, depth = 5): PopulateMap {
  const model = strapi.getModel(uid as any) as any;
  if (!model) return {};

  const populate: PopulateMap = {};

  for (const [name, attribute] of Object.entries<any>(model.attributes)) {
    switch (attribute.type) {
      case 'media':
        populate[name] = true;
        break;

      case 'component': {
        const nested = depth > 1 ? buildPopulate(attribute.component, depth - 1) : {};
        populate[name] = Object.keys(nested).length ? { populate: nested } : true;
        break;
      }

      case 'dynamiczone': {
        const on: PopulateMap = {};
        for (const componentUid of attribute.components as string[]) {
          const nested = depth > 1 ? buildPopulate(componentUid, depth - 1) : {};
          on[componentUid] = Object.keys(nested).length ? { populate: nested } : true;
        }
        populate[name] = { on };
        break;
      }

      case 'relation':
        if (!SKIPPED_RELATIONS.has(name) && !SKIPPED_TARGETS.has(attribute.target)) {
          populate[name] = true;
        }
        break;

      default:
        break;
    }
  }

  return populate;
}

type ListDefaults = {
  /** Default sort when the frontend does not send `sort`. */
  sort?: string[];
  /** Turn custom query flags (e.g. `?upcoming=true`) into Strapi filters. */
  flags?: Record<string, () => Record<string, unknown>>;
};

/**
 * Route middleware: adds deep populate (and optional default sort / flags)
 * when the request does not specify them.
 */
export const withDefaults =
  (uid: string, defaults: ListDefaults = {}) =>
  async (ctx: any, next: () => Promise<unknown>) => {
    const query = { ...(ctx.query ?? {}) };

    for (const [flag, toFilters] of Object.entries(defaults.flags ?? {})) {
      if (flag in query) {
        const enabled = ['true', '1', ''].includes(String(query[flag]));
        delete query[flag];
        if (enabled) {
          const current = query.filters && typeof query.filters === 'object' ? query.filters : {};
          query.filters = { $and: [current, toFilters()] };
        }
      }
    }

    if (!query.populate) query.populate = buildPopulate(uid);
    if (!query.sort && defaults.sort) query.sort = defaults.sort;

    ctx.query = query;
    await next();
  };
