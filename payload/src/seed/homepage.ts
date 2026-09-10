import type { PayloadRequest } from 'payload'
import config from '@payload-config'
import { getPayload } from 'payload'

type PageSeed = {
  title: string
  slug: string
  status: 'published' | 'draft'
  meta?: { title?: string; description?: string }
  layout: Record<string, unknown>[]
}

const homepageSeed: PageSeed = {
  title: 'Home',
  slug: 'home',
  status: 'published' as const,
  meta: {
    title: 'Your Marketing Department - Paradox Marketing',
    description:
      'We have the skills, technology, and talent needed for a modern marketing department to not only hit your KPIs but crush them.',
  },
  layout: [
    {
      blockType: 'hero' as const,
      heading: 'Everything Clicks When Your',
      headingHighlight: 'Marketing Connects',
      description:
        "We don't just sell services; we build the marketing infrastructure your business needs to scale. By connecting your digital presence into one cohesive system, we ensure no lead falls through the cracks and every marketing dollar works toward a specific objective. With a transparent, 1-month opt-out model, we put the burden of proof on our results, not a long-term contract.",
      ctaLabel: "Let's Talk",
      ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
      videoPoster: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/hero-bg-scaled.webp',
      videoUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/pdx-video-compressed.mp4',
      triangleImage: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/hero-triangle-2.webp',
    },
    {
      blockType: 'logoMarquee' as const,
      label: 'Highly Trusted by',
      labelHighlight: 'leading brands',
      logos: [
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/hummingbird-networks-e1773798037595.webp', width: 600, height: 174 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/movebuddha.webp', width: 400, height: 120 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/cm-logo-2.svg', width: 404, height: 132 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/regenexx_las_vegas.svg', width: 288, height: 72 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/Centeno-Schultz-LOGO-300x300-2.webp', width: 640, height: 640 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/mopec-logo-400x128-1.webp', width: 400, height: 128 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/Bedrock-Communities.png', width: 241, height: 52 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/lgccdxlogo_teal.webp', width: 667, height: 238 },
        { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/sprintlaw-logo-lg-aug-2023.png', width: 382, height: 83 },
      ],
    },
    {
      blockType: 'whatWeDo' as const,
      title: 'What',
      titleHighlight: 'We Do',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: "We don't just ", version: 1 },
                { type: 'text', text: 'sell services, ', format: 1, version: 1 },
                { type: 'text', text: 'we build ', version: 1 },
                { type: 'text', text: 'complete marketing systems.', format: 1, version: 1 },
                { type: 'text', text: ' By connecting your Website, Advertising, and CRM into a cohesive growth focused system, your marketing becomes measurable, predictable, and scalable.', version: 1 },
              ],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'We ensure your website is built to convert, your ads are targeting the right intent, and your CRM captures every data point, and feeds that intelligence back to your advertising. This creates a closed loop where we can see exactly which ad spend turned into a customer.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      blockType: 'serviceTriangle' as const,
      services: [
        {
          serviceKey: 'website',
          title: 'Websites',
          color: '#EFB155',
          features: [
            { text: 'High-conversion landing pages' },
            { text: 'SEO & organic growth strategy' },
            { text: 'Messaging & content alignment' },
            { text: 'Mobile and performance optimisation' },
            { text: 'Analytics & event tracking' },
          ],
          ctaLabel: 'Learn More About Websites',
          ctaUrl: 'https://paradoxmarketing.io/capabilities/digital-brand-development/',
        },
        {
          serviceKey: 'ads',
          title: 'Advertising',
          color: '#80CBE2',
          features: [
            { text: 'Google Ads & Performance Max' },
            { text: 'Meta advertising campaigns' },
            { text: 'Retargeting & audience testing' },
            { text: 'Conversion tracking & attribution' },
            { text: 'Budget optimisation & reporting' },
          ],
          ctaLabel: 'Learn More About Advertising',
          ctaUrl: 'https://paradoxmarketing.io/capabilities/paid-advertising/',
        },
        {
          serviceKey: 'crm',
          title: 'CRMs',
          color: '#2F77B5',
          features: [
            { text: 'Automated email & SMS follow-ups' },
            { text: 'Pipeline visibility & forecasting' },
            { text: 'Lead scoring & segmentation' },
            { text: 'Deep-funnel conversion tracking' },
            { text: 'Data hygiene & process automation' },
          ],
          ctaLabel: 'Learn More About CRMs',
          ctaUrl: 'https://paradoxmarketing.io/capabilities/crm-strategy/',
        },
      ],
    },
    {
      blockType: 'problems' as const,
      title: 'These are the',
      titleHighlight: 'common problems we solve',
      items: [
        { title: 'Wasted Ad Spend', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/spend-webp.webp', imageWidth: 396, imageHeight: 668 },
        { title: 'Poor Website Conversions', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/conversion-webp.webp', imageWidth: 484, imageHeight: 712 },
        { title: 'Lost Leads', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/leads-webp.webp', imageWidth: 616, imageHeight: 648 },
        { title: 'Lack of ROI Visibility', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/visibility-webp.webp', imageWidth: 684, imageHeight: 732 },
        { title: 'Disconnected Software', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/disconnected-webp.webp', imageWidth: 1032, imageHeight: 936 },
      ],
    },
    {
      blockType: 'metrics' as const,
      categories: [
        {
          title: 'Our Website Metrics',
          stats: [
            { value: '4 million+', label: 'Organic Clicks Generated Annually' },
            { value: '100+', label: 'Websites Under Management' },
          ],
        },
        {
          title: 'Our Advertising Metrics',
          stats: [
            { value: '6,000+', label: 'Leads Generated Each Month' },
            { value: '$400K', label: 'Monthly Google Ad Spend' },
          ],
        },
        {
          title: 'Our CRM Metrics',
          stats: [
            { value: '1000+', label: 'Processes Automated' },
            { value: '170+', label: 'Sales Reps Supported' },
          ],
        },
      ],
      ctaLabel: "Let's Talk",
      ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
    },
    {
      blockType: 'workWithUs' as const,
      title: 'What It Looks Like To',
      titleHighlight: 'Work With Us',
      subtitle: 'Paradox starts with',
      subtitleHighlight: 'understanding your current marketing systems.',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "We take a close look at your current systems, and map out exactly how everything connects, or how it doesn't. From there, we set clear objectives, establish measurable outcomes, and make sure each stage of the process is structured and transparent so you always know what is happening and why.",
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      ctaLabel: "Let's Talk",
      ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
    },
    {
      blockType: 'testimonials' as const,
      title: 'See What Our Clients Are',
      titleHighlight: 'Saying About Us',
      clutchLogoUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/clutch-logo-webp.webp',
      reviews: [
        { rating: 5, text: "Paradox Marketing's work has helped the client establish a solid web presence, improving their positioning.", author: 'Jared Seidenberg', position: 'COO & General Counsel, Pine Financial Group' },
        { rating: 5, text: 'Paradox Marketing has successfully transformed the client\'s idea into a fully realized product that has driven revenue for the company.', author: 'Anonymous', position: 'Executive Producer, Harmony Healthcare International, Inc.' },
        { rating: 5, text: "Paradox Marketing has brought positive changes in organic traffic, bounce rate, and users' time on site.", author: 'Albert Brown', position: 'SEO Specialist, Centeno-Schultz Clinic' },
      ],
    },
    {
      blockType: 'technology' as const,
      title: 'Our',
      titleHighlight: 'Technology',
      intro: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: "We're tech agnostic. We don't care which tools you use, as long as they work.", version: 1 }], version: 1 },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      rows: [
        {
          label: 'Website',
          color: '#EFB155',
          logos: [
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/wp-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/woocommerce-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/webflow-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/shopify-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/bigcommerce-1.png', width: 120, height: 60 },
          ],
        },
        {
          label: 'Advertising',
          color: '#80CBE2',
          logos: [
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/google-ads.webp', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/linked-in-ads-1.webp', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/bing-ads.webp', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/meta.webp', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/reddit-ads.png', width: 120, height: 60 },
          ],
        },
        {
          label: 'CRM',
          color: '#2F77B5',
          logos: [
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/hubspot-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/salesforce-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/zoho-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/pipedrive-1.png', width: 120, height: 60 },
            { url: 'https://paradoxmarketing.io/wp-content/uploads/2026/03/activecampaign-1.png', width: 120, height: 60 },
          ],
        },
      ],
    },
    {
      blockType: 'portfolio' as const,
      title: 'Our Work',
      titleHighlight: 'Examples',
      projects: [
        {
          title: 'Centeno-Schultz Clinic',
          year: '2021',
          services: 'Web Design, Mobile Design, SEO, Content And Development',
          url: 'https://paradoxmarketing.io/portfolio/centeno-schultz-clinic/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/03/centos-banner-image.jpg',
        },
        {
          title: 'Insurance Choice',
          year: '2022',
          services: 'Web design, Mobile Design & Development',
          url: 'https://paradoxmarketing.io/portfolio/insurance-choice/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/01/Insurance-Choice-Banner-Image.webp',
        },
        {
          title: 'O2 Employment Services',
          year: '2021',
          services: 'SEO, Content, Web Design, Mobile Design, And Development',
          url: 'https://paradoxmarketing.io/portfolio/o2-employment-services/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/03/o2-banner-image2.jpg',
        },
      ],
    },
    {
      blockType: 'whoWeAre' as const,
      title: 'Who',
      titleHighlight: 'We Are',
      imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/map-file.svg',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Paradox Marketing is a diverse, remote team of specialists with roots in digital strategy, technology, and real‑world problem‑solving. With talent spanning more than 12 countries and a people‑first mindset, we\'ve built a company that values trust, collaboration, and continuous learning.',
                  version: 1,
                },
              ],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'We grew from early days of shared curiosity and a belief that marketing systems should work together rather than sit in silos. Today, we bring that same collaborative culture to every engagement, blending global perspectives with practical knowledge to support our clients and each other.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      blockType: 'insights' as const,
      title: 'Our Digital Marketing',
      titleHighlight: 'Insights',
      posts: [
        {
          title: 'What Social Media Marketing Really Takes to Work',
          date: 'August 25, 2026',
          url: 'https://paradoxmarketing.io/blog/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/08/Social-Media-Marketing@2x-1024x433.webp',
        },
        {
          title: 'Online Reputation Management: Protecting Your Digital Brand',
          date: 'August 24, 2026',
          url: 'https://paradoxmarketing.io/blog/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/08/Reputation-Management@2x-1024x433.webp',
        },
        {
          title: 'What Professional Website Design Actually Involves',
          date: 'August 24, 2026',
          url: 'https://paradoxmarketing.io/blog/',
          imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/08/Website-Design-Development@2x-1024x433.webp',
        },
      ],
    },
  ],
}

