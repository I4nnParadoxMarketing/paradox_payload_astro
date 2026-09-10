import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { htmlToInsightContent } from './wp-import/htmlToInsightContent'
import {
  capabilityHeroFromAcf,
  capabilityHtmlFromAcf,
  capabilityNameFromAcf,
} from './wp-import/capabilityFromAcf'
import {
  capabilityPathFromLink,
  capabilityTagFromLink,
  decodeHtml,
  featuredImageUrl,
  fetchAllWPPosts,
  portfolioCategories,
  sanitizeHtml,
  stripHtml,
  yoastImageUrl,
  type WPPost,
} from './wp-import/utils'

async function upsertBySlug(
  payload: Payload,
  collection: 'portfolio' | 'insights' | 'capabilities' | 'people' | 'pages',
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  try {
    if (existing.docs[0]) {
      await payload.update({
        collection,
        id: existing.docs[0].id,
        data,
      })
      return existing.docs[0].id
    }

    const created = await payload.create({
      collection,
      data,
    })
    return created.id
  } catch (error) {
    console.warn(`Failed to import ${collection}/${slug}:`, error instanceof Error ? error.message : error)
    return null
  }
}

async function importPortfolio(payload: Payload) {
  const posts = await fetchAllWPPosts('portfolio')
  let count = 0

  for (const post of posts) {
    const acf = post.acf ?? {}
    await upsertBySlug(payload, 'portfolio', post.slug, {
      title: decodeHtml(post.title?.rendered ?? post.slug),
      slug: post.slug,
      status: 'published',
      client: (acf.po_client as string) || undefined,
      projectName: (acf.po_project_name as string) || undefined,
      year: (acf.po_date as string) || (acf.year_started as string) || undefined,
      services: (acf.po_service_provided as string) || (acf.portfolio_services as string) || undefined,
      industry: (acf.po_industry as string) || undefined,
      categories: (acf.po_category as string) || portfolioCategories(post),
      imageUrl: featuredImageUrl(post),
      url: post.link,
      heroHeading: (acf.hero_heading as string) || undefined,
      heroDescription: (acf.hero_description as string) || undefined,
      summaryHtml: (acf.r_description as string) || undefined,
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    })
    count += 1
  }

  console.log(`Portfolio: imported ${count} items`)
}

