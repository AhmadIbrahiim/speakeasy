"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import CONSTANTS from "@/app/config/constants"
import { cn } from "@/lib/utils"

type TemplateProps = {
  onSelectTemplate: (text: string) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [open, setOpen] = useState(false)

  const categories = ["all", ...Array.from(new Set(CONSTANTS.GREETING_TEMPLATES.map((t) => t.category)))]

  const filteredTemplates = CONSTANTS.GREETING_TEMPLATES.filter((template) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = q === "" || template.title.toLowerCase().includes(q) || template.text.toLowerCase().includes(q) || template.tags.some((tag) => tag.toLowerCase().includes(q))
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-full border-2 border-ink bg-white text-ink font-medium hover:bg-cream-50 hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all gap-2 px-4">
          <BookOpen className="w-3.5 h-3.5" />
          Browse templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] w-[calc(100%-2rem)] p-0 overflow-hidden bg-cream-100 border-[2.5px] border-ink rounded-3xl shadow-ink-xl max-h-[88vh]">
        <div className="flex flex-col max-h-[88vh]">
          <DialogHeader className="px-6 pt-6 pb-4 text-left">
            <span className="inline-flex items-center gap-2 self-start bg-ink text-cream-100 px-3 py-1 rounded-full text-[11px] font-medium -rotate-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
              Template library · {CONSTANTS.GREETING_TEMPLATES.length} scripts
            </span>
            <DialogTitle className="font-serif text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.05] text-ink">Start from a script that already works.</DialogTitle>
            <p className="text-stone-600 text-[14px] mt-1.5">Pick one, then tweak the [bracketed] bits.</p>
          </DialogHeader>

          {/* Search */}
          <div className="px-6 pb-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search by title, content, or tag…"
                className="pl-10 pr-10 h-11 bg-white border-2 border-ink rounded-xl text-[14px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 focus-visible:border-ink"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-ink p-1 rounded-md hover:bg-cream-100"
                  aria-label="Clear search">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category
              const count = category === "all" ? CONSTANTS.GREETING_TEMPLATES.length : CONSTANTS.GREETING_TEMPLATES.filter((t) => t.category === category).length
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-[13px] font-medium transition-all",
                    active ? "border-ink bg-ink text-cream-100" : "border-ink bg-white text-ink hover:bg-cream-50 hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5",
                  )}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <span className={cn("font-mono text-[10.5px] tabular-nums", active ? "text-cream-200/80" : "text-stone-500")}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* Results */}
          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="space-y-3">
              {filteredTemplates.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-serif italic text-stone-500 text-[16px]">No template matches that search.</p>
                  {searchQuery && <p className="text-[13px] text-stone-400 mt-1 font-mono">&ldquo;{searchQuery}&rdquo;</p>}
                </div>
              ) : (
                filteredTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onSelectTemplate(template.text)
                      setOpen(false)
                    }}
                    className="group w-full text-left p-4 sm:p-5 bg-white border-2 border-ink rounded-2xl hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block bg-ink text-cream-100 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider">{template.category}</span>
                      </div>
                      <span className="font-mono text-[10.5px] text-stone-500 group-hover:text-accent transition-colors flex-shrink-0">Use →</span>
                    </div>
                    <h3 className="font-serif font-semibold text-[18px] tracking-[-0.01em] mb-1.5">{template.title.replace(/^[A-Za-z]+ - /, "")}</h3>
                    <p className="text-[13.5px] text-stone-600 line-clamp-2 leading-relaxed mb-3">{template.text}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="inline-flex items-center px-2 py-0.5 rounded-full bg-cream-100 border border-ink/15 text-[10.5px] text-stone-600 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer with result count */}
          <div className="px-6 py-3 border-t-2 border-ink/10 bg-cream-200/50 flex items-center justify-between text-[12px] font-mono text-stone-600">
            <span>
              {filteredTemplates.length} {filteredTemplates.length === 1 ? "result" : "results"}
            </span>
            <span className="hidden sm:inline">click any card to load</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
