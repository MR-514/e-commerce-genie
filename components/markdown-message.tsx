"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import Link from "next/link"
import ProductSuggestion from "./product-suggestion"

interface MarkdownMessageProps {
  content: string
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  const [productSuggestions, setProductSuggestions] = useState<any[]>([])

  useEffect(() => {
    const parseProductSuggestions = () => {
      const suggestions: any[] = []

      // Regex updated to match your markdown structure
      const productRegex = /\*\*(.+?)\*\*\s*[\r\n]+- Price: (₹[\d,]+)(?:\s*~~(₹[\d,]+)~~)?\s*[\r\n]+- Color: (\w+)\s*[\r\n]+- !\[.*?\]\((.*?)\)\s*[\r\n]+- Product link: \[(.*?)\]\((.*?)\)(?:\s*[\r\n]+- (🔥.*))?/g

      let match
      while ((match = productRegex.exec(content)) !== null) {
        const [_, title, price, originalPrice, color, imageUrl, linkText, productUrl, stealDeal] = match

        suggestions.push({
          title,
          price,
          originalPrice,
          color,
          imageUrl,
          productUrl,
          isStealDeal: !!stealDeal,
        })
      }

      setProductSuggestions(suggestions)
    }

    parseProductSuggestions()
  }, [content])

  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => (
            <div className="my-2">
              <Image
                src={props.src || ""}
                alt={props.alt || "Product image"}
                width={200}
                height={200}
                className="rounded-md object-contain"
              />
            </div>
          ),
          a: ({ node, ...props }) => (
            <Link href={props.href || "#"} className="text-blue-600 hover:underline">
              {props.children}
            </Link>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {productSuggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-3">Suggested Products:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productSuggestions.map((product, index) => (
              <ProductSuggestion
                key={index}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                color={product.color}
                imageUrl={product.imageUrl}
                productUrl={product.productUrl}
                isStealDeal={product.isStealDeal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
