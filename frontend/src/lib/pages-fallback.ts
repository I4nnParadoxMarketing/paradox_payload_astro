import type { Page } from './payload'

export const pagesFallback: Record<string, Page> = {
  'contact-us': {
    title: 'Contact Us',
    slug: 'contact-us',
    status: 'published',
    meta: {
      title: 'Contact Us - Paradox Marketing',
      description: 'Get in touch with Paradox Marketing. We specialize in tailored marketing solutions that deliver real results.',
    },
    layout: [
      {
        blockType: 'contactSection',
        title: 'Contact',
        titleHighlight: 'Us',
        bodyHtml: `<p>We'd love to hear from you! Whether you're looking to boost your sales, refine your marketing strategy, or explore new ways to grow your business, our team is here to help. At Paradox Marketing, we specialize in creating tailored solutions that deliver real results.</p>
<p><a href="tel:0871345850"><strong>CALL NOW: (08) 7134 5850</strong></a></p>
<p>Let's start the conversation and explore how we can support your success. Simply fill out the form, and one of our experts will get back to you promptly.</p>
<p>We're always ready to connect and provide insights into your unique challenges and opportunities.</p>`,
        phone: '(08) 7134 5850',
        phoneTel: '0871345850',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
        hubspotPortalId: '431748',
        hubspotFormId: 'add70aed-7818-46f7-aa5d-d79337b357d2',
      },
    ],
  },
  'our-team': {
    title: 'Our Team',
    slug: 'our-team',
    status: 'published',
    meta: {
      title: 'Our Team - Paradox Marketing',
      description: 'Meet the Paradox Marketing team — determination, attention to detail, and trust.',
    },
    layout: [
      {
        blockType: 'pageBanner',
        title: 'Paradox Marketing',
        titleHighlight: 'Team',
        subtitle: 'Our team are the heart and soul of our organization. The values we recruit for are determination, attention to detail, and, above all, trust.',
      },
      {
        blockType: 'teamSection',
        title: 'Our Leadership',
        intro: 'At Paradox Marketing, leadership is about more than titles. Our team believes in trust and giving people the space to grow.',
        leadershipTitle: 'Our Leadership',
        leadershipIntro: "We're passionate about helping careers flourish, supporting clients as they scale, and using technology that truly works for people.",
        leaders: [
          { name: 'Joshua Ballard', role: 'CEO & Founder' },
          { name: 'Aiden Pearce', role: 'Chief Operating Officer' },
          { name: 'Deepak Joseph', role: 'Chief Technology Officer' },
        ],
        teamSizeTitle: "We're a team of 60+",
        teamSizeDescription: 'With talent spanning 12+ countries, the Paradox team delivers a world of perspective and a world of results.',
      },
      {
        blockType: 'technology',
        title: 'Our',
        titleHighlight: 'Technology',
        bodyHtml: '<p>You are never too small or too large to enjoy using the best technology available. Here are some of our favourites.</p>',
        rows: [
          {
            label: 'Website',
            color: '#EFB155',
            logos: [
              'https://paradoxmarketing.io/wp-content/uploads/2026/03/wp-1.png',
              'https://paradoxmarketing.io/wp-content/uploads/2026/03/shopify-1.png',
              'https://paradoxmarketing.io/wp-content/uploads/2026/03/webflow-1.png',
            ],
          },
        ],
      },
      {
        blockType: 'ctaBanner',
        title: 'Have Our Team Become YOUR Team',
        description: 'Partners with a team dedicated to your success. Our experts bring deep industry knowledge, innovative strategies, and a commitment to delivering results that matter.',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      },
    ],
  },
  capabilities: {
    title: 'Capabilities',
    slug: 'capabilities',
    status: 'published',
    meta: {
      title: 'Capabilities - Paradox Marketing',
      description: 'Full-service marketing capabilities: websites, advertising, CRM, content, SEO, and more.',
    },
    layout: [
      {
        blockType: 'pageBanner',
        title: 'Our',
        titleHighlight: 'Capabilities',
        subtitle: 'We build complete marketing systems — connecting your website, advertising, and CRM into one cohesive growth engine.',
        variant: 'dark',
      },
      {
        blockType: 'capabilitiesGrid',
        title: 'What We',
        titleHighlight: 'Specialize In',
        items: [
          { title: 'Digital Brand Development', description: 'Website design, development, SEO, and social media marketing.', url: '/capabilities/digital-brand-development', color: '#EFB155' },
          { title: 'Paid Advertising', description: 'Google Ads, Meta, LinkedIn, Bing, and retargeting campaigns.', url: '/capabilities/paid-advertising', color: '#80CBE2' },
          { title: 'CRM Strategy', description: 'Implementation, customization, dashboards, and data hygiene.', url: '/capabilities/crm-strategy', color: '#2F77B5' },
          { title: 'Content Marketing', description: 'Blog writing, website content upgrades, and resources.', url: '/capabilities/content-marketing', color: '#2F77B5' },
          { title: 'Demand Generation', description: 'Lead generation, chatbots, traffic generation, and funnel design.', url: '/capabilities/demand-generation', color: '#EFB155' },
          { title: 'Search Engine Optimization', description: 'Technical SEO, content strategy, and organic growth.', url: '/capabilities/search-engine-optimization', color: '#80CBE2' },
          { title: 'HubSpot Experts', description: 'Inbound marketing, sales onboarding, and Salesforce integration.', url: '/capabilities/hubspot-experts', color: '#2F77B5' },
          { title: 'Knowledge Management', description: 'Competitive research, data analytics, and decision-making.', url: '/capabilities/knowledge-management', color: '#EFB155' },
        ],
      },
      {
        blockType: 'ctaBanner',
        title: 'Ready to Build Your Marketing System?',
        description: 'Let us map your current systems and show you how everything can connect into one measurable growth engine.',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      },
    ],
  },
  'our-portfolio': {
    title: 'Our Portfolio',
    slug: 'our-portfolio',
    status: 'published',
    meta: {
      title: 'Our Portfolio - Paradox Marketing',
      description: 'Explore client work and case studies from Paradox Marketing.',
    },
    layout: [
      {
        blockType: 'pageBanner',
        title: 'Our',
        titleHighlight: 'Portfolio',
        subtitle: 'Client work across websites, advertising, CRM, and full marketing systems.',
      },
      {
        blockType: 'portfolio',
        title: 'Featured',
        titleHighlight: 'Work',
        useCollection: true,
        collectionLimit: 24,
      },
      {
        blockType: 'ctaBanner',
        title: 'Ready to Build Your Marketing System?',
        description: 'Let us map your current systems and show you how everything can connect into one measurable growth engine.',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      },
    ],
  },
  'capabilities/digital-brand-development': {
    title: 'Digital Brand Development',
    slug: 'capabilities/digital-brand-development',
    status: 'published',
    meta: {
      title: 'Digital Brand Development - Paradox Marketing',
      description: 'Our digital brand consultants get your brand ready for the new playing field.',
    },
    layout: [
      {
        blockType: 'pageBanner',
        title: 'Digital Brand',
        titleHighlight: 'Development',
        subtitle: 'How we help you build awareness, authority, and a cohesive brand identity online.',
      },
      {
        blockType: 'richContent',
        eyebrow: 'How we help',
        title: 'Our Digital Brand Consultants Get Your Brand Ready For The New Playing Field',
        bodyHtml: `<p>Digital branding is all about building awareness of your company online. Many different elements go into the strategy of digital brand development, including increasing brand exposure, improving your brand reputation, establishing brand authority, and solidifying your brand identity.</p>
<p>We work closely with your business to plan and execute an effective inbound branding strategy tailored to your unique brand.</p>
<h2>The World Of Marketing And Branding Is Changing As We Know It</h2>
<p>Before the advent of the Internet, marketing and branding was a simpler process. While traditional marketing can still help build your brand, it is arguably more effective (and cost-efficient) to do so online.</p>
<h2>We Apply The Inbound Methodology To All Branding</h2>
<p>The inbound methodology is a process in which you identify who your audience is, position yourself to be found by them, and then nurture them through their buyer's journey.</p>`,
      },
      {
        blockType: 'ctaBanner',
        title: 'Have Our Team Become YOUR Team',
        description: 'We will design a branding strategy applying the inbound methodology and monitor performance to achieve your goals.',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      },
    ],
  },
}

export function getFallbackPage(slug: string): Page | null {
  return pagesFallback[slug] ?? null
}

export function getAllFallbackSlugs(): string[] {
  return Object.keys(pagesFallback)
}
