import { useEffect, useState } from 'react'
import type { Product } from "@/types/product"
import ProductCard from "./product-card"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const [validProducts, setValidProducts] = useState<Product[]>([])

  useEffect(() => {
    // Simulate an async operation for data processing or update
    const timer = setTimeout(() => {
      // Apply the filter after data is loaded (if any condition is met)
      const filteredProducts = products.filter((product) =>
        product.name 
      )
      setValidProducts(filteredProducts) // Set filtered data
    }, 1000) // Set appropriate delay time to simulate "loading" or async data fetching

    return () => clearTimeout(timer) // Clean up the timeout
  }, [products]) // Reapply filter when `products` change

  // Initially show the raw data, then later apply the filter
  const displayedProducts = validProducts.length > 0 ? validProducts : products

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedProducts.map((product, index) => (
        <ProductCard
          key={product.Id_Product || `fallback-${index}`}
          product={product}
        />
      ))}
    </div>
  )
}
