'use client'

import { Button, useFormFields } from '@payloadcms/ui'
import React, { useMemo } from 'react'

type Props = {
  frontendUrl: string
  collection: 'insights' | 'capabilities'
}

function capabilityHref(
  frontendUrl: string,
  slug?: string,
  path?: string,
  url?: string,
): string | null {
  const base = frontendUrl.replace(/\/$/, '')
  const raw = path || url
  if (raw) {
    try {
      let pathname = raw
      if (/^https?:\/\//i.test(raw)) pathname = new URL(raw).pathname
      pathname = pathname.replace(/\/+$/, '')
      if (!pathname.startsWith('/')) pathname = `/${pathname}`
      if (!pathname.startsWith('/capabilities')) {
        pathname = `/capabilities${pathname.startsWith('/') ? '' : '/'}${pathname.replace(/^\//, '')}`
      }
      return `${base}${pathname}`
    } catch {
      /* fall through */
    }
  }
  if (!slug) return null
  return `${base}/capabilities/${slug}`
}

export default function ViewPageButtonClient({ frontendUrl, collection }: Props) {
  const slug = useFormFields(([fields]) => fields.slug?.value as string | undefined)
  const capabilityTag = useFormFields(([fields]) => fields.capabilityTag?.value as string | undefined)
  const path = useFormFields(([fields]) => fields.path?.value as string | undefined)
  const url = useFormFields(([fields]) => fields.url?.value as string | undefined)

  const href = useMemo(() => {
    if (collection === 'capabilities') {
      return capabilityHref(frontendUrl, slug, path, url)
    }
    if (!slug) return null
    const tag = capabilityTag?.trim()
    if (tag) return `${frontendUrl}/capabilities/${tag}/insights/${slug}`
    return `${frontendUrl}/insights/${slug}`
  }, [slug, capabilityTag, path, url, frontendUrl, collection])

  if (!href) return null

  return (
    <Button
      buttonStyle="secondary"
      el="anchor"
      newTab
      size="medium"
      url={href}
    >
      View page
    </Button>
  )
}
