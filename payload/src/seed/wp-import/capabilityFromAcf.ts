type AcfImage = { url?: string }

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function imageUrl(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const url = (value as AcfImage).url
  return typeof url === 'string' && url.trim() ? url : undefined
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function asHtml(value: unknown): string {
  const raw = text(value)
  if (!raw) return ''
  return raw.includes('<') ? raw : `<p>${escapeHtml(raw)}</p>`
}

function heading(value: unknown, tag = 'h2'): string {
  const raw = text(value)
  if (!raw) return ''
  if (raw.includes('<')) return `<${tag}>${raw}</${tag}>`
  return `<${tag}>${escapeHtml(raw)}</${tag}>`
}

function collectLayoutHtml(node: unknown, out: string[]) {
  if (!node) return
  if (Array.isArray(node)) {
    node.forEach((item) => collectLayoutHtml(item, out))
    return
  }
  if (typeof node !== 'object') return

  const record = node as Record<string, unknown>
  if ('post_title' in record && 'post_content' in record) return

  for (const [key, value] of Object.entries(record)) {
    if (key === 'acf_fc_layout') continue
    if (typeof value === 'string' && value.includes('<')) out.push(value)
    else if (value && typeof value === 'object') collectLayoutHtml(value, out)
  }
}

function htmlFromNewTemplate(acf: Record<string, unknown>): string {
  const parts: string[] = []
  parts.push(heading(acf.hero_title, 'h1'))
  parts.push(asHtml(acf.hero_subtitle))
  parts.push(heading(acf.impact_title))
  parts.push(asHtml(acf.impact_subtitle))

  if (Array.isArray(acf.impact_services)) {
    const items = acf.impact_services
      .map((item) => {
        if (!item || typeof item !== 'object') return ''
        const row = item as Record<string, unknown>
        const label = text(row.label)
        const description = asHtml(row.description)
        const image = imageUrl(row.image)
        if (!label && !description && !image) return ''
        const img = image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(label)}" />` : ''
        return `<li>${img}${label ? `<h3>${escapeHtml(label)}</h3>` : ''}${description}</li>`
      })
      .filter(Boolean)
    if (items.length) parts.push(`<ul>${items.join('')}</ul>`)
  }

  parts.push(heading(acf.why_title))
  parts.push(asHtml(acf.why_description))
  if (text(acf.testimonial_quote)) {
    const cite = text(acf.testimonial_author)
    parts.push(
      `<blockquote><p>${escapeHtml(text(acf.testimonial_quote))}</p>${cite ? `<cite>${escapeHtml(cite)}</cite>` : ''}</blockquote>`,
    )
  }

  parts.push(heading(acf.help_title))
  parts.push(asHtml(acf.help_subtitle))
  if (Array.isArray(acf.help_items)) {
    for (const item of acf.help_items) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      parts.push(heading(row.title, 'h3'))
      parts.push(asHtml(row.description))
    }
  }

  parts.push(heading(acf.more_services_title))
  parts.push(asHtml(acf.more_services_subtitle))
  parts.push(heading(acf.faq_title))
  parts.push(asHtml(acf.faq_subtitle))
  if (Array.isArray(acf.faq_items)) {
    for (const item of acf.faq_items) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      parts.push(heading(row.question, 'h3'))
      parts.push(asHtml(row.answer))
    }
  }

  parts.push(heading(acf.dark_cta_title))
  parts.push(asHtml(acf.dark_cta_subtitle))
  parts.push(heading(acf.light_cta_title))
  parts.push(asHtml(acf.light_cta_subtitle))
  return parts.filter(Boolean).join('\n')
}

function htmlFromLegacyTemplate(acf: Record<string, unknown>): string {
  const parts: string[] = []
  const intro = acf.introduction_section_including_acf
  if (intro && typeof intro === 'object') {
    const section = intro as Record<string, unknown>
    parts.push(heading(section.title))
    parts.push(asHtml(section.content))
  }

  const layoutHtml: string[] = []
  collectLayoutHtml(acf.flexible_layout, layoutHtml)
  parts.push(...layoutHtml)

  const cta = acf.call_to_action
  if (cta && typeof cta === 'object') {
    const section = cta as Record<string, unknown>
    parts.push(asHtml(section.cta_content))
  }

  return parts.filter(Boolean).join('\n')
}

export function capabilityNameFromAcf(acf: Record<string, unknown>): string | undefined {
  return text(acf.capability_name) || text(acf.hero_title) || undefined
}

export function capabilityHeroFromAcf(acf: Record<string, unknown>): string | undefined {
  return imageUrl(acf.capability_hero_image) || imageUrl(acf.service_icon) || imageUrl(acf.banner_image)
}

export function capabilityHtmlFromAcf(acf: Record<string, unknown>): string | undefined {
  const html = [htmlFromLegacyTemplate(acf), htmlFromNewTemplate(acf)].filter(Boolean).join('\n')
  return html.trim() || undefined
}
