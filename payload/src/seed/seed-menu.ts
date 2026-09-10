import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const menuJsonPath = path.resolve(dirname, 'main-menu.json')

async function seedMenu() {
  const payload = await getPayload({ config })
  const raw = fs.readFileSync(menuJsonPath, 'utf8')
  const data = JSON.parse(raw) as { items: unknown[] }

  await payload.updateGlobal({
    slug: 'main-menu',
    data: {
      items: data.items,
    },
  })

  console.log(`Seeded Main Menu with ${data.items.length} top-level items`)
  process.exit(0)
}

seedMenu().catch((err) => {
  console.error(err)
  process.exit(1)
})
