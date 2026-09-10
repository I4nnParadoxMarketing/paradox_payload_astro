import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Video', plural: 'Hero Videos' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'headingHighlight', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'ctaLabel', type: 'text', defaultValue: "Let's Talk" },
    { name: 'ctaUrl', type: 'text' },
    { name: 'videoPoster', type: 'text' },
    { name: 'videoUrl', type: 'text' },
    { name: 'triangleImage', type: 'text' },
  ],
}

export const LogoMarqueeBlock: Block = {
  slug: 'logoMarquee',
  labels: { singular: 'Logo Marquee', plural: 'Logo Marquees' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'labelHighlight', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'url', type: 'text', required: true },
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
        { name: 'alt', type: 'text' },
      ],
    },
  ],
}

export const WhatWeDoBlock: Block = {
  slug: 'whatWeDo',
  labels: { singular: 'What We Do', plural: 'What We Do' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'description', type: 'richText', required: true },
  ],
}

export const ServiceTriangleBlock: Block = {
  slug: 'serviceTriangle',
  labels: { singular: 'Service Triangle', plural: 'Service Triangles' },
  fields: [
    {
      name: 'services',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'serviceKey', type: 'select', options: ['website', 'ads', 'crm'], required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'color', type: 'text', required: true },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaUrl', type: 'text' },
      ],
    },
  ],
}

export const ProblemsBlock: Block = {
  slug: 'problems',
  labels: { singular: 'Problems Grid', plural: 'Problems Grids' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'imageUrl', type: 'text', required: true },
        { name: 'imageWidth', type: 'number' },
        { name: 'imageHeight', type: 'number' },
      ],
    },
  ],
}

export const MetricsBlock: Block = {
  slug: 'metrics',
  labels: { singular: 'Metrics', plural: 'Metrics' },
  fields: [
    {
      name: 'categories',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
  ],
}

export const WorkWithUsBlock: Block = {
  slug: 'workWithUs',
  labels: { singular: 'Work With Us', plural: 'Work With Us' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'subtitle', type: 'text', required: true },
    { name: 'subtitleHighlight', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'clutchLogoUrl', type: 'text' },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        { name: 'rating', type: 'number', defaultValue: 5 },
        { name: 'text', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'position', type: 'text' },
      ],
    },
  ],
}

export const TechnologyBlock: Block = {
  slug: 'technology',
  labels: { singular: 'Technology', plural: 'Technology' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'intro', type: 'richText' },
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'color', type: 'text', required: true },
        {
          name: 'logos',
          type: 'array',
          fields: [
            { name: 'url', type: 'text', required: true },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
      ],
    },
  ],
}

export const PortfolioBlock: Block = {
  slug: 'portfolio',
  labels: { singular: 'Portfolio', plural: 'Portfolio' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    {
      name: 'useCollection',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pull projects from the Portfolio collection instead of manual entries' },
    },
    {
      name: 'collectionLimit',
      type: 'number',
      defaultValue: 6,
      admin: { condition: (_, siblingData) => siblingData?.useCollection === true },
    },
    {
      name: 'selectedProjects',
      type: 'relationship',
      relationTo: 'portfolio',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.useCollection === true,
        description: 'Optional: pick specific projects. Leave empty to show the latest published items.',
      },
    },
    {
      name: 'projects',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData?.useCollection !== true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'text' },
        { name: 'services', type: 'text' },
        { name: 'imageUrl', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const WhoWeAreBlock: Block = {
  slug: 'whoWeAre',
  labels: { singular: 'Who We Are', plural: 'Who We Are' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'imageUrl', type: 'text' },
  ],
}

export const InsightsBlock: Block = {
  slug: 'insights',
  labels: { singular: 'Insights', plural: 'Insights' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    {
      name: 'useCollection',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pull posts from the Insights collection instead of manual entries' },
    },
    {
      name: 'collectionLimit',
      type: 'number',
      defaultValue: 3,
      admin: { condition: (_, siblingData) => siblingData?.useCollection === true },
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'insights',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.useCollection === true,
        description: 'Optional: pick specific posts. Leave empty to show the latest published items.',
      },
    },
    {
      name: 'posts',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData?.useCollection !== true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'excerpt', type: 'textarea' },
        { name: 'date', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'imageUrl', type: 'text' },
      ],
    },
  ],
}

export const PageBannerBlock: Block = {
  slug: 'pageBanner',
  labels: { singular: 'Page Banner', plural: 'Page Banners' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    { name: 'variant', type: 'select', defaultValue: 'dark', options: [{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }] },
  ],
}

export const ContactSectionBlock: Block = {
  slug: 'contactSection',
  labels: { singular: 'Contact Section', plural: 'Contact Sections' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleHighlight', type: 'text' },
    { name: 'bodyHtml', type: 'textarea', required: true },
    { name: 'phone', type: 'text' },
    { name: 'phoneTel', type: 'text' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
    { name: 'hubspotPortalId', type: 'text' },
    { name: 'hubspotFormId', type: 'text' },
  ],
}

export const RichContentBlock: Block = {
  slug: 'richContent',
  labels: { singular: 'Rich Content', plural: 'Rich Content' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'bodyHtml', type: 'textarea', required: true },
  ],
}

export const CapabilitiesGridBlock: Block = {
  slug: 'capabilitiesGrid',
  labels: { singular: 'Capabilities Grid', plural: 'Capabilities Grids' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'titleHighlight', type: 'text' },
    {
      name: 'useCollection',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pull top-level capabilities from the Capabilities collection' },
    },
    {
      name: 'selectedCapabilities',
      type: 'relationship',
      relationTo: 'capabilities',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.useCollection === true,
        description: 'Optional: pick specific capabilities. Leave empty to show all top-level items.',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData?.useCollection !== true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'url', type: 'text' },
        { name: 'color', type: 'text' },
      ],
    },
  ],
}

export const TeamSectionBlock: Block = {
  slug: 'teamSection',
  labels: { singular: 'Team Section', plural: 'Team Sections' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    { name: 'leadershipTitle', type: 'text' },
    { name: 'leadershipIntro', type: 'textarea' },
    {
      name: 'useCollection',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pull leaders from the People collection' },
    },
    {
      name: 'selectedPeople',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.useCollection === true,
        description: 'Optional: pick specific people. Leave empty to show all marked as leaders.',
      },
    },
    {
      name: 'leaders',
      type: 'array',
      admin: { condition: (_, siblingData) => siblingData?.useCollection !== true },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'imageUrl', type: 'text' },
      ],
    },
    { name: 'teamSizeTitle', type: 'text' },
    { name: 'teamSizeDescription', type: 'textarea' },
  ],
}

export const CtaBannerBlock: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'ctaLabel', type: 'text', defaultValue: "Let's Talk" },
    { name: 'ctaUrl', type: 'text' },
  ],
}

export const pageBlocks = [
  HeroBlock,
  LogoMarqueeBlock,
  WhatWeDoBlock,
  ServiceTriangleBlock,
  ProblemsBlock,
  MetricsBlock,
  WorkWithUsBlock,
  TestimonialsBlock,
  TechnologyBlock,
  PortfolioBlock,
  WhoWeAreBlock,
  InsightsBlock,
  PageBannerBlock,
  ContactSectionBlock,
  RichContentBlock,
  CapabilitiesGridBlock,
  TeamSectionBlock,
  CtaBannerBlock,
]
