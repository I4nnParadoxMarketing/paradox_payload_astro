import type { SanitizedConfig } from 'payload'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

const emptyLexical = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}

/**
 * Convert WordPress HTML into Lexical JSON for Insights / Capabilities `content`.
 * Images are left as HTML-derived nodes when possible; bodyHtml is also stored separately.
 */
export async function htmlToInsightContent(
  html: string | undefined | null,
  config: SanitizedConfig,
) {
  const cleaned = (html || '').trim()
  if (!cleaned) return emptyLexical

  try {
    const editorConfig = await editorConfigFactory.default({ config })
    return convertHTMLToLexical({
      editorConfig,
      html: cleaned,
      JSDOM,
    })
  } catch (error) {
    console.warn(
      'htmlToInsightContent fallback to empty Lexical:',
      error instanceof Error ? error.message : error,
    )
    return emptyLexical
  }
}
