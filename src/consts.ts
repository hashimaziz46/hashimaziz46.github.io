// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

// Personal profile - single source for name, role and contact details used across the site
export const PROFILE = {
  name: 'Hashim Aziz',
  firstName: 'Hashim',
  initials: 'HA',
  role: 'Project Manager & Scrum Master',
  location: 'Islamabad, Pakistan',
  timeZone: 'Asia/Karachi',
  email: 'hashimaziz46@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hashim-aziz'
}

// Google Calendar booking page behind every service in the "Book a call" card.
// From Google Calendar: open the appointment schedule, Share > Website embed > Inline, and copy the
// link inside src="...". A calendar.app.google share link also works, but opens in a new tab instead
// of the pop-up. Leave it empty to fall back to an email link.
export const GOOGLE_BOOKING_PAGE =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1d-HS7yJHkhCHKVyVEQMPDFNg6-XAccoL_oUtFkdG90vNzpT5iYpMP2wpoYi6MxYn4_zXwR_mI?gv=true'

export const SITE_TITLE = 'Hashim Aziz - Project Manager & Scrum Master'
export const SITE_DESCRIPTION =
  'Hashim Aziz is a Project Manager and Scrum Master with a software engineering background, leading delivery for SaaS, fintech and HealthTech teams of up to 60 people.'

export const SITE_URL = 'https://hashimaziz46.github.io/'

export const SITE_METADATA = {
  title: {
    template: '%s - Hashim Aziz',
    default: SITE_TITLE
  },
  description: SITE_DESCRIPTION,
  keywords: ['project manager', 'scrum master', 'technical delivery lead', 'agile delivery', 'Hashim Aziz'],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  robots: {
    index: true,
    follow: true
  },
  language: 'en-US',
  locale: 'en_US',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: PROFILE.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    creator: '',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/og-image.png']
  },
  verification: {
    google: '', // Add your Google verification code
    yandex: '', // Add your Yandex verification code
    bing: '' // Add your Bing verification code
  }
}

// Social media links
export const SOCIAL_LINKS = {
  linkedin: PROFILE.linkedin
}

// Company information for structured data
export const COMPANY_INFO = {
  name: PROFILE.name,
  legalName: PROFILE.name,
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  address: {
    streetAddress: '',
    addressLocality: 'Islamabad',
    addressRegion: '',
    postalCode: '',
    addressCountry: 'PK'
  },
  contactPoint: {
    telephone: '',
    contactType: 'professional inquiries',
    email: PROFILE.email
  },
  sameAs: Object.values(SOCIAL_LINKS)
}
