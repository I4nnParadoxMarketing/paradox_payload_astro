export type PageBlock = {
  blockType: string
  id?: string
  [key: string]: unknown
}

export type Page = {
  id?: string
  title: string
  slug: string
  status?: string
  layout?: PageBlock[]
  meta?: { title?: string; description?: string }
}

type CollectionDoc = Record<string, unknown>

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'

function normalizeBlocks(page: Page): Page {
  if (!page.layout) return page
  page.layout = page.layout.map((block) => {
    if (block.blockType === 'whatWeDo' && block.description && !block.bodyHtml) {
      return { ...block, bodyHtml: richTextToHtml(block.description) }
    }
    if (block.blockType === 'workWithUs' && block.description && !block.bodyHtml) {
      return { ...block, bodyHtml: richTextToHtml(block.description) }
    }
    if (block.blockType === 'whoWeAre' && block.description && !block.bodyHtml) {
      return { ...block, bodyHtml: richTextToHtml(block.description) }
    }
    if (block.blockType === 'technology' && block.intro && !block.bodyHtml) {
      return { ...block, bodyHtml: richTextToHtml(block.intro) }
    }
    return block
  })
  return page
}

function richTextToHtml(richText: unknown): string {
  if (typeof richText === 'string') return richText
  if (!richText || typeof richText !== 'object') return ''
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  return root.children
    .map((node) => {
      const n = node as { type?: string; children?: { text?: string; format?: number }[] }
      if (n.type !== 'paragraph' || !n.children) return ''
      const inner = n.children
        .map((c) => {
          const text = c.text ?? ''
          return c.format === 1 ? `<strong>${text}</strong>` : text
        })
        .join('')
      return `<p>${inner}</p>`
    })
    .join('')
}

async function fetchCollection(
  slug: string,
  query: Record<string, string>,
): Promise<CollectionDoc[]> {
  const params = new URLSearchParams({ limit: '100', depth: '0', ...query })
  const res = await fetch(`${PAYLOAD_URL}/api/${slug}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}

function asDocs(value: unknown): CollectionDoc[] {
  if (!Array.isArray(value)) return []
  return value.filter((item) => item && typeof item === 'object') as CollectionDoc[]
}

function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

async function hydrateBlock(block: PageBlock): Promise<PageBlock> {
  if (!block.useCollection) return block

  if (block.blockType === 'portfolio') {
    const selected = asDocs(block.selectedProjects)
    const docs =
      selected.length > 0
        ? selected
        : await fetchCollection('portfolio', {
            'where[status][equals]': 'published',
            limit: String(block.collectionLimit ?? 6),
            sort: '-updatedAt',
          })

    return {
      ...block,
      projects: docs.map((doc) => ({
        title: doc.title,
        year: doc.year,
        services: doc.services ?? doc.categories,
        imageUrl: doc.imageUrl,
        url: doc.url ?? `/portfolio/${doc.slug}`,
      })),
    }
  }

  if (block.blockType === 'insights') {
    const selected = asDocs(block.selectedPosts)
    const docs =
      selected.length > 0
        ? selected
        : await fetchCollection('insights', {
            'where[status][equals]': 'published',
            limit: String(block.collectionLimit ?? 3),
            sort: '-publishedDate',
          })

    return {
      ...block,
      posts: docs.map((doc) => {
        const slug = String(doc.slug || '')
        const tag = typeof doc.capabilityTag === 'string' ? doc.capabilityTag.trim() : ''
        const localUrl = tag && slug ? `/capabilities/${tag}/insights/${slug}` : slug ? `/insights/${slug}` : '#'
        const excerptRaw = typeof doc.excerpt === 'string' ? doc.excerpt.replace(/\s+/g, ' ').trim() : ''
        const excerpt =
          excerptRaw.length > 180 ? `${excerptRaw.slice(0, 180).trim()}...` : excerptRaw || undefined
        return {
          title: doc.title,
          excerpt,
          date: formatDate(doc.publishedDate),
          url: localUrl,
          imageUrl: doc.imageUrl,
        }
      }),
    }
  }

  if (block.blockType === 'capabilitiesGrid') {
    const selected = asDocs(block.selectedCapabilities)
    const docs =
      selected.length > 0
        ? selected
        : await fetchCollection('capabilities', {
            'where[status][equals]': 'published',
            'where[parent][exists]': 'false',
            limit: '100',
            sort: 'title',
          })

    return {
      ...block,
      items: docs.map((doc) => {
        const path =
          typeof doc.path === 'string' && doc.path
            ? `/${String(doc.path).replace(/^\/+|\/+$/g, '')}`
            : doc.slug
              ? `/capabilities/${doc.slug}`
              : typeof doc.url === 'string'
                ? doc.url
                : '#'
        return {
          title: doc.title,
          description: doc.description,
          url: path,
          color: doc.color,
        }
      }),
    }
  }

  if (block.blockType === 'teamSection') {
    const selected = asDocs(block.selectedPeople)
    const docs =
      selected.length > 0
        ? selected
        : await fetchCollection('people', {
            'where[status][equals]': 'published',
            'where[isLeader][equals]': 'true',
            limit: '100',
            sort: 'sortOrder',
          })

    return {
      ...block,
      leaders: docs.map((doc) => ({
        name: doc.name,
        role: doc.role,
        imageUrl: doc.imageUrl,
      })),
    }
  }

  return block
}

async function hydratePageLayout(page: Page): Promise<Page> {
  if (!page.layout?.length) return page
  page.layout = await Promise.all(page.layout.map((block) => hydrateBlock(block)))
  return page
}

async function fetchPage(slug: string, draft = false): Promise<Page | null> {
  const draftParam = draft ? '&draft=true' : '&where[status][equals]=published'
  const res = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2${draftParam}`,
    { headers: { Accept: 'application/json' } },
  )
  if (!res.ok) return null
  const data = await res.json()
  const page = data.docs?.[0] ?? null
  if (!page) return null
  const normalized = normalizeBlocks(page)
  return hydratePageLayout(normalized)
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    return await fetchPage(slug, false)
  } catch {
    return null
  }
}

