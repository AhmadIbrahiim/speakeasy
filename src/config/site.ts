/**
 * Centralized site identity.
 *
 * Forkers: change the values here to rebrand. All imports across the app
 * should read from `SITE.*` rather than hardcoding strings.
 */
export const SITE = {
  name: "Perfect Greet",
  url: "https://www.perfectgreet.site",
  description: "Create professional and personalized voicemail greetings for free!",
  contactEmail: "me@ahmed-ibrahim.com",
  supportEmail: "support@perfectgreet.site",
  socials: {
    twitter: "https://twitter.com/perfectgreet",
    facebook: "https://facebook.com/perfectgreet",
    github: "https://github.com/AhmadIbrahiim/voicemail-greeting",
  },
  organization: {
    name: "Perfect Greet",
    logo: "https://www.perfectgreet.site/logo.png",
  },
} as const

export type SiteConfig = typeof SITE