async function upsertPage(payload: Awaited<ReturnType<typeof getPayload>>, data: PageSeed) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: data.slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`Updated: ${data.slug}`)
  } else {
    await payload.create({ collection: 'pages', data })
    console.log(`Created: ${data.slug}`)
  }
}

const innerPageSeeds = [
  {
    title: 'Contact Us',
    slug: 'contact-us',
    status: 'published' as const,
    meta: { title: 'Contact Us - Paradox Marketing', description: 'Contact Paradox Marketing.' },
    layout: [
      {
        blockType: 'contactSection' as const,
        title: 'Contact',
        titleHighlight: 'Us',
        bodyHtml: `<p>We'd love to hear from you! Whether you're looking to boost your sales, refine your marketing strategy, or explore new ways to grow your business, our team is here to help.</p><p>Let's start the conversation and explore how we can support your success.</p>`,
        phone: '(08) 7134 5850',
        phoneTel: '0871345850',
        ctaLabel: "Let's Talk",
        ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
        hubspotPortalId: '431748',
        hubspotFormId: 'add70aed-7818-46f7-aa5d-d79337b357d2',
      },
    ],
  },
  {
    title: 'Our Team',
    slug: 'our-team',
    status: 'published' as const,
    meta: { title: 'Our Team - Paradox Marketing', description: 'Meet the Paradox Marketing team.' },
    layout: [
      { blockType: 'pageBanner' as const, title: 'Paradox Marketing', titleHighlight: 'Team', subtitle: 'Our team are the heart and soul of our organization.' },
      {
        blockType: 'teamSection' as const,
        title: 'Our Leadership',
        leadershipIntro: "We're passionate about helping careers flourish and supporting clients as they scale.",
        leaders: [
          { name: 'Joshua Ballard', role: 'CEO & Founder' },
          { name: 'Aiden Pearce', role: 'Chief Operating Officer' },
          { name: 'Deepak Joseph', role: 'Chief Technology Officer' },
        ],
        teamSizeTitle: "We're a team of 60+",
        teamSizeDescription: 'With talent spanning 12+ countries, the Paradox team delivers a world of perspective and results.',
      },
      { blockType: 'ctaBanner' as const, title: 'Have Our Team Become YOUR Team', description: 'Partners with a team dedicated to your success.', ctaLabel: "Let's Talk", ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call' },
    ],
  },
  {
    title: 'Capabilities',
    slug: 'capabilities',
    status: 'published' as const,
    meta: { title: 'Capabilities - Paradox Marketing', description: 'Full-service marketing capabilities.' },
    layout: [
      { blockType: 'pageBanner' as const, title: 'Our', titleHighlight: 'Capabilities', subtitle: 'We build complete marketing systems.' },
      {
        blockType: 'capabilitiesGrid' as const,
        title: 'What We',
        titleHighlight: 'Specialize In',
        items: [
          { title: 'Digital Brand Development', description: 'Website design, SEO, and social media.', url: '/capabilities/digital-brand-development', color: '#EFB155' },
          { title: 'Paid Advertising', description: 'Google Ads, Meta, LinkedIn campaigns.', url: '/capabilities/paid-advertising', color: '#80CBE2' },
          { title: 'CRM Strategy', description: 'Implementation and data hygiene.', url: '/capabilities/crm-strategy', color: '#2F77B5' },
        ],
      },
    ],
  },
]

async function seed() {
  const payload = await getPayload({ config })
  await upsertPage(payload, homepageSeed)
  for (const page of innerPageSeeds) {
    await upsertPage(payload, page)
  }
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
