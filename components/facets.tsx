"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface FacetOption {
  id: string
  label: string
  count: number
}

interface FacetGroupProps {
  title: string
  options: FacetOption[]
  onChange: (selectedOptions: string[]) => void
}

function FacetGroup({ title, options, onChange }: FacetGroupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selected, setSelected] = useState<string[]>([])

  const handleToggle = (optionId: string) => {
    const newSelected = selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]

    setSelected(newSelected)
    onChange(newSelected)
  }

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1">
          {options.map((option) => (
            <label key={option.id} className="flex items-center space-x-2 cursor-pointer py-1">
              <div
                className={`w-4 h-4 border rounded flex items-center justify-center ${
                  selected.includes(option.id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                }`}
                onClick={() => handleToggle(option.id)}
              >
                {selected.includes(option.id) && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm">
                {option.label} <span className="text-gray-400">({option.count})</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function PriceRangeSlider() {
  const [priceRange, setPriceRange] = useState([300, 1200])

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex items-center justify-between w-full text-left font-medium mb-4">
        Price Range
        <ChevronDown className="h-4 w-4 transform rotate-180" />
      </button>

      <div className="px-2">
        <Slider
          defaultValue={[300, 1200]}
          max={2000}
          step={100}
          onValueChange={(value) => setPriceRange(value as number[])}
        />

        <div className="flex justify-between mt-2 text-sm">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}

function ColorSelector() {
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const colors = [
    { id: "white", color: "#ffffff", border: true },
    { id: "black", color: "#000000" },
    { id: "navy", color: "#000080" },
    { id: "red", color: "#ff0000" },
    { id: "green", color: "#008000" },
    { id: "blue", color: "#0000ff" },
    { id: "yellow", color: "#ffff00", border: true },
    { id: "purple", color: "#800080" },
    { id: "pink", color: "#ffc0cb" },
    { id: "orange", color: "#ffa500" },
    { id: "brown", color: "#a52a2a" },
    { id: "gray", color: "#808080" },
  ]

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex items-center justify-between w-full text-left font-medium mb-4">
        Colors
        <ChevronDown className="h-4 w-4 transform rotate-180" />
      </button>

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`w-6 h-6 rounded-full ${color.border ? "border border-gray-300" : ""} ${
              selectedColors.includes(color.id) ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
            style={{ backgroundColor: color.color }}
            onClick={() => toggleColor(color.id)}
            aria-label={`Select ${color.id} color`}
          />
        ))}
      </div>
    </div>
  )
}

function RatingFilter() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const ratings = [5, 4, 3, 2, 1]

  return (
    <div className="border-b border-gray-200 py-4">
      <button className="flex items-center justify-between w-full text-left font-medium mb-4">
        Customer Rating
        <ChevronDown className="h-4 w-4 transform rotate-180" />
      </button>

      <div className="space-y-2">
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center space-x-2 cursor-pointer py-1">
            <div
              className={`w-4 h-4 border rounded flex items-center justify-center ${
                selectedRating === rating ? "bg-blue-500 border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedRating(rating === selectedRating ? null : rating)}
            >
              {selectedRating === rating && <Check className="h-3 w-3 text-white" />}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-500">& Up</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function Facets() {
  const handleBrandChange = (selected: string[]) => {
    console.log("Selected brands:", selected)
  }

  const handleCategoryChange = (selected: string[]) => {
    console.log("Selected categories:", selected)
  }

  return (
    <div className="space-y-2">
      <FacetGroup
        title="Brand"
        options={[
          { id: "netplay", label: "Netplay", count: 12 },
          { id: "performax", label: "Performax", count: 8 },
          { id: "indian-garage", label: "The Indian Garage Co", count: 15 },
          { id: "john-players", label: "John Players Jeans", count: 7 },
          { id: "levis", label: "Levi's", count: 22 },
          { id: "adidas", label: "Adidas", count: 18 },
          { id: "nike", label: "Nike", count: 14 },
        ]}
        onChange={handleBrandChange}
      />

      <PriceRangeSlider />

      <ColorSelector />

      <FacetGroup
        title="Category"
        options={[
          { id: "tshirts", label: "T-Shirts", count: 45 },
          { id: "shirts", label: "Shirts", count: 38 },
          { id: "jeans", label: "Jeans", count: 27 },
          { id: "trousers", label: "Trousers", count: 19 },
          { id: "jackets", label: "Jackets", count: 12 },
        ]}
        onChange={handleCategoryChange}
      />

      <RatingFilter />

      <FacetGroup
        title="Discount"
        options={[
          { id: "10-percent", label: "10% Off or More", count: 104 },
          { id: "25-percent", label: "25% Off or More", count: 87 },
          { id: "50-percent", label: "50% Off or More", count: 43 },
          { id: "70-percent", label: "70% Off or More", count: 12 },
        ]}
        onChange={() => {}}
      />

      <Button variant="outline" className="w-full mt-4">
        Clear All Filters
      </Button>
    </div>
  )
}
