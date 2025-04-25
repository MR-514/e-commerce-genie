import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.Id_Product}`} className="group">
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-64 bg-gray-100">
          <Image
            src={product.URL_image || "/placeholder.svg"}
            alt={product.Description}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-500 uppercase mb-1">{product.Brand}</div>
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600">{product.Description}</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold">₹{product["Discount Price (in Rs.)"]}</span>
              <span className="text-sm text-gray-500 line-through">₹{product["Product Price"]}</span>
            </div>

            <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
              {Math.round((1 - product["Discount Price (in Rs.)"] / product["Product Price"]) * 100)}% OFF
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
