import { createClient } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.resolve(dirname, '../../data/payload.db').replace(/\\/g, '/')

const DUPLICATE_INDEXES = [
  'payload_preferences_rels_order_idx',
  'payload_locked_documents_rels_order_idx',
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

  const indexes = await client.execute(
    "SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name LIKE '%_rels_order_idx' ORDER BY name",
  )
  console.log('Existing rels order indexes:')
  for (const row of indexes.rows) {
    console.log(`  ${row.name} on ${row.tbl_name}`)
  }

  for (const indexName of DUPLICATE_INDEXES) {
    const exists = indexes.rows.some((row) => row.name === indexName)
    if (exists) {
      await client.execute(`DROP INDEX IF EXISTS "${indexName}"`)
      console.log('Dropped index:', indexName)
    }
  }

  client.close()
  console.log('Index repair complete. Restart Payload — it will recreate missing indexes.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
