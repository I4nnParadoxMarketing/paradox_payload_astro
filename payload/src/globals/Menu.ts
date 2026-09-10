import type { Field, GlobalConfig } from 'payload'

const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'url',
    type: 'text',
    defaultValue: '#',
    admin: {
      description: 'Use # for parent items that only open a submenu.',
    },
  },
]

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Main Menu',
  admin: {
    description: 'Site navigation shown in the header (mmenu). Supports up to 3 levels.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Menu item', plural: 'Menu items' },
      admin: {
        description: 'Top-level items (Capabilities, Industries, Insights, Our Team, Our Portfolio).',
      },
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Child item', plural: 'Child items' },
          admin: {
            initCollapsed: true,
          },
          fields: [
            ...linkFields,
            {
              name: 'links',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              admin: {
                description: 'Third-level links under this child.',
                initCollapsed: true,
              },
              fields: linkFields,
            },
          ],
        },
      ],
    },
  ],
}
