"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  url: string
  discount?: string
}

interface SearchContextProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isChatOpen: boolean
  setIsChatOpen: (isOpen: boolean) => void
  apiProducts: Product[]
  setApiProducts: (products: Product[]) => void
}

const SearchContext = createContext<SearchContextProps>({
  searchQuery: "",
  setSearchQuery: () => {},
  isChatOpen: false,
  setIsChatOpen: () => {},
  apiProducts: [],
  setApiProducts: () => {},
})

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [apiProducts, setApiProducts] = useState<Product[]>([])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isChatOpen,
        setIsChatOpen,
        apiProducts,
        setApiProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => useContext(SearchContext)