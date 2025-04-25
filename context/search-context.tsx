"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, isChatOpen, setIsChatOpen }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider")
  }
  return context
}
