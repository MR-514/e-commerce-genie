"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import ChatWindow from "@/components/chat-window"
import ProductList from "@/components/product-list"
import { products } from "@/data/products"
import MobileFacets from "@/components/mobile-facets"
import Pagination from "@/components/pagination"
import ChatButton from "@/components/chat-button"
import { useSearchContext } from "@/context/search-context"
import CollapsibleFacets from "@/components/collapsible-facets"

const PRODUCTS_PER_PAGE = 10

interface Product {
  name: string;
  price: string;
  originalPrice: string | null;
  image: string;
  link: string;
  Product_URL: string;
  Brand: string;
  Description: string;
  Id_Product: string;
  // Add other fields as required
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [botProducts, setBotProducts] = useState<string>("")
  const [parsedBotProducts, setParsedBotProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!botProducts || typeof botProducts !== "string") return;

    const parsed = botProducts
      .trim()
      .split(/\n\s*\n/)
      .map((block: string) => {
        const nameMatch = block.match(/\*\*(.*?)\*\*/);
        const currentPriceMatch = block.match(/for ₹([\d,]+)/);
        const originalPriceMatch = block.match(/~~₹([\d,]+)~~/);
        const imageMatch = block.match(/!\[.*?\]\((.*?)\)/);
        const linkMatch = block.match(/\[Product Link\]\((.*?)\)/);

        // Map to Product type, including placeholders for missing fields
        return {
          name: nameMatch?.[1] || "",
          price: currentPriceMatch?.[1] || "",
          originalPrice: originalPriceMatch?.[1] || null,
          image: imageMatch?.[1] || "",
          Product_URL: linkMatch?.[1] || "",
          Brand: "", // Add a placeholder or fetch actual data
          Description: "", // Add a placeholder or fetch actual data
          Id_Product: "", // Add a placeholder or fetch actual data
          // Add other missing fields if needed
        };
      });
console.log("parsed",parsed)
    setParsedBotProducts(parsed);
  }, [botProducts]);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 relative">
        {/* Facets sidebar - hidden on mobile, collapsible on larger screens */}
        <div className="hidden md:block">
          <CollapsibleFacets />
        </div>

        {/* Product listing area (adjusts width based on screen size and chat state) */}
        <div
          className={`w-full transition-all duration-300 ${useSearchContext().isChatOpen ? "md:w-[calc(100%-24rem-3rem)]" : "md:w-[calc(100%-16rem)]"} p-4 overflow-y-auto`}
        >
          {/* Banner */}
          <div className="mb-6 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white p-6 relative">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Discover Your Style</h2>
                <p className="mb-4 max-w-md">Explore our curated collection of premium products across categories.</p>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <span className="bg-blue-600 w-3 h-3 rounded-full mr-2"></span>
                      Fashion Collection
                    </h3>
                    <p className="text-sm mb-3">Latest trends with up to 50% off on selected items.</p>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors text-sm">
                      Shop Fashion
                    </button>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <span className="bg-pink-500 w-3 h-3 rounded-full mr-2"></span>
                      Skincare Essentials
                    </h3>
                    <p className="text-sm mb-3">Premium products from top brands with special offers.</p>
                    <button className="bg-white text-pink-600 px-4 py-2 rounded-md font-medium hover:bg-pink-50 transition-colors text-sm">
                      Shop Skincare
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 opacity-10">
                <svg width="240" height="240" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="5" />
                  <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="5" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="5" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Product Comparison</h1>
            <div className="flex space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Fashion</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">Skin Care</span>
            </div>
          </div>

          {/* Mobile facets - only visible on mobile */}
          <div className="md:hidden mb-6">
            <MobileFacets />
          </div>

          {/* ProductList */}
          <ProductList
            products={parsedBotProducts.length > 0 ? parsedBotProducts : paginatedProducts}
          />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>

        {/* Chat window - rendered conditionally with fixed positioning */}
        {useSearchContext().isChatOpen && <ChatWindow updateBotProducts={setBotProducts} />}
      </main>

      {/* Floating chat button */}
      <ChatButton />
    </div>
  )
}
