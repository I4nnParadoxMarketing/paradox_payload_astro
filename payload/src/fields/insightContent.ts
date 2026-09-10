import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  lexicalHTMLField,
} from '@payloadcms/richtext-lexical'
import type { Block, Field } from 'payload'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function payloadServerUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

function absolutizeMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${payloadServerUrl()}${url}`
  return url
}

export const InsightCalloutBlock: Block = {
  slug: 'insightCallout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Tip', value: 'tip' },
        { label: 'Warning', value: 'warning' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const InsightQuoteBlock: Block = {
  slug: 'insightQuote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
  ],
}

export const InsightCtaBlock: Block = {
  slug: 'insightCta',
  labels: { singular: 'CTA Button', plural: 'CTA Buttons' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
  ],
}

export const InsightCallToActionBlock: Block = {
  slug: 'insightCallToAction',
  labels: {
    singular: 'Call To Action',
    plural: 'Call To Actions',
  },
  interfaceName: 'InsightCallToActionBlock',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue:
        'Considering hiring a consulting firm? Consult with one of our Trusted Advisors to discuss your business goals and needs.',
      admin: {
        description: 'Large heading inside the cyan CTA box (matches live insight pages).',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: "Let's Talk",
      required: true,
      label: 'Button label',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      required: true,
      label: 'Button URL',
    },
  ],
}

export const InsightImageBlock: Block = {
  slug: 'insightImage',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'url', type: 'text', required: true },
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}

export const insightContentBlocks: Block[] = [
  InsightCallToActionBlock,
  InsightCalloutBlock,
  InsightQuoteBlock,
  InsightCtaBlock,
  InsightImageBlock,
]

const insightHtmlConverters = ({ defaultConverters }: { defaultConverters: Record<string, unknown> }) => ({
  ...defaultConverters,
  upload: async ({
    node,
    populate,
    providedStyleTag,
  }: {
    node: {
      value?: number | string | { url?: string; alt?: string; mimeType?: string; filename?: string; width?: number; height?: number }
      relationTo?: string
      fields?: { alt?: string }
    }
    populate?: (args: { id: number | string; collectionSlug: string }) => Promise<Record<string, unknown> | undefined>
    providedStyleTag?: string
  }) => {
    let uploadDoc =
      typeof node.value === 'object' && node.value !== null
        ? (node.value as Record<string, unknown>)
        : undefined

    if (!uploadDoc && populate && (typeof node.value === 'number' || typeof node.value === 'string')) {
      uploadDoc = await populate({
        id: node.value,
        collectionSlug: node.relationTo || 'media',
      })
    }

    if (!uploadDoc?.url) return ''

    const url = escapeHtml(absolutizeMediaUrl(String(uploadDoc.url)))
    const alt = escapeHtml(String(node.fields?.alt || uploadDoc.alt || ''))
    const style = providedStyleTag || ''
    const mime = String(uploadDoc.mimeType || '')

    if (mime && !mime.startsWith('image')) {
      return `<a${style} href="${url}" rel="noopener noreferrer">${escapeHtml(String(uploadDoc.filename || 'Download'))}</a>`
    }

    const width = uploadDoc.width != null ? ` width="${escapeHtml(String(uploadDoc.width))}"` : ''
    const height = uploadDoc.height != null ? ` height="${escapeHtml(String(uploadDoc.height))}"` : ''
    return `<img${style} src="${url}" alt="${alt}"${width}${height} loading="lazy" />`
  },
  blocks: {
    insightCallout: ({ node }: { node: { fields: { variant?: string; title?: string; body?: string } } }) => {
      const fields = node.fields
      const title = fields.title ? `<strong>${escapeHtml(fields.title)}</strong>` : ''
      const variant = escapeHtml(fields.variant || 'info')
      return `<aside class="insight-callout insight-callout--${variant}">${title}<p>${escapeHtml(fields.body || '')}</p></aside>`
    },
    insightQuote: ({ node }: { node: { fields: { quote?: string; attribution?: string } } }) => {
      const fields = node.fields
      const cite = fields.attribution ? `<cite>${escapeHtml(fields.attribution)}</cite>` : ''
      return `<blockquote class="insight-quote"><p>${escapeHtml(fields.quote || '')}</p>${cite}</blockquote>`
    },
    insightCta: ({ node }: { node: { fields: { label?: string; url?: string } } }) => {
      const fields = node.fields
      return `<p class="insight-cta"><a class="btn-talk" href="${escapeHtml(fields.url || '#')}">${escapeHtml(fields.label || 'Learn more')}</a></p>`
    },
    insightCallToAction: ({
      node,
    }: {
      node: { fields: { heading?: string; ctaLabel?: string; ctaUrl?: string } }
    }) => {
      const fields = node.fields
      const heading = escapeHtml(
        fields.heading ||
          'Considering hiring a consulting firm? Consult with one of our Trusted Advisors to discuss your business goals and needs.',
      )
      const label = escapeHtml(fields.ctaLabel || "Let's Talk")
      const url = escapeHtml(
        fields.ctaUrl || 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      )
      return `<section class="call-to-action call-to-action--inline"><div class="call-to-action-col"><div class="cta-heading">${heading}</div><div class="call-to-action__btn-wrap"><a href="${url}" class="btn-talk call-to-action__btn">${label}</a></div></div></section>`
    },
    insightImage: ({ node }: { node: { fields: { url?: string; alt?: string; caption?: string } } }) => {
      const fields = node.fields
      const img = `<img src="${escapeHtml(fields.url || '')}" alt="${escapeHtml(fields.alt || '')}" loading="lazy" />`
      if (fields.caption) {
        return `<figure class="insight-image">${img}<figcaption>${escapeHtml(fields.caption)}</figcaption></figure>`
      }
      return `<p class="insight-image">${img}</p>`
    },
  },
})

export const insightLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => feature?.key !== 'heading'),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    BlocksFeature({
      blocks: insightContentBlocks,
    }),
  ],
})

/** Rich text body + auto-generated HTML for the frontend API. */
export const insightContentFields: Field[] = [
  {
    name: 'content',
    type: 'richText',
    label: 'Body',
    editor: insightLexicalEditor,
    admin: {
      description:
        'Write with the visual editor. Use / or the + menu to insert blocks — including Call To Action (Trusted Advisors banner), callout, quote, CTA button, or image.',
    },
  },
  lexicalHTMLField({
    htmlFieldName: 'bodyHtml',
    lexicalFieldName: 'content',
    storeInDB: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    converters: insightHtmlConverters as any,
  }),
]
