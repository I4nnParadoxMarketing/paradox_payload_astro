/**
 * Frontend public URLs for CMS documents (used by admin Preview / View page).
 */
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:4322'

export function insightFrontendPath(doc: {
  slug?: unknown
  capabilityTag?: unknown
}): string | null {
  const slug = typeof doc.slug === 'string' ? doc.slug : null
  if (!slug) return null
  const tag = typeof doc.capabilityTag === 'string' ? doc.capabilityTag.trim() : ''
  if (tag) return `/capabilities/${tag}/insights/${slug}`
  return `/insights/${slug}`
}

/** Normalize stored capability path to `/capabilities/...` form. */
export function normalizeCapabilityPath(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  let path = raw.trim()
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname
    }
  } catch {
    return null
  }
  path = path.replace(/^\/+|\/+$/g, '')
  if (!path) return null
  if (!path.startsWith('capabilities/')) {
    path = `capabilities/${path.replace(/^capabilities\/?/, '')}`
  }
  return `/${path}`
}

export function capabilityFrontendPath(doc: {
  slug?: unknown
  path?: unknown
  url?: unknown
}): string | null {
  const fromPath = normalizeCapabilityPath(doc.path)
  if (fromPath) return fromPath

  const fromUrl = normalizeCapabilityPath(doc.url)
  if (fromUrl) return fromUrl

  const slug = typeof doc.slug === 'string' ? doc.slug : null
  if (!slug) return null
  return `/capabilities/${slug}`
}

export function insightFrontendUrl(doc: { slug?: unknown; capabilityTag?: unknown }): string | null {
  const path = insightFrontendPath(doc)
  return path ? `${frontendUrl()}${path}` : null
}

export function capabilityFrontendUrl(doc: {
  slug?: unknown
  path?: unknown
  url?: unknown
}): string | null {
  const path = capabilityFrontendPath(doc)
  return path ? `${frontendUrl()}${path}` : null
}
