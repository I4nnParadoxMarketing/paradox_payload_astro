const WP_BASE = process.env.WP_API_URL || 'https://paradoxmarketing.io/wp-json/wp/v2'

export type WPPost = {
  id: number
  slug: string
  link: string
  status: string
  date: string
  parent?: number
  title?: { rendered?: string }
  content?: { rendered?: string }
  excerpt?: { rendered?: string }
  acf?: Record<string, unknown>
  yoast_head_json?: { title?: string; description?: string; og_image?: Array<{ url?: string }> }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>
    'wp:term'?: Array<Array<{ slug?: string; taxonomy?: string; name?: string }>>
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function decodeHtml(text: string): string {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export function featuredImageUrl(post: WPPost): string | undefined {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url
}

export function serviceTagSlug(post: WPPost): string | undefined {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  const tag = terms.find((term) => term.taxonomy === 'services_tag')
  return tag?.slug
}

export function portfolioCategories(post: WPPost): string | undefined {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  const names = terms
    .filter((term) => term.taxonomy === 'portfolio_category')
    .map((term) => term.name)
    .filter(Boolean)
  return names.length ? names.join(', ') : undefined
}

export async function fetchAllWPPosts(endpoint: string, options?: { embed?: boolean }): Promise<WPPost[]> {
  const posts: WPPost[] = []
  let page = 1
  let totalPages = 1
  const embed = options?.embed !== false

  while (page <= totalPages) {
    const embedParam = embed ? '&_embed=1' : ''
    const url = `${WP_BASE}/${endpoint}?per_page=100&page=${page}&status=publish${embedParam}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`WordPress fetch failed (${endpoint} page ${page}): ${res.status}`)
    }

    const batch = (await res.json()) as WPPost[]
    posts.push(...batch)

    totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
    page += 1
  }

  return posts
}

export function sanitizeHtml(html: string | undefined): string | undefined {
  if (!html) return undefined
  const cleaned = html.replace(/\0/g, '').trim()
  return cleaned || undefined
}

export function capabilityTagFromLink(link: string): string | undefined {
  const match = link.match(/\/capabilities\/([^/]+)\/insights\//)
  return match?.[1]
}

/** Store as capabilities/parent/child (no leading/trailing slash). */
export function capabilityPathFromLink(link: string | undefined): string | undefined {
  if (!link) return undefined
  try {
    const pathname = new URL(link).pathname.replace(/^\/+|\/+$/g, '')
    if (!pathname.startsWith('capabilities/')) return undefined
    return pathname
  } catch {
    return undefined
  }
}

export function yoastImageUrl(post: WPPost): string | undefined {
  const images = post.yoast_head_json?.og_image
  if (!Array.isArray(images) || !images[0]) return undefined
  const image = images[0] as { url?: string }
  return image.url
}
