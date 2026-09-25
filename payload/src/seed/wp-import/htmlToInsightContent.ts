import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { SanitizedConfig } from 'payload'
import { insightLexicalEditor } from '../../fields/insightContent'

type EditorConfig = Awaited<ReturnType<typeof editorConfigFactory.fromEditor>>

let editorConfigPromise: Promise<EditorConfig> | null = null

/** Drop layout-only tags so Lexical accepts the insight body. */
function simplifyHtml(html: string): string {
  const dom = new JSDOM(`<body>${html}</body>`)
  const doc = dom.window.document

  doc.querySelectorAll('script, style, iframe, svg, form, noscript').forEach((el) => el.remove())

  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || ''
    const alt = img.getAttribute('alt') || 'Image'
    const paragraph = doc.createElement('p')
    if (src) {
      const link = doc.createElement('a')
      link.setAttribute('href', src)
      link.textContent = alt
      paragraph.appendChild(link)
    } else {
      paragraph.textContent = alt
    }
    img.replaceWith(paragraph)
  })

  doc.querySelectorAll('div, figure, figcaption, span, section, article').forEach((el) => {
    const parent = el.parentNode
    if (!parent) return
    while (el.firstChild) parent.insertBefore(el.firstChild, el)
    parent.removeChild(el)
  })

  doc.querySelectorAll('h1').forEach((heading) => {
    const next = doc.createElement('h2')
    next.innerHTML = heading.innerHTML
    heading.replaceWith(next)
  })

  return doc.body.innerHTML.trim() || '<p></p>'
}

/** Turn WordPress HTML into the Lexical body stored on insights. */
export async function htmlToInsightContent(html: string | undefined, config: SanitizedConfig) {
  if (!editorConfigPromise) {
    editorConfigPromise = editorConfigFactory.fromEditor({
      config,
      editor: insightLexicalEditor,
    })
  }

  const editorConfig = await editorConfigPromise
  return convertHTMLToLexical({
    editorConfig,
    html: simplifyHtml(html || ''),
    JSDOM,
  })
}
