"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import ChatWindow from "@/components/chat-window"
import ChatButton from "@/components/chat-button"
import { products } from "@/data/products"
import { Button } from "@/components/ui/button"
import { useSearchContext } from "@/context/search-context"
import { useEffect, useState } from "react"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((p) => p.Id_Product === params.id)
  const { isChatOpen } = useSearchContext()
  const [widthClass, setWidthClass] = useState("md:w-full")

  useEffect(() => {
    setWidthClass(isChatOpen ? "md:w-3/5 lg:w-3/4" : "md:w-full")
  }, [isChatOpen])

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 relative">
        <div
          className={`w-full transition-all duration-300 ${
            isChatOpen
              ? "md:w-[calc(100%-24rem-3rem)]" // Account for both chat width and collapsed facets
              : "md:w-full"
          } p-6 overflow-y-auto`}
        >
          <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.URL_image || "/placeholder.svg"}
                alt={product.Description}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <div className="text-sm text-gray-500 uppercase mb-1">{product.Brand}</div>
              <h1 className="text-2xl font-bold mb-4">{product.Description}</h1>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl font-bold">₹{product["Discount Price (in Rs.)"]}</span>
                <span className="text-gray-500 line-through">₹{product["Product Price"]}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {Math.round((1 - product["Discount Price (in Rs.)"] / product["Product Price"]) * 100)}% OFF
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.Color }}
                  />
                  <span className="capitalize">{product.Color}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                <span className="px-3 py-1 bg-gray-100 rounded-full">{product.Category_by_gender}</span>
              </div>

              <div className="space-y-3">
                <Button className="w-full">Add to Cart</Button>
                <Button variant="outline" className="w-full">
                  <Link href={product.Product_URL} target="_blank" className="w-full">
                    View Original
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat window - rendered conditionally */}
        {isChatOpen && <ChatWindow />}
      </main>

      {/* Floating chat button */}
      <ChatButton />
    </div>
  )
}
