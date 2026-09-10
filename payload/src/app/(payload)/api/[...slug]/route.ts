/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server'
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = (req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_GET(config)(req, { params })

export const POST = (req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_POST(config)(req, { params })

export const DELETE = (req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_DELETE(config)(req, { params })

export const PATCH = (req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_PATCH(config)(req, { params })

export const OPTIONS = (req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_OPTIONS(config)(req, { params })