async function importInsights(payload: Payload) {
  const posts = await fetchAllWPPosts('insights', { embed: false })
  let count = 0

  for (const post of posts) {
    const excerpt = post.excerpt?.rendered
      ? stripHtml(post.excerpt.rendered)
      : stripHtml(post.content?.rendered ?? '').slice(0, 220)
    const bodyHtml = sanitizeHtml(post.content?.rendered)

    // Prefer editable Lexical; images become insightImage blocks (not HTML embeds)
    let content = await htmlToInsightContent(bodyHtml, payload.config)
    const dataBase = {
      title: decodeHtml(post.title?.rendered ?? post.slug),
      slug: post.slug,
      status: 'published' as const,
      excerpt: excerpt || undefined,
      bodyHtml,
      publishedDate: post.date?.slice(0, 10),
      imageUrl: yoastImageUrl(post),
      capabilityTag: capabilityTagFromLink(post.link),
      url: post.link,
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    }

    const existing = await payload.find({
      collection: 'insights',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    try {
      const data = { ...dataBase, content }
      if (existing.docs[0]) {
        await payload.update({ collection: 'insights', id: existing.docs[0].id, data })
      } else {
        await payload.create({ collection: 'insights', data })
      }
    } catch (error) {
      console.warn(
        `Failed to import insights/${post.slug}:`,
        error instanceof Error ? error.message : error,
      )
      continue
    }
    count += 1
  }

  console.log(`Insights: imported ${count} items`)
}

function fixEmptyAnchorHrefs(html: string): string {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs: string, inner: string) => {
    const match = attrs.match(/href\s*=\s*(["'])(.*?)\1/i)
    const href = match?.[2]?.trim()
    if (!href) {
      // Lexical link nodes require a URL — unwrap empty anchors
      return inner
    }
    return full
  })
}

async function importCapabilities(payload: Payload) {
  const posts = await fetchAllWPPosts('capabilities')
  const wpIdToPayloadId = new Map<number, string | number>()

  for (const post of posts) {
    const acf = post.acf ?? {}
    const fromAcf = capabilityHtmlFromAcf(acf)
    const fromContent = sanitizeHtml(post.content?.rendered)
    const rawHtml = sanitizeHtml(fromAcf || fromContent)
    const bodyHtml = rawHtml ? fixEmptyAnchorHrefs(rawHtml) : undefined
    const path = capabilityPathFromLink(post.link) || `capabilities/${post.slug}`
    const title =
      capabilityNameFromAcf(acf) || decodeHtml(post.title?.rendered ?? post.slug)
    const imageUrl =
      capabilityHeroFromAcf(acf) ||
      featuredImageUrl(post) ||
      (acf.banner_image as string) ||
      undefined

    const base = {
      title,
      slug: post.slug,
      path,
      status: 'published' as const,
      description:
        stripHtml(post.excerpt?.rendered || fromAcf || post.content?.rendered || '').slice(0, 280) ||
        undefined,
      color: (acf.accent_color as string) || (acf.capability_accent_color as string) || undefined,
      imageUrl,
      url: post.link,
      bodyHtml,
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    }

    let id: string | number | null = null
    if (bodyHtml) {
      try {
        const content = await htmlToInsightContent(bodyHtml, payload.config)
        id = await upsertBySlug(payload, 'capabilities', post.slug, { ...base, content })
      } catch (error) {
        console.warn(
          `Lexical convert failed for capabilities/${post.slug}:`,
          error instanceof Error ? error.message : error,
        )
      }
    }
    if (!id) {
      id = await upsertBySlug(payload, 'capabilities', post.slug, base)
    }
    if (id) wpIdToPayloadId.set(post.id, id)
  }

  // Prefer hierarchy from public URL path (WP parent is often 0 for nested caps)
  const byPath = new Map<string, string | number>()
  for (const post of posts) {
    const path = capabilityPathFromLink(post.link) || `capabilities/${post.slug}`
    const id = wpIdToPayloadId.get(post.id)
    if (id) byPath.set(path, id)
  }

  for (const post of posts) {
    const path = capabilityPathFromLink(post.link) || `capabilities/${post.slug}`
    const payloadId = byPath.get(path)
    if (!payloadId) continue
    const segments = path.split('/')
    if (segments.length <= 2) continue // capabilities/{slug} = top-level
    const parentPath = segments.slice(0, -1).join('/')
    const parentId = byPath.get(parentPath)
    if (!parentId) continue

    await payload.update({
      collection: 'capabilities',
      id: payloadId,
      data: { parent: parentId },
    })
  }

  console.log(`Capabilities: imported ${posts.length} items`)
}

async function importPeople(payload: Payload) {
  const posts = await fetchAllWPPosts('prdx-people')
  let count = 0

  for (const post of posts) {
    const acf = post.acf ?? {}
    const role =
      (acf.position as string) ||
      stripHtml(post.content?.rendered ?? '') ||
      undefined

    await upsertBySlug(payload, 'people', post.slug, {
      name: decodeHtml((acf.name as string) || post.title?.rendered || post.slug),
      slug: post.slug,
      status: 'published',
      role,
      imageUrl: (acf.profile_image_url as string) || featuredImageUrl(post),
      bioHtml: (acf.position_details as string) || post.content?.rendered || '',
      linkedinUrl: (acf.social_media_urls as { linkedin_url?: string })?.linkedin_url || undefined,
      mantra: (acf.mantra as string) || undefined,
      isLeader: Boolean(acf.is_leadership ?? acf.leadership ?? role?.toLowerCase().includes('chief')),
      sortOrder: post.menu_order ?? 0,
      url: post.link,
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    })
    count += 1
  }

  console.log(`People: imported ${count} items`)
}

const PAGE_SLUG_ALIASES: Record<string, string> = {
  'contact-us-3': 'contact-us',
  'our-team-2': 'our-team',
}

const SKIP_PAGE_SLUG =
  /^(test|staging|homepage|demo|pdx_|footer-demo|story-staging|dev-step|landing|thank|webinar|clutch|book-|whac|engage-us|retain-us|free-|audit-|accomplishments|success-stories|ty-page|get-started|portfolios|joshuaballard|discovery-call|how-to-best|hubspot-gold|business-show|eula|disclaimer|new-case-study|seo$|go-|website-rebuild)/i

function shouldSkipPage(slug: string): boolean {
  if (slug === 'home-2' || slug.startsWith('homepage')) return true
  if (SKIP_PAGE_SLUG.test(slug)) return true
  return false
}

async function importPages(payload: Payload) {
  const posts = await fetchAllWPPosts('pages', { embed: false })
  let count = 0
  const seen = new Set<string>()

  for (const post of posts) {
    if (shouldSkipPage(post.slug)) continue

    const slug = PAGE_SLUG_ALIASES[post.slug] || post.slug
    if (seen.has(slug)) continue
    seen.add(slug)

    // Keep structured homepage / seeded marketing pages from npm run seed
    if (slug === 'home') continue

    const title = decodeHtml(post.title?.rendered ?? post.slug)
    const bodyHtml = sanitizeHtml(post.content?.rendered)
    if (!bodyHtml) {
      console.warn(`Skipping empty page: ${slug}`)
      continue
    }

    // Preserve carefully-built contact-us / our-team layouts if they already exist
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const existingDoc = existing.docs[0] as { id: string | number; layout?: Array<{ blockType?: string }> } | undefined
    const hasStructuredLayout =
      existingDoc?.layout?.some((block) =>
        ['contactSection', 'teamSection', 'serviceTriangle', 'hero'].includes(block.blockType || ''),
      ) ?? false

    if (hasStructuredLayout) {
      console.log(`Skipped structured page (keep seed layout): ${slug}`)
      continue
    }

    await upsertBySlug(payload, 'pages', slug, {
      title,
      slug,
      status: 'published',
      layout: [
        {
          blockType: 'pageBanner',
          title,
          titleHighlight: '',
          subtitle: post.yoast_head_json?.description || '',
        },
        {
          blockType: 'richContent',
          title: '',
          bodyHtml,
        },
      ],
      meta: {
        title: post.yoast_head_json?.title || title,
        description: post.yoast_head_json?.description,
      },
    })
    count += 1
  }

  console.log(`Pages: imported ${count} items`)
}

async function run() {
  const payload = await getPayload({ config })
  const only = process.argv[2]?.toLowerCase()
  const steps: Array<[string, (p: Payload) => Promise<void>]> = [
    ['portfolio', importPortfolio],
    ['insights', importInsights],
    ['capabilities', importCapabilities],
    ['people', importPeople],
    ['pages', importPages],
  ]

  console.log(
    only
      ? `Importing WordPress collection: ${only}...`
      : 'Importing from WordPress REST API (read-only)...',
  )

  for (const [name, fn] of steps) {
    if (only && only !== name) continue
    await fn(payload)
  }

  console.log('WordPress import complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
