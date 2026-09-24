/**
 * Pull capability page fields from WordPress ACF payloads.
 * Field names vary across older/newer Paradox capability templates.
 */

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>
      if (typeof obj.url === 'string' && obj.url.trim()) return obj.url.trim()
      if (typeof obj.source_url === 'string' && obj.source_url.trim()) return obj.source_url.trim()
    }
  }
  return undefined
}

export function capabilityNameFromAcf(acf: Record<string, unknown>): string | undefined {
  return firstString(
    acf.capability_name,
    acf.capability_title,
    acf.page_title,
    acf.heading,
    acf.hero_heading,
    acf.name,
  )
}

export function capabilityHeroFromAcf(acf: Record<string, unknown>): string | undefined {
  return firstString(
    acf.hero_image,
    acf.hero_banner,
    acf.banner_image,
    acf.capability_hero,
    acf.featured_image,
    acf.background_image,
  )
}

export function capabilityHtmlFromAcf(acf: Record<string, unknown>): string | undefined {
  const chunks: string[] = []

  const candidates = [
    acf.capability_content,
    acf.content_html,
    acf.page_content,
    acf.main_content,
    acf.body,
    acf.description,
    acf.r_description,
    acf.hero_description,
    acf.intro,
  ]

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) chunks.push(value.trim())
  }

  // Some templates store flexible content / repeater rows
  const flexible = acf.flexible_content || acf.content_blocks || acf.sections
  if (Array.isArray(flexible)) {
    for (const row of flexible) {
      if (!row || typeof row !== 'object') continue
      const r = row as Record<string, unknown>
      for (const key of ['content', 'html', 'body', 'text', 'copy', 'description']) {
        if (typeof r[key] === 'string' && (r[key] as string).trim()) {
          chunks.push((r[key] as string).trim())
        }
      }
    }
  }

  if (!chunks.length) return undefined
  return chunks.join('\n')
}
