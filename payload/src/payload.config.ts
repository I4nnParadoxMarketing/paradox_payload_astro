import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Capabilities } from './collections/Capabilities'
import { Insights } from './collections/Insights'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { People } from './collections/People'
import { Portfolio } from './collections/Portfolio'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dataDir = path.resolve(dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbFile = path.join(dataDir, 'payload.db').replace(/\\/g, '/')
const dbPath = process.env.DATABASE_URL?.startsWith('file:')
  ? process.env.DATABASE_URL
  : `file:${dbFile}`

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Portfolio, Insights, Capabilities, People],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:4321',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:4321',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: dbPath,
    },
    wal: true,
    busyTimeout: 5000,
  }),
  plugins: [
    mcpPlugin({
      collections: {
        pages: { enabled: { find: true, create: true, update: true, delete: false } },
        portfolio: { enabled: { find: true, create: true, update: true, delete: false } },
        insights: { enabled: { find: true, create: true, update: true, delete: false } },
        capabilities: { enabled: { find: true, create: true, update: true, delete: false } },
        people: { enabled: { find: true, create: true, update: true, delete: false } },
        media: { enabled: { find: true, create: true, update: false, delete: false } },
      },
    }),
  ],
})
