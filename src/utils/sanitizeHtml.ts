import DOMPurify from 'isomorphic-dompurify';

/** Sanitize HTML before injecting with dangerouslySetInnerHTML (defense in depth). */
export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button']
  });
}
