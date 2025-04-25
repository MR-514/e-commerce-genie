"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Facets from "@/components/facets"
import { useSearchContext } from "@/context/search-context"

export default function CollapsibleFacets() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isChatOpen } = useSearchContext()

  // Collapse facets when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setIsCollapsed(true)
    } else {
      setIsCollapsed(false)
    }
  }, [isChatOpen])

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out border-r border-gray-200 bg-white ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <h2 className="font-bold text-lg">Filter Products</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={isCollapsed ? "mx-auto" : ""}
          aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
          <Facets />
        </div>
      )}
    </div>
  )
}
