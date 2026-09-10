import type { CollectionConfig } from 'payload'
import { insightContentFields } from '../fields/insightContent'
import { capabilityFrontendUrl } from '../lib/frontendUrls'

export const Capabilities: CollectionConfig = {
  slug: 'capabilities',
  labels: { singular: 'Capability', plural: 'Capabilities' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'parent', 'status', 'updatedAt'],
    preview: (doc) => capabilityFrontendUrl(doc),
    components: {
      edit: {
        beforeDocumentControls: ['/components/ViewPageButton/ViewCapabilityPageButton'],
      },
    },
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'path',
      type: 'text',
      index: true,
      admin: {
        description:
          'Public URL path without leading slash, e.g. capabilities/demand-generation/lead-generation',
      },
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
    { name: 'color', type: 'text', admin: { description: 'Accent color e.g. #EFB155' } },
    { name: 'imageUrl', type: 'text' },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'capabilities',
      admin: { description: 'Parent capability for nested pages' },
    },
    { name: 'url', type: 'text', admin: { description: 'Original WordPress URL (optional)' } },
    ...insightContentFields,
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
