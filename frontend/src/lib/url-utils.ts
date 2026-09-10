export function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}

export function localPathFromUrl(url: string): string | null {
  try {
    return normalizePath(new URL(url).pathname)
  } catch {
    return null
  }
}

export function localUrlFromPath(path: string): string {
  const normalized = normalizePath(path)
  return normalized ? `/${normalized}` : '/'
}
