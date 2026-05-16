"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  value: string
  label: string
  description?: string
  group?: string
  meta?: string
}

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  renderItem?: (option: ComboboxOption, selected: boolean) => React.ReactNode
  renderTrigger?: (option: ComboboxOption | undefined) => React.ReactNode
  ariaLabel?: string
}

export function Combobox({ value, onValueChange, options, placeholder = "Select…", searchPlaceholder = "Search…", emptyMessage = "No matches", className, renderItem, renderTrigger, ariaLabel }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [highlight, setHighlight] = React.useState(0)
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updatePos = React.useCallback(() => {
    const t = triggerRef.current
    if (!t) return
    const r = t.getBoundingClientRect()
    setPos({ top: r.bottom + 8, left: r.left, width: r.width })
  }, [])

  React.useEffect(() => {
    if (!open) return
    updatePos()
    const onScrollResize = () => updatePos()
    window.addEventListener("scroll", onScrollResize, true)
    window.addEventListener("resize", onScrollResize)
    return () => {
      window.removeEventListener("scroll", onScrollResize, true)
      window.removeEventListener("resize", onScrollResize)
    }
  }, [open, updatePos])

  const selected = options.find((o) => o.value === value)

  const filtered = React.useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q) || (o.description?.toLowerCase().includes(q) ?? false) || (o.group?.toLowerCase().includes(q) ?? false) || (o.meta?.toLowerCase().includes(q) ?? false))
  }, [options, query])

  const hasGroups = filtered.some((o) => o.group)

  const flatOrder = React.useMemo(() => {
    if (!hasGroups) return filtered
    const map = new Map<string, ComboboxOption[]>()
    for (const o of filtered) {
      const g = o.group ?? "Other"
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(o)
    }
    return Array.from(map.values()).flat()
  }, [filtered, hasGroups])

  const groupedEntries = React.useMemo(() => {
    if (!hasGroups) return null
    const map = new Map<string, ComboboxOption[]>()
    for (const o of filtered) {
      const g = o.group ?? "Other"
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(o)
    }
    return Array.from(map.entries())
  }, [filtered, hasGroups])

  React.useEffect(() => {
    if (open) {
      const idx = Math.max(
        0,
        flatOrder.findIndex((o) => o.value === value),
      )
      setHighlight(idx === -1 ? 0 : idx)
      setQuery("")
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  React.useEffect(() => {
    setHighlight(0)
  }, [query])

  React.useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onEsc)
    }
  }, [open])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, flatOrder.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === "Home") {
      e.preventDefault()
      setHighlight(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setHighlight(flatOrder.length - 1)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const o = flatOrder[highlight]
      if (o) {
        onValueChange(o.value)
        setOpen(false)
      }
    }
  }

  React.useEffect(() => {
    if (!open) return
    const item = listRef.current?.querySelector(`[data-idx="${highlight}"]`) as HTMLElement | null
    item?.scrollIntoView({ block: "nearest" })
  }, [highlight, open])

  const renderRow = (opt: ComboboxOption, idx: number) => {
    const isSel = opt.value === value
    const isHi = idx === highlight
    return (
      <li
        key={opt.value}
        data-idx={idx}
        role="option"
        aria-selected={isSel}
        onClick={() => {
          onValueChange(opt.value)
          setOpen(false)
        }}
        onMouseEnter={() => setHighlight(idx)}
        className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[14px] transition-colors", isHi && "bg-cream-100", isSel && "font-semibold text-ink")}>
        <Check className={cn("w-4 h-4 flex-shrink-0 transition-opacity", isSel ? "text-accent opacity-100" : "opacity-0")} strokeWidth={3} />
        <div className="flex-1 min-w-0">{renderItem ? renderItem(opt, isSel) : <span className="truncate block">{opt.label}</span>}</div>
        {opt.meta && <span className="font-mono text-[11px] text-stone-500 ml-2 flex-shrink-0">{opt.meta}</span>}
      </li>
    )
  }

  const panel = open && pos && (
    <div
      ref={panelRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="bg-white border-2 border-ink rounded-2xl shadow-ink-lg overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
      <div className="relative p-2 border-b-2 border-ink/10 bg-cream-50/40">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder={searchPlaceholder}
          className="w-full h-10 pl-10 pr-9 bg-white border-2 border-ink/20 rounded-xl text-[14px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-ink p-1 rounded-md hover:bg-cream-100 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-serif italic text-stone-500 text-[15px]">{emptyMessage}</p>
          {query && <p className="text-[12px] text-stone-400 mt-1 font-mono">&ldquo;{query}&rdquo;</p>}
        </div>
      ) : (
        <ul ref={listRef} role="listbox" className="max-h-[280px] overflow-y-auto p-1.5">
          {hasGroups && groupedEntries
            ? groupedEntries.map(([group, items]) => (
                <React.Fragment key={group}>
                  <li className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-[0.1em] font-semibold text-stone-500 font-mono select-none">{group}</li>
                  {items.map((opt) => renderRow(opt, flatOrder.indexOf(opt)))}
                </React.Fragment>
              ))
            : filtered.map((opt, idx) => renderRow(opt, idx))}
        </ul>
      )}

      {filtered.length > 0 && (
        <div className="px-3 py-1.5 border-t-2 border-ink/10 bg-cream-50/60 flex items-center justify-between text-[10px] text-stone-500 font-mono">
          <span>
            {filtered.length} {filtered.length === 1 ? "match" : "matches"}
          </span>
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded border border-ink/15 bg-white text-ink">↵</kbd> select · <kbd className="px-1.5 py-0.5 rounded border border-ink/15 bg-white text-ink">esc</kbd> close
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex h-11 w-full items-center justify-between rounded-xl border-2 border-ink bg-white px-3.5 py-2 text-[14px] font-medium hover:bg-cream-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0">
        <span className="truncate text-left flex-1">{renderTrigger ? renderTrigger(selected) : selected?.label ?? <span className="text-stone-500 font-normal">{placeholder}</span>}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-60 transition-transform flex-shrink-0 ml-2", open && "rotate-180")} />
      </button>

      {mounted && panel && createPortal(panel, document.body)}
    </div>
  )
}
