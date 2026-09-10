import React from 'react'
import ViewPageButtonClient from './ViewPageButton.client'

type Props = {
  collection: 'insights' | 'capabilities'
}

export default function ViewPageButton({ collection }: Props) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4322'
  return <ViewPageButtonClient collection={collection} frontendUrl={frontendUrl} />
}
