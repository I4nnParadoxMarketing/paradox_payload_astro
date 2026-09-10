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
      posts: docs.map((doc) => ({
        title: doc.title,
        excerpt: doc.excerpt,
        date: formatDate(doc.publishedDate),
        url: doc.url ?? `/insights/${doc.slug}`,
        imageUrl: doc.imageUrl,
      })),
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
      items: docs.map((doc) => ({
        title: doc.title,
        description: doc.description,
        url: doc.url ?? `/capabilities/${doc.slug}`,
        color: doc.color,
      })),
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
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export async function getCapabilityItem(slug: string) {
  try {
    const docs = await fetchCollection('capabilities', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      limit: '1',
      depth: '1',
    })
    return docs[0] ?? null
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

export { homepageFallback } from './homepage-fallback'
export { getFallbackPage, getAllFallbackSlugs } from './pages-fallback'
