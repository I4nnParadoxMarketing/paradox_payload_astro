import type { CollectionConfig } from 'payload'

export const Capabilities: CollectionConfig = {
  slug: 'capabilities',
  labels: { singular: 'Capability', plural: 'Capabilities' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'status', 'updatedAt'],
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
    { name: 'description', type: 'textarea' },
    { name: 'color', type: 'text', admin: { description: 'Accent color e.g. #EFB155' } },
    { name: 'imageUrl', type: 'text' },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'capabilities',
      admin: { description: 'Parent capability for nested pages' },
    },
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
