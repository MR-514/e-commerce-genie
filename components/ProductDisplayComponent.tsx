"use client"

import { useState } from "react"
import { ExternalLink, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  url: string
  discount?: string
}

interface ProductDisplayProps {
  products: Product[]
}

export default function ProductDisplay({ products }: ProductDisplayProps) {
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({})

  if (!products || products.length === 0) {
    return null
  }

  const handleAddToCart = (productId: string) => {
    setAddedToCart(prev => ({
      ...prev,
      [productId]: true
    }))
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({
        ...prev,
        [productId]: false
      }))
    }, 2000)
  }

  
  const handleClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedProduct", JSON.stringify(product))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative">
            <img
              src={product.image || "/api/placeholder/300/200"}
              alt={product.name}
              className="object-cover w-full h-48"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/api/placeholder/300/200"
                target.alt = "Image not available"
              }}
            />
            {product.discount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.discount}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center mt-1 mb-3">
              <span className="font-semibold text-lg">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-gray-500 line-through text-sm">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={addedToCart[product.id] ? "secondary" : "default"}
                className="flex-1"
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                {addedToCart[product.id] ? "Added!" : "Add to Cart"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(product.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}