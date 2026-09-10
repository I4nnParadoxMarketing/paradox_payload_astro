import type { Page, PageBlock } from './payload'
import { localUrlFromPath, normalizePath } from './url-utils'

type CollectionDoc = Record<string, unknown>

const DEFAULT_CTA: PageBlock = {
  blockType: 'ctaBanner',
  title: 'Have Our Team Become YOUR Team',
  description:
    'Partners with a team dedicated to your success. Our experts bring deep industry knowledge, innovative strategies, and a commitment to delivering results that matter.',
  ctaLabel: "Let's Talk",
  ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
}

function metaFromDoc(doc: CollectionDoc): Page['meta'] {
  const meta = doc.meta
  if (meta && typeof meta === 'object') {
    return meta as Page['meta']
  }
  return {
    title: typeof doc.title === 'string' ? doc.title : undefined,
    description: typeof doc.description === 'string' ? doc.description : undefined,
  }
}

function slugFromDoc(doc: CollectionDoc): string {
  if (typeof doc.localPath === 'string' && doc.localPath) return doc.localPath
  if (typeof doc.slug === 'string') return doc.slug
  return ''
}

function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function capabilityToPage(doc: CollectionDoc, children: CollectionDoc[] = []): Page {
  const title = String(doc.title ?? '')
  const blocks: PageBlock[] = [
    {
      blockType: 'pageBanner',
      title,
      subtitle: doc.description ? String(doc.description) : '',
    },
  ]

  if (doc.bodyHtml) {
    blocks.push({ blockType: 'richContent', bodyHtml: String(doc.bodyHtml) })
  }

  if (children.length > 0) {
    blocks.push({
      blockType: 'capabilitiesGrid',
      title: 'Related',
      titleHighlight: 'Services',
      items: children.map((child) => ({
        title: child.title,
        description: child.description,
        url: localUrlFromPath(String(child.localPath ?? `capabilities/${child.slug}`)),
        color: child.color,
      })),
    })
  }

  blocks.push(DEFAULT_CTA)

  return {
    title,
    slug: slugFromDoc(doc),
    status: 'published',
    meta: metaFromDoc(doc),
    layout: blocks,
  }
}

export function insightToPage(doc: CollectionDoc): Page {
  const title = String(doc.title ?? '')
  const subtitle = doc.excerpt
    ? String(doc.excerpt)
    : doc.publishedDate
      ? formatDate(doc.publishedDate)
      : ''

  const blocks: PageBlock[] = [
    {
      blockType: 'pageBanner',
      title,
      subtitle,
      variant: 'light',
    },
  ]

  if (doc.bodyHtml) {
    blocks.push({ blockType: 'richContent', bodyHtml: String(doc.bodyHtml) })
  }

  blocks.push(DEFAULT_CTA)

  return {
    title,
    slug: slugFromDoc(doc),
    status: 'published',
    meta: metaFromDoc(doc),
    layout: blocks,
  }
}

export function portfolioItemToPage(doc: CollectionDoc): Page {
  const title = String(doc.title ?? '')
  const bannerTitle = doc.heroHeading ? String(doc.heroHeading) : title
  const blocks: PageBlock[] = [
    {
      blockType: 'pageBanner',
      title: bannerTitle,
      subtitle: doc.heroDescription ? String(doc.heroDescription) : doc.client ? String(doc.client) : '',
    },
  ]

  const bodyHtml = doc.summaryHtml ?? doc.bodyHtml
  if (bodyHtml) {
    blocks.push({ blockType: 'richContent', bodyHtml: String(bodyHtml) })
  }

  blocks.push(DEFAULT_CTA)

  return {
    title,
    slug: slugFromDoc(doc),
    status: 'published',
    meta: metaFromDoc(doc),
    layout: blocks,
  }
}

export function industryToPage(doc: CollectionDoc): Page {
  const title = String(doc.title ?? '')
  const blocks: PageBlock[] = [
    {
      blockType: 'pageBanner',
      title,
      subtitle: doc.description ? String(doc.description) : '',
    },
  ]

  if (doc.bodyHtml) {
    blocks.push({ blockType: 'richContent', bodyHtml: String(doc.bodyHtml) })
  }

  blocks.push(DEFAULT_CTA)

  return {
    title,
    slug: slugFromDoc(doc),
    status: 'published',
    meta: metaFromDoc(doc),
    layout: blocks,
  }
}

export function portfolioArchivePage(projects: CollectionDoc[]): Page {
  return {
    title: 'Our Portfolio',
    slug: 'our-portfolio',
    status: 'published',
    meta: {
      title: 'Our Portfolio - Paradox Marketing',
      description: 'Explore client work and case studies from Paradox Marketing.',
    },
    layout: [
      {
        blockType: 'pageBanner',
        title: 'Our',
        titleHighlight: 'Portfolio',
        subtitle: 'Client work across websites, advertising, CRM, and full marketing systems.',
      },
      {
        blockType: 'portfolio',
        title: 'Featured',
        titleHighlight: 'Work',
        projects: projects.map((doc) => ({
          title: doc.title,
          year: doc.year,
          services: doc.services ?? doc.categories,
          imageUrl: doc.imageUrl,
          url: localUrlFromPath(String(doc.localPath ?? `portfolio/${doc.slug}`)),
        })),
      },
      DEFAULT_CTA,
    ],
  }
}

export function inferCollectionFromPath(path: string): ImportCollection | 'portfolio-archive' | null {
  const normalized = normalizePath(path)
  if (normalized === 'our-portfolio') return 'portfolio-archive'
  if (normalized.startsWith('capabilities/') && normalized.includes('/insights/')) return 'insights'
  if (normalized.startsWith('capabilities/')) return 'capabilities'
  if (normalized.startsWith('portfolio/')) return 'portfolio'
  if (normalized.startsWith('insights/')) return 'insights'
  if (normalized.startsWith('industries/')) return 'industries'
  return null
}

export type ImportCollection = 'capabilities' | 'insights' | 'portfolio' | 'industries'

export function wpEndpointForCollection(collection: ImportCollection | 'portfolio-archive'): string {
  switch (collection) {
    case 'capabilities':
      return 'capabilities'
    case 'insights':
      return 'insights'
    case 'portfolio':
    case 'portfolio-archive':
      return 'portfolio'
    case 'industries':
      return 'industries'
  }
}
