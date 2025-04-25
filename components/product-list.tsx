import type { Product } from "@/types/product"
import ProductCard from "./product-card"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.Id_Product} product={product} />
      ))}
    </div>
  )
}
