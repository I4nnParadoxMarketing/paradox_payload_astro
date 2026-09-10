import type { CollectionConfig } from 'payload'

export const Industries: CollectionConfig = {
  slug: 'industries',
  labels: { singular: 'Industry', plural: 'Industries' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'localPath',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, description: 'Local route path e.g. industries/legal' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'imageUrl', type: 'text' },
    { name: 'url', type: 'text' },
    { name: 'bodyHtml', type: 'code', admin: { language: 'html' } },
    { name: 'wpId', type: 'number', admin: { readOnly: true, position: 'sidebar' } },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
