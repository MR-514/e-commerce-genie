"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import ChatWindow from "@/components/chat-window"
import ProductList from "@/components/product-list"
import CollapsibleFacets from "@/components/collapsible-facets"
import { products } from "@/data/products"
import { useSearchContext } from "@/context/search-context"
import ChatButton from "@/components/chat-button"

export default function ProductsPage() {
  const { isChatOpen } = useSearchContext()
  const [widthClass, setWidthClass] = useState("md:w-[calc(100%-16rem)]")

  useEffect(() => {
    setWidthClass(isChatOpen ? "md:w-[calc(100%-24rem)]" : "md:w-[calc(100%-16rem)]")
  }, [isChatOpen])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 relative">
        {/* Facets sidebar */}
        <div className="hidden md:block">
          <CollapsibleFacets />
        </div>

        {/* Product listing area */}
        <div
          className={`w-full transition-all duration-300 ${
            isChatOpen
              ? "md:w-[calc(100%-24rem-3rem)]" // Account for both chat width and collapsed facets
              : "md:w-[calc(100%-16rem)]"
          } p-4`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">All Products</h1>
            <div className="flex space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Fashion</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">Skin Care</span>
            </div>
          </div>

          <ProductList products={products} />
        </div>

        {/* Chat window */}
        {isChatOpen && <ChatWindow />}
      </main>

      {/* Floating chat button */}
      <ChatButton />
    </div>
  )
}
