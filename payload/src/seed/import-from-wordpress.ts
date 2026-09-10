import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import {
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
  collection: 'portfolio' | 'insights' | 'capabilities' | 'people',
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
    return existing.docs[0]?.id
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

    await upsertBySlug(payload, 'insights', post.slug, {
      title: decodeHtml(post.title?.rendered ?? post.slug),
      slug: post.slug,
      status: 'published',
      excerpt: excerpt || undefined,
      bodyHtml: sanitizeHtml(post.content?.rendered),
      publishedDate: post.date?.slice(0, 10),
      imageUrl: yoastImageUrl(post),
      capabilityTag: capabilityTagFromLink(post.link),
      url: post.link,
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    })
    count += 1
  }

  console.log(`Insights: imported ${count} items`)
}

async function importCapabilities(payload: Payload) {
  const posts = await fetchAllWPPosts('capabilities')
  const wpIdToPayloadId = new Map<number, string | number>()

  for (const post of posts) {
    const acf = post.acf ?? {}
    const id = await upsertBySlug(payload, 'capabilities', post.slug, {
      title: decodeHtml(post.title?.rendered ?? post.slug),
      slug: post.slug,
      status: 'published',
      description: stripHtml(post.excerpt?.rendered ?? post.content?.rendered ?? '').slice(0, 280) || undefined,
      color: (acf.accent_color as string) || (acf.capability_accent_color as string) || undefined,
      imageUrl: featuredImageUrl(post) || (acf.banner_image as string) || undefined,
      url: post.link,
      bodyHtml: sanitizeHtml(post.content?.rendered),
      wpId: post.id,
      meta: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    })
    wpIdToPayloadId.set(post.id, id)
  }

  for (const post of posts) {
    if (!post.parent) continue
    const payloadId = wpIdToPayloadId.get(post.id)
    const parentId = wpIdToPayloadId.get(post.parent)
    if (!payloadId || !parentId) continue

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

async function run() {
  const payload = await getPayload({ config })

  console.log('Importing from WordPress REST API (read-only)...')
  await importPortfolio(payload)
  await importInsights(payload)
  await importCapabilities(payload)
  await importPeople(payload)
  console.log('WordPress import complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