export async function getPagePreview(slug: string): Promise<Page | null> {
  try {
    const draft = await fetchPage(slug, true)
    if (draft) return draft
    return await fetchPage(slug, false)
  } catch {
    return null
  }
}

export async function getPortfolioItem(slug: string) {
  try {
    const docs = await fetchCollection('portfolio', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export async function getInsightItem(slug: string) {
  try {
    const docs = await fetchCollection('insights', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
      // depth>=1 so Lexical upload nodes populate and bodyHtml includes <img>
      depth: '2',
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export async function getRecentInsights(limit = 5, excludeSlug?: string) {
  try {
    const docs = await fetchCollection('insights', {
      'where[status][equals]': 'published',
      limit: String(limit + (excludeSlug ? 3 : 0)),
      sort: '-publishedDate',
      depth: '0',
    })
    return docs
      .filter((doc) => !excludeSlug || doc.slug !== excludeSlug)
      .slice(0, limit)
      .map((doc) => {
        const slug = String(doc.slug || '')
        const tag = typeof doc.capabilityTag === 'string' ? doc.capabilityTag.trim() : ''
        const url = tag && slug ? `/capabilities/${tag}/insights/${slug}` : slug ? `/insights/${slug}` : '#'
        return {
          title: String(doc.title || slug),
          url,
          date: formatDate(doc.publishedDate),
        }
      })
  } catch {
    return []
  }
}

export async function getCapabilityItem(slug: string) {
  try {
    const docs = await fetchCollection('capabilities', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
      depth: '2',
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

/** Resolve by full path e.g. capabilities/demand-generation/lead-generation */
export async function getCapabilityByPath(path: string) {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (!normalized) return null
  try {
    const docs = await fetchCollection('capabilities', {
      'where[path][equals]': normalized,
      'where[status][equals]': 'published',
      limit: '1',
      depth: '2',
    })
    if (docs[0]) return docs[0]

    // Fallback: leaf slug (unique)
    const leaf = normalized.split('/').filter(Boolean).pop()
    if (!leaf || leaf === 'capabilities') return null
    return getCapabilityItem(leaf)
  } catch {
    return null
  }
}

export async function getPersonItem(slug: string) {
  try {
    const docs = await fetchCollection('people', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export type MenuItem = {
  id?: string
  label: string
  url?: string | null
  children?: MenuItem[] | null
  /** Third-level links (Payload field name to avoid nested `children` collision). */
  links?: MenuItem[] | null
}

export type MainMenu = {
  items?: MenuItem[] | null
}

export async function getMainMenu(): Promise<MainMenu | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/main-menu?depth=0`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as MainMenu
    if (!data?.items?.length) return null
    return data
  } catch {
    return null
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function nestedItems(item: MenuItem): MenuItem[] {
  if (Array.isArray(item.links) && item.links.length) return item.links.filter(Boolean)
  if (Array.isArray(item.children) && item.children.length) return item.children.filter(Boolean)
  return []
}

function renderMenuItems(items: MenuItem[], listClass: string): string {
  const lis = items
    .map((item) => {
      const label = escapeHtml(item.label || '')
      const url = escapeHtml(item.url || '#')
      const children = nestedItems(item)
      const hasChildren = children.length > 0
      const liClass = hasChildren ? 'menu-item menu-item-has-children' : 'menu-item'
      const childHtml = hasChildren ? renderMenuItems(children, 'sub-menu') : ''
      return `<li class="${liClass}"><a href="${url}">${label}</a>${childHtml}</li>`
    })
    .join('')
  return `<ul class="${listClass}">${lis}</ul>`
}

/** Build mmenu-compatible nav HTML from Payload Main Menu items. */
export function menuItemsToHtml(items: MenuItem[]): string {
  const lis = items
    .map((item) => {
      const label = escapeHtml(item.label || '')
      const url = escapeHtml(item.url || '#')
      const children = nestedItems(item)
      const hasChildren = children.length > 0
      const liClass = hasChildren ? 'menu-item menu-item-has-children' : 'menu-item'
      const childHtml = hasChildren ? renderMenuItems(children, 'sub-menu') : ''
      return `<li class="${liClass}"><a href="${url}">${label}</a>${childHtml}</li>`
    })
    .join('')
  return `<nav id="menu" class="menu-main-menu-container"><ul id="menu-main-menu" class="menu">${lis}</ul></nav>`
}

export { homepageFallback } from './homepage-fallback'
export { getFallbackPage, getAllFallbackSlugs } from './pages-fallback'
