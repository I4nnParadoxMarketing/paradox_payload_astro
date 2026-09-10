import fs from 'fs'
import path from 'path'

const htmlPath = process.argv[2] || '/tmp/live-home.html'
const outPath = path.resolve('frontend/src/data/main-menu.html')

const html = fs.readFileSync(htmlPath, 'utf8')
const start = html.indexOf('<nav id="menu"')
const end = html.indexOf('</nav>', start) + 6
let menu = html.slice(start, end)

menu = menu
  .replace(/https:\/\/paradoxmarketing\.io/g, '')
  .replace(/&#038;/g, '&')
  .replace(/&#8217;/g, "'")
  .replace(/&#8211;/g, '-')

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, menu)
console.log('Written', menu.length, 'chars to', outPath)
