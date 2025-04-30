"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchContext } from "@/context/search-context"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { setSearchQuery, setIsChatOpen } = useSearchContext()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      setSearchQuery(searchValue)
      setIsChatOpen(true)
      setSearchValue("")
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">E Commerce Genie</h1>

            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Fashion
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Skin Care
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block w-64">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 mt-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>

            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-gray-900 py-1">
                Home
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 py-1">
                Fashion
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 py-1">
                Skin Care
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 py-1">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 py-1">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
