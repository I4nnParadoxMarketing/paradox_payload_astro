import {
  capabilityToPage,
  inferCollectionFromPath,
  industryToPage,
  insightToPage,
  portfolioArchivePage,
  portfolioItemToPage,
  wpEndpointForCollection,
  type ImportCollection,
} from './collection-pages'
import type { Page } from './payload'
import { localPathFromUrl, normalizePath } from './url-utils'

type WPPost = {
  id: number
  slug: string
  link: string
  title?: { rendered?: string }
  content?: { rendered?: string }
  excerpt?: { rendered?: string }
  date?: string
  parent?: number
  acf?: Record<string, unknown>
  yoast_head_json?: { title?: string; description?: string; og_image?: Array<{ url?: string }> }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>
    'wp:term'?: Array<Array<{ slug?: string; taxonomy?: string; name?: string }>>
  }
}

const WP_BASE = import.meta.env.WP_API_URL || 'https://paradoxmarketing.io/wp-json/wp/v2'

function decodeHtml(text: string): string {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function featuredImageUrl(post: WPPost): string | undefined {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url
}

function yoastImageUrl(post: WPPost): string | undefined {
  return post.yoast_head_json?.og_image?.[0]?.url
}

function portfolioCategories(post: WPPost): string | undefined {
  const terms = post._embedded?.['wp:term']?.flat() ?? []
  const names = terms
    .filter((term) => term.taxonomy === 'portfolio_category')
    .map((term) => term.name)
    .filter(Boolean)
  return names.length ? names.join(', ') : undefined
}

async function fetchAllWPPosts(endpoint: string, embed = true): Promise<WPPost[]> {
  const posts: WPPost[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const embedParam = embed ? '&_embed=1' : ''
    const res = await fetch(`${WP_BASE}/${endpoint}?per_page=100&page=${page}&status=publish${embedParam}`)
    if (!res.ok) break

    const batch = (await res.json()) as WPPost[]
    posts.push(...batch)
    totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
    page += 1
  }

  return posts
}

function wpPostToDoc(collection: ImportCollection, post: WPPost): Record<string, unknown> {
  const acf = post.acf ?? {}
  const localPath = localPathFromUrl(post.link) ?? post.slug
  const base = {
    title: decodeHtml(post.title?.rendered ?? post.slug),
    slug: post.slug,
    localPath,
    url: post.link,
    meta: {
      title: post.yoast_head_json?.title,
      description: post.yoast_head_json?.description,
    },
  }

  switch (collection) {
    case 'portfolio':
      return {
        ...base,
        client: acf.po_client,
        year: acf.po_date ?? acf.year_started,
        services: acf.po_service_provided ?? acf.portfolio_services ?? portfolioCategories(post),
        categories: acf.po_category ?? portfolioCategories(post),
        imageUrl: featuredImageUrl(post),
        heroHeading: acf.hero_heading,
        heroDescription: acf.hero_description,
        summaryHtml: acf.r_description,
      }
    case 'insights':
      return {
        ...base,
        excerpt: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : undefined,
        bodyHtml: post.content?.rendered,
        publishedDate: post.date?.slice(0, 10),
        imageUrl: yoastImageUrl(post),
      }
    case 'capabilities':
      return {
        ...base,
        description: stripHtml(post.excerpt?.rendered ?? post.content?.rendered ?? '').slice(0, 280),
        bodyHtml: post.content?.rendered,
        color: acf.accent_color ?? acf.capability_accent_color,
        imageUrl: featuredImageUrl(post) ?? acf.banner_image,
        parent: post.parent,
      }
    case 'industries':
      return {
        ...base,
        description: stripHtml(post.excerpt?.rendered ?? post.content?.rendered ?? '').slice(0, 280),
        bodyHtml: post.content?.rendered,
        imageUrl: featuredImageUrl(post) ?? yoastImageUrl(post),
      }
  }
}

function findPostByLocalPath(posts: WPPost[], path: string): WPPost | undefined {
  const normalized = normalizePath(path)
  return posts.find((post) => localPathFromUrl(post.link) === normalized)
}

async function capabilityChildrenFromWP(parentPost: WPPost, allPosts: WPPost[]): Promise<Record<string, unknown>[]> {
  return allPosts
    .filter((post) => post.parent === parentPost.id)
    .map((post) => wpPostToDoc('capabilities', post))
}

export async function resolvePageFromWordPress(path: string): Promise<Page | null> {
  const normalized = normalizePath(path)
  const collectionHint = inferCollectionFromPath(normalized)
  if (!collectionHint) return null

  try {
    if (collectionHint === 'portfolio-archive') {
      const posts = await fetchAllWPPosts('portfolio')
      const docs = posts.map((post) => wpPostToDoc('portfolio', post))
      return portfolioArchivePage(docs)
    }

    const endpoint = wpEndpointForCollection(collectionHint)
    const posts = await fetchAllWPPosts(endpoint, collectionHint !== 'insights')
    const match = findPostByLocalPath(posts, normalized)
    if (!match) return null

    const doc = wpPostToDoc(collectionHint, match)

    switch (collectionHint) {
      case 'capabilities': {
        const children = await capabilityChildrenFromWP(match, posts)
        return capabilityToPage(doc, children)
      }
      case 'insights':
        return insightToPage(doc)
      case 'portfolio':
        return portfolioItemToPage(doc)
      case 'industries':
        return industryToPage(doc)
    }
  } catch {
    return null
  }
}
