import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { MainMenu } from './globals/Menu'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || ''
const usePostgres = /^(postgres|postgresql):\/\//i.test(databaseUrl)
const useVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

const dataDir = path.resolve(dirname, '../data')
if (!usePostgres && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbFile = path.join(dataDir, 'payload.db').replace(/\\/g, '/')
const sqliteUrl = databaseUrl.startsWith('file:') ? databaseUrl : `file:${dbFile}`

function collectOrigins(): string[] {
  const extras = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return [
    process.env.FRONTEND_URL || 'http://localhost:4322',
    'http://localhost:4321',
    'http://localhost:4322',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.PAYLOAD_SERVER_URL || '',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4322',
    'http://192.168.1.25:3000',
    ...extras,
  ].filter(Boolean)
}

const origins = [...new Set(collectOrigins())]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Portfolio, Insights, Capabilities, People],
  globals: [MainMenu],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  // Keep empty locally so admin uses same-origin relative `/api` calls
  serverURL: process.env.PAYLOAD_SERVER_URL || '',
  cors: origins,
  csrf: origins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
        },
      })
    : sqliteAdapter({
        client: {
          url: sqliteUrl,
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
    ...(useVercelBlob
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            // Required on Vercel — server upload body limit is ~4.5MB
            clientUploads: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
