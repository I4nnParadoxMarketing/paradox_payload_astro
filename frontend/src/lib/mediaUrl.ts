const PAYLOAD_URL = (
  import.meta.env.PAYLOAD_URL ||
  import.meta.env.PUBLIC_PAYLOAD_URL ||
  'http://localhost:3000'
).replace(/\/$/, '')

/** Rewrite root-relative Payload media URLs in HTML so images load from the CMS. */
export function absolutizePayloadMediaHtml(html: string): string {
  if (!html) return ''
  return html.replace(
    /(\s(?:src|href)=["'])(\/(?:api\/media|media)\/[^"']*)/gi,
    (_match, prefix: string, path: string) => `${prefix}${PAYLOAD_URL}${path}`,
  )
}
