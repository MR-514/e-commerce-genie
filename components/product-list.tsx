import type { Product } from "@/types/product"
import ProductCard from "./product-card"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  console.log("list",products)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
  <ProductCard
    key={product.Id_Product || `fallback-${index}`}
    product={product}
  />
))}

    </div>
  )
}
