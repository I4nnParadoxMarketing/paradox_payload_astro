const PAYLOAD_URL = (
  import.meta.env.PUBLIC_PAYLOAD_URL ||
  import.meta.env.PAYLOAD_URL ||
  'http://localhost:3000'
).replace(/\/$/, '')

/** Turn relative Payload media URLs into absolute ones for the Astro site. */
export function absolutizeMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  if (url.startsWith('/')) return `${PAYLOAD_URL}${url}`
  return url
}

/**
 * Rewrite relative `/api/media/...` and `/media/...` src/href values inside HTML
 * so images loaded from Payload resolve when the site is on a different origin.
 */
export function absolutizePayloadMediaHtml(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') return ''
  return html.replace(
    /(src|href)=(["'])(\/?(?:api\/)?media\/[^"']+)\2/gi,
    (_match, attr: string, quote: string, path: string) => {
      const normalized = path.startsWith('/') ? path : `/${path}`
      return `${attr}=${quote}${absolutizeMediaUrl(normalized)}${quote}`
    },
  )
}
