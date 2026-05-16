import { SITE } from "@/config/site"

const CONSTANTS = {
  BG_MUSIC: [
    {
      text: "Popular corporate upbeat",
      file: "popular-corporate-upbeat",
      categories: ["Corporate"],
    },
    {
      text: "Upbeat ukulele",
      file: "upbeat-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Modern corporate",
      file: "modern-corporate",
      categories: ["Corporate"],
    },
    {
      text: "Happy ukulele",
      file: "happy-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Corporate Motivational",
      file: "corporate-motivational",
      categories: ["Corporate"],
    },
    {
      text: "Whistling clapping ukulele",
      file: "whistling-clapping-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Corporate upbeat minimal",
      file: "corporate-upbeat-minimal",
      categories: ["Corporate"],
    },
    {
      text: "Only ukulele",
      file: "only-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Upbeat corporate",
      file: "upbeat-corporate",
      categories: ["Corporate"],
    },
    {
      text: "Ukulele trip happy",
      file: "ukulele-trip-happy",
      categories: ["Ukulele"],
    },
    {
      text: "Inspiring clapping",
      file: "inspiring-clapping",
      categories: ["Corporate"],
    },
    {
      text: "Happy mood and ukulele",
      file: "happy-mood-and-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Motivate corporate",
      file: "motivate-corporate",
      categories: ["Corporate"],
    },
    {
      text: "Upbeat ukulele fun",
      file: "upbeat-ukulele-fun",
      categories: ["Ukulele"],
    },
    {
      text: "Corporate inspiring",
      file: "corporate-inspiring",
      categories: ["Corporate"],
    },
    {
      text: "Energic ukulele",
      file: "energic-ukulele",
      categories: ["Ukulele"],
    },
    {
      text: "Successful construction",
      file: "successful-construction",
      categories: ["Corporate"],
    },
    {
      text: "Blue lagoon",
      file: "blue-lagoon",
      categories: ["Ukulele"],
    },
    {
      text: "Climbing higher",
      file: "climbing-higher",
      categories: ["Corporate"],
    },
    {
      text: "Happy ukulele song",
      file: "happy-ukulele-song",
      categories: ["Ukulele"],
    },
    {
      text: "Corporate minimalist",
      file: "corporate-minimalist",
      categories: ["Corporate"],
    },
    {
      text: "Happy corporate",
      file: "happy-corporate",
      categories: ["Corporate"],
    },
    {
      text: "Electro uplifting",
      file: "electro-uplifting",
      categories: ["Corporate"],
    },
    {
      text: "Happy bells",
      file: "happy-bells",
      categories: ["Corporate"],
    },
    {
      text: "Chilled indie folk",
      file: "chilled-indie-folk",
      categories: ["Guitar"],
    },
    {
      text: "Forest ambient",
      file: "forest-ambient",
      categories: ["Guitar"],
    },
    {
      text: "Guitars minimalist",
      file: "guitars-minimalist",
      categories: ["Guitar"],
    },
    {
      text: "Inspiring ambient",
      file: "inspiring-ambient",
      categories: ["Guitar"],
    },
    {
      text: "Relaxing acoustic guitar",
      file: "relaxing-acoustic-guitar",
      categories: ["Guitar"],
    },
    {
      text: "Wedding moment",
      file: "wedding-moment",
      categories: ["Piano"],
    },
    {
      text: "Exciting piano",
      file: "exciting-piano",
      categories: ["Piano"],
    },
    {
      text: "For elise prelude",
      file: "for-elise-prelude",
      categories: ["Piano"],
    },
    {
      text: "Inspiration piano calm",
      file: "inspiration-piano-calm",
      categories: ["Piano"],
    },
    {
      text: "Flaing piano",
      file: "flaing-piano",
      categories: ["Piano"],
    },
    {
      text: "Piano bar jazz",
      file: "piano-bar-jazz",
      categories: ["Jazz"],
    },
    {
      text: "Allegro finale",
      file: "allegro-finale",
      categories: ["Jazz"],
    },
    {
      text: "Andante in c",
      file: "andante-in-c",
      categories: ["Jazz"],
    },
    {
      text: "Live cabbage",
      file: "live-cabbage",
      categories: ["Jazz"],
    },
    {
      text: "Called to win",
      file: "called-to-win",
      categories: ["Various"],
    },
    {
      text: "Funky trap sax",
      file: "funky-trap-sax",
      categories: ["Various"],
    },
    {
      text: "Epic sport",
      file: "epic-sport",
      categories: ["Various"],
    },
    {
      text: "Epic drums",
      file: "epic-drums",
      categories: ["Various"],
    },
    {
      text: "Drill ye Chinese",
      file: "drill-ye-chinese",
      categories: ["Various"],
    },
    {
      text: "Positiv trumpet",
      file: "positiv-trumpet",
      categories: ["Various"],
    },
    {
      text: "Summer saxophone",
      file: "summer-saxophone",
      categories: ["Various"],
    },
    {
      text: "Beach saxophone",
      file: "beach-saxophone",
      categories: ["Various"],
    },
    {
      text: "Lofi night dreaming",
      file: "lofi-night-dreaming",
      categories: ["Various"],
    },
    {
      text: "Lofi walk",
      file: "lofi-walk",
      categories: ["Various"],
    },
    {
      text: "Lofi morning",
      file: "lofi-morning",
      categories: ["Various"],
    },
    {
      text: "Chill home",
      file: "chill-home",
      categories: ["Various"],
    },
    {
      text: "Fairy tale story",
      file: "fairy-tale-story",
      categories: ["Various"],
    },
    {
      text: "it is happy",
      file: "it-is-happy",
      categories: ["Various"],
    },
    {
      text: "First day of spring",
      file: "first-day-of-spring",
      categories: ["Various"],
    },
    {
      text: "Upcoming hapiness",
      file: "upcoming-hapiness",
      categories: ["Various"],
    },
    {
      text: "Happy motivation",
      file: "happy-motivation",
      categories: ["Various"],
    },
  ],

  // Greeting Templates categorized by use case
  GREETING_TEMPLATES: [
    {
      title: "Professional - Standard",
      text: "Thank you for calling. I'm unable to take your call right now. Please leave your name, number, and a brief message, and I'll return your call as soon as possible.",
      category: "Professional",
      tags: ["formal", "standard", "general"],
    },
    {
      title: "Professional - Out of Office",
      text: "Thank you for calling. I'm currently out of the office and will return on [date]. If you need immediate assistance, please contact [alternate contact]. Otherwise, leave a message and I'll respond when I return.",
      category: "Professional",
      tags: ["formal", "out of office", "vacation"],
    },
    {
      title: "Professional - After Hours",
      text: "You've reached [business name]. We're currently closed, but our business hours are [hours]. Please leave a message and we'll get back to you during our next business day.",
      category: "Professional",
      tags: ["business", "after hours", "closed"],
    },
    {
      title: "Business - Customer Service",
      text: "Thank you for calling [business name] customer service. We're unable to take your call right now, but your business is important to us. Please leave your name, phone number, and a brief description of how we can help, and one of our representatives will get back to you within 24 hours.",
      category: "Business",
      tags: ["customer service", "support", "business"],
    },
    {
      title: "Business - Sales Team",
      text: "Thank you for your interest in [business name]. Our sales team is currently assisting other customers. Please leave your name, number, and the product or service you're interested in, and a sales representative will contact you shortly.",
      category: "Business",
      tags: ["sales", "business", "customers"],
    },
    {
      title: "Medical Office",
      text: "You've reached [medical office name]. We're unable to take your call at the moment. If this is a medical emergency, please hang up and dial 911. Otherwise, please leave your name, number, and a brief message, and we'll return your call as soon as possible.",
      category: "Specialized",
      tags: ["medical", "healthcare", "emergency"],
    },
    {
      title: "Legal Office",
      text: "Thank you for calling [law firm name]. We're unable to take your call right now. Please leave your name, contact information, and a brief description of your legal matter. An attorney will review your message and get back to you promptly. Please note that leaving a message does not establish an attorney-client relationship.",
      category: "Specialized",
      tags: ["legal", "law firm", "attorney"],
    },
    {
      title: "Friendly - Personal",
      text: "Hi there! You've reached [your name]. I can't come to the phone right now, but leave me a message and I'll call you back as soon as I can. Have a great day!",
      category: "Personal",
      tags: ["casual", "friendly", "personal"],
    },
    {
      title: "Friendly - Family",
      text: "Hello! You've reached the [family name] residence. We're not available to take your call right now. Please leave us a message with your name and number, and we'll get back to you as soon as we can. Thanks for calling!",
      category: "Personal",
      tags: ["family", "home", "casual"],
    },
    {
      title: "Holiday - Office Closure",
      text: "Thank you for calling [business name]. Our office is currently closed for the holiday season from [start date] to [end date]. We will resume normal business hours on [return date]. Please leave a message and we'll get back to you when we return. Happy holidays!",
      category: "Seasonal",
      tags: ["holiday", "closure", "seasonal"],
    },
  ],
}

/** @deprecated Use `SITE.url` from `@/config/site` instead. */
export const PROD_URL = SITE.url

export default CONSTANTS
