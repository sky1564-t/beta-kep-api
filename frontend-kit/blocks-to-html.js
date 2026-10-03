/**
 * Turns Strapi "Rich text (Blocks)" JSON into safe HTML.
 *
 *   <div class="prose" v-html="blocksToHtml(section.body)"></div>
 *
 * Text is escaped, and only http(s)/mailto/tel/relative links are kept.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
const safeUrl = (url) => (/^(https?:|mailto:|tel:|\/|#)/i.test(url || '') ? url : '#');

function inline(nodes = []) {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        let html = escape(node.text).replace(/\n/g, '<br>');
        if (node.code) html = `<code>${html}</code>`;
        if (node.bold) html = `<strong>${html}</strong>`;
        if (node.italic) html = `<em>${html}</em>`;
        if (node.underline) html = `<u>${html}</u>`;
        if (node.strikethrough) html = `<s>${html}</s>`;
        return html;
      }
      if (node.type === 'link') {
        const external = /^https?:/i.test(node.url || '');
        return `<a href="${escape(safeUrl(node.url))}"${external ? ' target="_blank" rel="noopener"' : ''}>${inline(
          node.children
        )}</a>`;
      }
      if (node.type === 'list') return renderBlock(node);
      return inline(node.children);
    })
    .join('');
}

function renderBlock(block, mediaUrl) {
  switch (block.type) {
    case 'paragraph':
      return `<p>${inline(block.children)}</p>`;
    case 'heading': {
      const level = Math.min(Math.max(Number(block.level) || 2, 1), 6);
      return `<h${level}>${inline(block.children)}</h${level}>`;
    }
    case 'list': {
      const tag = block.format === 'ordered' ? 'ol' : 'ul';
      const items = (block.children || [])
        .map((item) => (item.type === 'list' ? renderBlock(item) : `<li>${inline(item.children)}</li>`))
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'quote':
      return `<blockquote>${inline(block.children)}</blockquote>`;
    case 'code':
      return `<pre><code>${escape((block.children || []).map((child) => child.text).join(''))}</code></pre>`;
    case 'image': {
      const image = block.image || {};
      const src = mediaUrl ? mediaUrl(image) : image.url;
      return `<figure><img src="${escape(src)}" alt="${escape(image.alternativeText || '')}" loading="lazy"></figure>`;
    }
    default:
      return block.children ? `<p>${inline(block.children)}</p>` : '';
  }
}

/** mediaUrl: optional function to turn image objects into full URLs, e.g. (f) => cms.media(f) */
export function blocksToHtml(blocks, mediaUrl) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map((block) => renderBlock(block, mediaUrl)).join('\n');
}
