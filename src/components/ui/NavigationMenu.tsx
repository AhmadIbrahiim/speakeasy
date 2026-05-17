"use client"

import Link from "next/link"
import { SITE } from "@/config/site"

const NAV_LINKS = [
  { href: "/hold", label: "On-Hold" },
  { href: "/posts", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`${SITE.name} inquiry`)}`, label: "Contact", external: true },
] as const

export default function NavMenu() {
  return (
    <ul className="hidden md:flex items-center gap-1 list-none">
      {NAV_LINKS.map((item) => {
        const Tag = "external" in item && item.external ? "a" : Link
        const target = "external" in item && item.external ? { target: "_self", rel: "noopener" } : {}
        return (
          <li key={item.href}>
            <Tag
              href={item.href}
              {...target}
              className="group relative inline-flex items-center px-3 py-1.5 text-[14px] font-medium text-ink rounded-full transition-colors hover:text-accent">
              {item.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
            </Tag>
          </li>
        )
      })}
    </ul>
  )
}
