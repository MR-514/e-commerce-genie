"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Facets from "@/components/facets"

export default function MobileFacets() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4" />
        <span>Filter Products</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-4/5 h-full overflow-y-auto p-4 animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Facets />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
