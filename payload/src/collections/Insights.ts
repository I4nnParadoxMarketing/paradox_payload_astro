import type { CollectionConfig } from 'payload'

export const Insights: CollectionConfig = {
  slug: 'insights',
  labels: { singular: 'Insight', plural: 'Insights' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'capabilityTag', 'status', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'bodyHtml', type: 'code', admin: { language: 'html' } },
    { name: 'publishedDate', type: 'date' },
    { name: 'imageUrl', type: 'text' },
    { name: 'capabilityTag', type: 'text', admin: { description: 'Related capability slug from live site' } },
    { name: 'url', type: 'text' },
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
