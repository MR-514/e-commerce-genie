import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProductSuggestionProps {
  title: string
  price: string
  originalPrice?: string
  color: string
  imageUrl: string
  productUrl: string
  isStealDeal?: boolean
}

export default function ProductSuggestion({
  title,
  price,
  originalPrice,
  color,
  imageUrl,
  productUrl,
  isStealDeal = false,
}: ProductSuggestionProps) {
  // Extract product ID from URL for internal navigation
  const extractProductId = (url: string) => {
    const parts = url.split("/")
    const lastPart = parts[parts.length - 1]
    if (lastPart.includes("_")) {
      return lastPart.split("_")[0]
    }
    return lastPart
  }

  const productId = extractProductId(productUrl)
  const internalUrl = `/product/${productId}`

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={internalUrl}>
        <div className="relative h-48 bg-gray-100">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-contain" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>

        <div className="flex items-center space-x-2 mb-2">
          <span className="font-bold">{price}</span>
          {originalPrice && <span className="text-sm text-gray-500 line-through">{originalPrice}</span>}
          {isStealDeal && <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">🔥 Steal Deal!</span>}
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-gray-600">Color: {color}</span>
          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }}></div>
        </div>

        <div className="flex space-x-2">
          <Button asChild className="w-full">
            <Link href={internalUrl}>View Details</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href={productUrl} target="_blank" rel="noopener noreferrer">
              View on Store
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
