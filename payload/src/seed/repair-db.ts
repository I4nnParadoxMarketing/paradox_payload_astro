import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.resolve(dirname, '../../data/payload.db').replace(/\\/g, '/')

const DROP_TABLES = [
  'pages_blocks_service_triangle_services_features',
  'pages_blocks_service_triangle_services',
  '_pages_v_blocks_service_triangle_services_features',
  '_pages_v_blocks_service_triangle_services',
]

async function run() {
  const client = createClient({ url: `file:${dbFile}` })

  const temp = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '__new_%'",
  )
  for (const row of temp.rows) {
    await client.execute(`DROP TABLE IF EXISTS "${row.name as string}"`)
    console.log('Dropped temp table:', row.name)
  }

  for (const table of DROP_TABLES) {
    await client.execute(`DROP TABLE IF EXISTS "${table}"`)
    console.log('Dropped table:', table)
  }

  const DUPLICATE_INDEXES = [
    'payload_preferences_rels_order_idx',
    'payload_locked_documents_rels_order_idx',
  ]

  for (const indexName of DUPLICATE_INDEXES) {
    await client.execute(`DROP INDEX IF EXISTS "${indexName}"`)
    console.log('Dropped index (if existed):', indexName)
  }

  client.close()
  console.log('Database repair complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
