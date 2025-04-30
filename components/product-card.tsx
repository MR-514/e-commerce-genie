import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

function toNumber(value: string | number | undefined): number | null {
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "")
    const num = Number(cleaned)
    return isNaN(num) ? null : num
  }
  if (typeof value === "number") {
    return value
  }
  return null
}

function getFirstWord(str: string): string {
  return str.split(" ")[0]
}

function getRestOfName(str: string): string {
  return str.split(" ").slice(1).join(" ")
}

function extractUrlsFromMarkdown(markdownText: string): string[] {
  const regex = /\[.*?\]\((https?:\/\/[^\s]+)\)/g
  const matches = []
  let match
  while ((match = regex.exec(markdownText)) !== null) {
    matches.push(match[1])
  }
  return matches
}


export default function ProductCard({ product }: ProductCardProps) {

  
  let price = toNumber(product.price)
  let originalPrice = toNumber(product.originalPrice)
  if (price === null || price === 0) {
    price = originalPrice
    originalPrice = null
  }

  const showDiscount = originalPrice !== null && price !== null && originalPrice > price
  const discount = showDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : null

 
  const brand = product.Brand || getFirstWord(product.name)
  const description = product.Description || getRestOfName(product.name)
  const imageUrl = product.URL_image || product.image

  const externalUrl =
  product.link ||
  product.Product_URL ||
  extractUrlsFromMarkdown(product.markdownText || "")[0] ||
  ""

  const handleClick = () => {
    if (typeof window !== "undefined") {
      const markdownText = product.markdownText || ""
      const extractedUrls = extractUrlsFromMarkdown(markdownText)

      
      console.log("Markdown:", markdownText)
      console.log("Extracted URLs:", extractedUrls)
      console.log("Final external URL:", externalUrl)
      
      const productToStore = {
        ...product,
        Brand: brand,
        Description: description,
        "Discount Price (in Rs.)": price,
        "Product Price": originalPrice ?? price,
        Product_URL: externalUrl ,  // ✅ Save external URL only, not internal
        URL_image: imageUrl,
        ExtractedURLs: extractedUrls,
      }
      

      localStorage.setItem("selectedProduct", JSON.stringify(productToStore))
    }
  }

  // ✅ Always redirect to internal page
  return (
    <Link href="/product" onClick={handleClick} className="group">
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-64 bg-gray-100">
          <Image
            src={imageUrl}
            alt={description}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-500 uppercase mb-1">{brand}</div>

          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600">
            {description}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
  {product["Discount Price (in Rs.)"] && product["Product Price"] ? (
    <>
      <span className="font-bold">₹{product["Discount Price (in Rs.)"]}</span>
      <span className="text-sm text-gray-500 line-through">₹{product["Product Price"]}</span>
    </>
  ) : (
    <>
      <span className="font-bold">₹{price}</span>
      {originalPrice !== null && originalPrice > price && price !== 0 && (
        <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
      )}
    </>
  )}
</div>

            </div>

            {showDiscount && discount !== null && (
              <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
