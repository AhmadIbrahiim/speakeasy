"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import CONSTANTS from "@/app/config/constants"
import { cn } from "@/lib/utils"

type TemplateProps = {
  onSelectTemplate: (text: string) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get unique categories from templates
  const categories = ["all", ...Array.from(new Set(CONSTANTS.GREETING_TEMPLATES.map((template) => template.category)))]

  // Filter templates based on search query and selected category
  const filteredTemplates = CONSTANTS.GREETING_TEMPLATES.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Browse Template Library
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle>Voicemail Greeting Templates</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search templates..." className="pl-8" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
          </div>
        </DialogHeader>

        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start space-x-1 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="min-w-max">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onSelectTemplate(template.text)
                      }}>
                      <h3 className="font-medium">{template.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{template.text}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {template.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredTemplates.length === 0 && <div className="text-center py-8 text-gray-500">No templates match your search.</div>}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
