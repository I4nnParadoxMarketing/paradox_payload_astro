import type { Page } from './payload'

export const homepageFallback: Page = {
  title: 'Home',
  slug: 'home',
  status: 'published',
  meta: {
    title: 'Your Marketing Department - Paradox Marketing',
    description:
      'We have the skills, technology, and talent needed for a modern marketing department to not only hit your KPIs but crush them.',
  },
  layout: [
    {
      blockType: 'hero',
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
      blockType: 'logoMarquee',
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
      blockType: 'whatWeDo',
      title: 'What',
      titleHighlight: 'We Do',
      bodyHtml:
        "<p>We don't just <strong>sell services,</strong> we build <strong>complete marketing systems.</strong> By connecting your Website, Advertising, and CRM into a cohesive growth focused system, your marketing becomes measurable, predictable, and scalable.</p><p>We ensure your website is built to convert, your ads are targeting the right intent, and your CRM captures every data point, and feeds that intelligence back to your advertising. This creates a closed loop where we can see exactly which ad spend turned into a customer.</p>",
    },
    {
      blockType: 'serviceTriangle',
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
          ctaUrl: '/capabilities/digital-brand-development/',
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
          ctaUrl: '/capabilities/paid-advertising/',
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
          ctaUrl: '/capabilities/crm-strategy/',
        },
      ],
    },
    {
      blockType: 'problems',
      title: 'These are the',
      titleHighlight: 'common problems we solve',
      items: [
        { title: 'Wasted Ad Spend', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/spend-webp.webp' },
        { title: 'Poor Website Conversions', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/conversion-webp.webp' },
        { title: 'Lost Leads', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/leads-webp.webp' },
        { title: 'Lack of ROI Visibility', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/visibility-webp.webp' },
        { title: 'Disconnected Software', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/04/disconnected-webp.webp' },
      ],
    },
    {
      blockType: 'metrics',
      categories: [
        { title: 'Our Website Metrics', stats: [{ value: '4 million+', label: 'Organic Clicks Generated Annually' }, { value: '100+', label: 'Websites Under Management' }] },
        { title: 'Our Advertising Metrics', stats: [{ value: '6,000+', label: 'Leads Generated Each Month' }, { value: '$400K', label: 'Monthly Google Ad Spend' }] },
        { title: 'Our CRM Metrics', stats: [{ value: '1000+', label: 'Processes Automated' }, { value: '170+', label: 'Sales Reps Supported' }] },
      ],
      ctaLabel: "Let's Talk",
      ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
    },
    {
      blockType: 'workWithUs',
      title: 'What It Looks Like To',
      titleHighlight: 'Work With Us',
      subtitle: 'Paradox starts with',
      subtitleHighlight: 'understanding your current marketing systems.',
      bodyHtml:
        "<p>We take a close look at your current systems, and map out exactly how everything connects, or how it doesn't. From there, we set clear objectives, establish measurable outcomes, and make sure each stage of the process is structured and transparent so you always know what is happening and why.</p>",
      ctaLabel: "Let's Talk",
      ctaUrl: 'https://hs.paradoxmarketing.io/meetings/paradoxmarketing/discovery-call',
    },
    {
      blockType: 'testimonials',
      title: 'See What Our Clients',
      titleHighlight: 'Are Saying About Us',
      clutchLogoUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/clutch-logo-webp.webp',
      reviews: [
        { rating: 5, text: "Paradox Marketing's work has helped the client establish a solid web presence, improving their positioning.", author: 'Jared Seidenberg', position: 'COO & General Counsel, Pine Financial Group' },
        { rating: 5, text: "Paradox Marketing has brought positive changes in organic traffic, bounce rate, and users' time on site.", author: 'Albert Brown', position: 'SEO Specialist, Centeno-Schultz Clinic' },
        { rating: 5, text: 'Since partnering with Paradox Marketing, the client has tripled their site traffic, including a 20-point increase in domain rating.', author: 'Andre Oentoro', position: 'Founder, Video Production Company' },
      ],
    },
    {
      blockType: 'technology',
      title: 'Our',
      titleHighlight: 'Technology',
      bodyHtml:
        "<p>We're <strong>tech agnostic</strong>. We don't care which tools you use, as long as they work.</p><p>Most importantly: you own everything. We're here to help you grow, not to hold your assets hostage.</p>",
      rows: [
        { label: 'Website', color: '#EFB155', logos: ['https://paradoxmarketing.io/wp-content/uploads/2026/03/wp-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/woocommerce-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/webflow-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/shopify-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/bigcommerce-1.png'] },
        { label: 'Advertising', color: '#80CBE2', logos: ['https://paradoxmarketing.io/wp-content/uploads/2026/06/google-ads.webp', 'https://paradoxmarketing.io/wp-content/uploads/2026/06/linked-in-ads-1.webp', 'https://paradoxmarketing.io/wp-content/uploads/2026/06/bing-ads.webp', 'https://paradoxmarketing.io/wp-content/uploads/2026/06/meta.webp', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/reddit-ads.png'] },
        { label: 'CRM', color: '#2F77B5', logos: ['https://paradoxmarketing.io/wp-content/uploads/2026/03/hubspot-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/salesforce-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/zoho-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/pipedrive-1.png', 'https://paradoxmarketing.io/wp-content/uploads/2026/03/activecampaign-1.png'] },
      ],
    },
    {
      blockType: 'portfolio',
      title: 'Our Work',
      titleHighlight: 'Examples',
      projects: [
        { title: 'Centeno-Schultz Clinic', year: '2021', services: 'Web Design, Mobile Design, SEO, Content And Development', url: 'https://paradoxmarketing.io/portfolio/centeno-schultz-clinic/', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/03/centos-banner-image.jpg' },
        { title: 'Insurance Choice', year: '2022', services: 'Web design, Mobile Design & Development', url: 'https://paradoxmarketing.io/portfolio/insurance-choice/', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/01/Insurance-Choice-Banner-Image.webp' },
        { title: 'O2 Employment Services', year: '2021', services: 'SEO, Content, Web Design, Mobile Design, And Development', url: 'https://paradoxmarketing.io/portfolio/o2-employment-services/', imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2023/03/o2-banner-image2.jpg' },
      ],
    },
    {
      blockType: 'whoWeAre',
      title: 'Who',
      titleHighlight: 'We Are',
      imageUrl: 'https://paradoxmarketing.io/wp-content/uploads/2026/06/map-file.svg',
      bodyHtml:
        '<p>Paradox Marketing is a diverse, remote team of specialists with roots in digital strategy, technology, and real‑world problem‑solving. With talent spanning more than 12 countries and a people‑first mindset, we\'ve built a company that values trust, collaboration, and continuous learning.</p><p>We grew from early days of shared curiosity and a belief that marketing systems should work together rather than sit in silos.</p>',
    },
    {
      blockType: 'insights',
      title: 'Our Digital Marketing',
      titleHighlight: 'Insights',
      useCollection: true,
      collectionLimit: 3,
    },
  ],
}
