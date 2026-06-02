/**
 * Centralized site identity.
 *
 * Forkers: change the values here to rebrand. All imports across the app
 * should read from `SITE.*` rather than hardcoding strings.
 */
export const SITE = {
  name: "Speakeasy",
  url: "https://voicemail.ahmed-ibrahim.com",
  description: "Create professional and personalized voicemail greetings for free!",
  contactEmail: "me@ahmed-ibrahim.com",
  supportEmail: "support@perfectgreet.site",
  socials: {
    twitter: "https://twitter.com/perfectgreet",
    facebook: "https://facebook.com/perfectgreet",
    github: "https://github.com/AhmadIbrahiim/speakeasy",
    buyMeACoffee: "https://www.buymeacoffee.com/ahmadibrahiim",
  },
  openSource: {
    enabled: true,
    license: "MIT",
    repo: "AhmadIbrahiim/speakeasy",
  },
  organization: {
    name: "Speakeasy",
    logo: "https://voicemail.ahmed-ibrahim.com/logo.png",
  },
} as const

export type SiteConfig = typeof SITE
