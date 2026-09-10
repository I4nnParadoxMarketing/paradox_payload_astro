import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: { singular: 'Portfolio', plural: 'Portfolio' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'year', 'status', 'updatedAt'],
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
    { name: 'client', type: 'text' },
    { name: 'projectName', type: 'text' },
    { name: 'year', type: 'text', admin: { description: 'Project timeline or year' } },
    { name: 'services', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'categories', type: 'text' },
    { name: 'imageUrl', type: 'text' },
    { name: 'url', type: 'text', admin: { description: 'Public URL for this project' } },
    { name: 'heroHeading', type: 'text' },
    { name: 'heroDescription', type: 'textarea' },
    { name: 'summaryHtml', type: 'textarea' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
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
